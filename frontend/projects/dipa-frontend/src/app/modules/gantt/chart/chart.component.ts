import { ResizedEvent } from 'angular-resize-event';
import * as d3 from 'd3';
import {
  Increment,
  IncrementsService,
  Milestone,
  MilestonesService,
  Task,
  TasksService,
  Timeline,
  TimelinesIncrementService,
  TimelinesService,
} from 'dipa-api-client';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { GanttControlsService } from '../gantt-controls.service';
import { Increments } from './chart-elements/Increments';
import { MilestonesArea } from './chart-elements/MilestonesArea';
import { ProjectDuration } from './chart-elements/ProjectDuration';
import { TasksArea } from './chart-elements/TasksArea';
import { XAxis } from './chart-elements/XAxis';
import { MatRadioChange } from '@angular/material/radio';
import { ScaleTime } from 'd3-scale';
import { ZoomBehavior } from 'd3-zoom';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() incrementsData: Increment[];
  @Input() milestoneData: Milestone[];
  @Input() taskData: Task[];
  @Input() timelineData: Timeline;
  @Input() projectStartDate: Date;
  @Input() projectEndDate: Date;

  @ViewChild('chart')
  chartFigure: ElementRef;
  chartElement: HTMLElement = this.elementRef.nativeElement;

  periodStartDate: Date;
  periodEndDate: Date;

  viewType: string;

  arrangeLabelTimeout;

  periodStartDateSubscription: Subscription;
  periodEndDateSubscription: Subscription;

  viewTypeSubscription: Subscription;

  headerX: XAxis;
  projectDuration: ProjectDuration;
  milestoneViewItem: MilestonesArea;
  taskViewItem: TasksArea;
  incrementsViewItem: Increments;

  milestoneSubscription: Subscription;
  taskSubscription: Subscription;
  addIncrementSubscription: Subscription;
  deleteIncrementSubscription: Subscription;
  timelineSubscription: Subscription;
  timelineStartSubscription: Subscription;
  timelineEndSubscription: Subscription;

  modifiable: boolean;
  showMenu: boolean;

  showMilestoneMenu: boolean;

  selectedMilestoneDataMenu: Milestone;
  selectedMilestoneId: number;

  statusList = { open: 'offen', done: 'erledigt' };

  // element for chart
  private svg: d3.Selection<any, any, any, any>;
  private zoomElement: d3.Selection<any, any, any, any>;

  private viewBoxHeight = 300;
  private viewBoxWidth = 750;

  private padding = { top: 40, left: 0 };

  private xScale: ScaleTime<any, any>;
  private zoom: ZoomBehavior<any, any>;

  private oneDayTick = 1.2096e9;

  constructor(
    public ganttControlsService: GanttControlsService,
    private milestonesService: MilestonesService,
    private tasksService: TasksService,
    private timelinesService: TimelinesService,
    private incrementService: IncrementsService,
    private timelinesIncrementService: TimelinesIncrementService,
    private elementRef: ElementRef
  ) {
    d3.formatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['€', ''],
    });

    d3.timeFormatDefaultLocale({
      dateTime: '%a %b %e %X %Y',
      date: '%d.%m.%Y',
      time: '%H:%M:%S',
      periods: ['AM', 'PM'],
      days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      months: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
      shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    });
  }

  ngOnInit(): void {
    this.showMilestoneMenu = false;
    this.showMenu = true;

    // TODO: this is just temporary
    this.modifiable = this.timelineData.projectApproachId !== 3;

    this.periodStartDateSubscription = this.ganttControlsService.getPeriodStartDate().subscribe((data) => {
      if (this.periodStartDate !== data) {
        this.periodStartDate = data;

        if (this.xScale) {
          this.refreshXScale();
          this.redrawChart(200);
        }
      }
    });

    this.periodEndDateSubscription = this.ganttControlsService.getPeriodEndDate().subscribe((data) => {
      if (this.periodEndDate !== data) {
        this.periodEndDate = data;

        if (this.xScale) {
          this.refreshXScale();
          this.redrawChart(200);
        }
      }
    });

    if (this.chartElement.id.includes('overview')) {
      this.periodStartDate = new Date(this.timelineData.start);
      this.periodEndDate = new Date(this.timelineData.end);
      this.showMenu = false;
    }

    this.viewTypeSubscription = this.ganttControlsService.getViewType().subscribe((data) => {
      if (this.viewType !== data) {
        this.viewType = data;

        if (this.xScale) {
          switch (data) {
            case 'DAYS': {
              this.headerX.formatDate = this.headerX.formatDateDay;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, this.oneDayTick / 5);
              });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'WEEKS': {
              this.headerX.formatDate = this.headerX.formatDateWeek;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, (this.oneDayTick * 7) / 12);
              });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'MONTHS': {
              this.headerX.formatDate = this.headerX.formatDateMonth;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, (this.oneDayTick * 30) / 12);
              });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'YEARS': {
              this.headerX.formatDate = this.headerX.formatDateYear;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, (this.oneDayTick * 365) / 12);
              });
              this.refreshXScale();
              this.redrawChart(0);
              break;
            }
            case null: {
              this.headerX.formatDate = this.headerX.formatDateFull;
              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, this.oneDayTick);
              });

              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
          }
        }
      }
    });

    d3.select(this.chartElement).select('figure').append('div').attr('class', 'tooltip');

    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.taskData && !changes.taskData.isFirstChange()) ||
      (changes.milestoneData && !changes.milestoneData.isFirstChange())
    ) {
      this.drawChart();
    }
  }

  ngOnDestroy(): void {
    this.periodStartDateSubscription.unsubscribe();
    this.periodEndDateSubscription.unsubscribe();

    this.milestoneSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
    this.addIncrementSubscription?.unsubscribe();
    this.deleteIncrementSubscription?.unsubscribe();
    this.timelineSubscription?.unsubscribe();
    this.timelineStartSubscription?.unsubscribe();
    this.timelineEndSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.resizeChart(this.chartFigure.nativeElement.offsetWidth);
  }

  getDate(date: string): any {
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

    return new Date(date).toLocaleDateString('de-DE', dateOptions);
  }

  changeStatus(event: MatRadioChange): void {
    const changeMilestoneStatus$ = this.milestonesService.updateMilestoneData(
      this.timelineData.id,
      this.selectedMilestoneDataMenu.id,
      {
        status: event.value,
      }
    );

    this.milestoneSubscription = this.subscribeForReset(changeMilestoneStatus$);
  }

  closeMenu(): void {
    this.showMilestoneMenu = false;
    this.milestoneViewItem.onCloseMenu();
    this.selectedMilestoneId = null;
  }

  onResized(event: ResizedEvent): void {
    // only resize if width was changed, height is not relevant here
    if (event.newWidth !== this.viewBoxWidth) {
      this.resizeChart(event.newWidth);
    }
  }

  public createSvg(element: HTMLElement, id: number): d3.Selection<any, any, any, any> {
    const svg = d3
      .select(element)
      .select('figure')
      .append('svg')
      .attr('id', id)
      .attr('width', '100%')
      // .attr('height', '100vh')
      .attr('viewBox', `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`);

    svg
      .append('defs')
      .append('mask')
      .attr('id', 'dataMask')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.viewBoxWidth - this.padding.left)
      .attr('height', this.viewBoxHeight - this.padding.top);

    return svg;
  }

  resizeSvg(newSize: number): void {
    this.svg.attr('viewBox', `0 0 ${newSize} ${this.viewBoxHeight}`);

    this.svg.select('#dataMask rect').attr('width', newSize - this.padding.left);
  }

  // no ordering
  returnZero(): number {
    return 0;
  }

  private drawChart(): void {
    if (!this.svg) {
      this.svg = this.createSvg(this.chartElement, +this.chartElement.id);
      this.initializeSvgGraphElements();

      // zoom out a bit to show all data at start
      this.svg
        .transition()
        .duration(0)
        .call(this.zoom.scaleBy, 0.8)
        .on('end', () => this.refreshXScale());
    }

    this.initializeXScale();

    this.headerX = new XAxis(this.svg, this.chartElement, this.xScale);
    this.headerX.formatDate = this.headerX.formatDateFull;
    this.headerX.draw();

    this.projectDuration = new ProjectDuration(this.svg, this.chartElement, this.xScale, this.timelineData, true);
    this.projectDuration.draw();

    this.projectDuration.onDragEnd = (offsetDays: number) => {
      if (offsetDays !== 0) {
        const moveTimeline$ = this.timelinesService.applyOperation(this.timelineData.id, {
          operation: 'moveTimeline',
          days: offsetDays,
        });
        this.timelineSubscription = this.subscribeForRedraw(moveTimeline$);
      } else {
        this.projectDuration.redraw(200);
      }
    };

    this.projectDuration.onDragEndProjectStart = (offsetDays: number) => {
      if (offsetDays !== 0) {
        const moveTimelineStart$ = this.timelinesService.applyOperation(this.timelineData.id, {
          operation: 'moveTimelineStart',
          days: offsetDays,
        });
        this.timelineStartSubscription = this.subscribeForRedraw(moveTimelineStart$);
      } else {
        this.projectDuration.redraw(200);
      }
    };

    this.projectDuration.onDragEndProjectEnd = (offsetDays: number) => {
      if (offsetDays !== 0) {
        const moveTimelineEnd$ = this.timelinesService.applyOperation(this.timelineData.id, {
          operation: 'moveTimelineEnd',
          days: offsetDays,
        });
        this.timelineEndSubscription = this.subscribeForRedraw(moveTimelineEnd$);
      } else {
        this.projectDuration.redraw(200);
      }
    };

    this.taskViewItem = new TasksArea(this.svg, this.xScale, this.taskData);
    this.taskViewItem.draw({ left: 0, top: 0 });

    this.milestoneViewItem = new MilestonesArea(
      this.svg,
      this.chartElement,
      this.xScale,
      this.milestoneData,
      this.modifiable,
      this.showMenu,
      this.timelineData.id,
      this.timelineData
    );
    this.milestoneViewItem.draw({ left: 0, top: this.taskViewItem.getAreaHeight() });

    this.milestoneViewItem.onDragEndMilestone = (offsetDays: number, id: number) => {
      if (offsetDays !== 0) {
        const moveMilestone$ = this.timelinesService.applyOperation(this.timelineData.id, {
          operation: 'moveMilestone',
          days: offsetDays,
          movedMilestoneId: id,
        });

        this.milestoneSubscription = this.subscribeForRedraw(moveMilestone$);
      } else {
        this.milestoneViewItem.redraw({ left: 0, top: this.taskViewItem.getAreaHeight() }, 200);
      }
    };

    this.milestoneViewItem.onSelectMilestone = (data: Milestone) => {
      if (data.id !== this.selectedMilestoneId) {
        this.showMilestoneMenu = true;
        this.selectedMilestoneDataMenu = data;
        this.selectedMilestoneId = data.id;
      } else {
        this.closeMenu();
      }
    };

    this.incrementsViewItem = new Increments(this.svg, this.xScale, this.incrementsData, this.timelineData.id);
    this.incrementsViewItem.draw({ left: 0, top: this.taskViewItem.getAreaHeight() });

    this.incrementsViewItem.onClickAddButton = () => {
      const addIncrement$ = this.timelinesIncrementService.addIncrement(this.timelineData.id);
      this.addIncrementSubscription = this.subscribeForReset(addIncrement$);
    };
    this.incrementsViewItem.onClickDeleteButton = () => {
      const deleteIncrement$ = this.timelinesIncrementService.deleteIncrement(this.timelineData.id);
      this.deleteIncrementSubscription = this.subscribeForReset(deleteIncrement$);
    };
  }

  private redrawChart(animationDuration): void {
    const ticksList = this.xScale.ticks();

    this.svg.select('g.x-group').selectAll('text.outsideXAxisLabel').remove();

    switch (this.viewType) {
      case 'WEEKS': {
        const numberTicks = d3.timeWeek.count(ticksList[0], ticksList[ticksList.length - 1]) + 1;

        if (numberTicks === 1) {
          const textOutsideBox = this.xScale(ticksList[0]) < this.xScale.range()[1];

          if (textOutsideBox) {
            this.svg
              .select('g.x-group')
              .append('text')
              .attr('class', 'outsideXAxisLabel')
              .text(this.headerX.formatDateWeek(ticksList[1]))
              .attr('x', 10)
              .attr('y', 18);
          }
        }

        if (numberTicks > 12) {
          this.headerX.tickSetting = null;
        } else {
          this.headerX.tickSetting = d3.timeMonday.every(1);
        }

        break;
      }
      case 'MONTHS': {
        const numberTicks = d3.timeMonth.count(ticksList[0], ticksList[ticksList.length - 1]) + 1;

        if (numberTicks === 1) {
          const textOutsideBox = this.xScale(ticksList[0]) < this.xScale.range()[1];

          if (textOutsideBox) {
            this.svg
              .select('g.x-group')
              .append('text')
              .attr('class', 'outsideXAxisLabel')
              .text(this.headerX.formatDateMonth(ticksList[0]))
              .attr('x', 10)
              .attr('y', 18);
          }
        }

        if (numberTicks > 12) {
          this.headerX.tickSetting = null;
        } else {
          this.headerX.tickSetting = d3.timeMonth.every(1);
        }
        break;
      }
      case 'YEARS': {
        const numberTicks = d3.timeYear.count(ticksList[0], ticksList[ticksList.length - 1]) + 1;

        if (numberTicks === 1) {
          const textOutsideBox = this.xScale(ticksList[0]) < this.xScale.range()[1];

          if (textOutsideBox) {
            this.svg
              .select('g.x-group')
              .append('text')
              .attr('class', 'outsideXAxisLabel')
              .text(this.headerX.formatDateYear(ticksList[0]))
              .attr('x', 10)
              .attr('y', 18);
          }
        }

        if (numberTicks > 12) {
          this.headerX.tickSetting = null;
        } else {
          this.headerX.tickSetting = d3.timeYear.every(1);
        }
        break;
      }
      // case 'DAYS' :
      default: {
        const numberTicks = d3.timeDay.count(ticksList[0], ticksList[ticksList.length - 1]) + 1;

        if (numberTicks > 12) {
          this.headerX.tickSetting = null;
        } else {
          this.headerX.tickSetting = d3.timeDay.every(1);
        }
        break;
      }
    }
    this.headerX.redraw();
    this.projectDuration.redraw(animationDuration);

    this.taskViewItem.redraw({ left: 0, top: 0 });
    this.milestoneViewItem.redraw({ left: 0, top: this.taskViewItem.getAreaHeight() }, animationDuration);
    this.incrementsViewItem.redraw({ left: 0, top: this.taskViewItem.getAreaHeight() });
  }

  private resizeChart(newSize: number): void {
    this.resizeXScale(newSize);
    this.resizeZoomElement(newSize);
    this.resizeSvg(newSize);

    this.headerX.resize(newSize);

    this.viewBoxWidth = newSize;
    this.redrawChart(0);
    this.rearrangeLabels(0);
  }

  private initializeSvgGraphElements(): void {
    const xGroup = this.svg.append('g').attr('class', 'x-group');
    xGroup.attr('transform', `translate(${this.padding.left},20)`);

    this.zoom = d3.zoom().on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
      this.onZoom(event, this.oneDayTick);
    });

    this.zoomElement = this.svg
      .append('rect')
      .attr('class', 'zoomAreaX')
      .attr('width', this.viewBoxWidth - this.padding.left)
      .attr('height', this.viewBoxHeight - this.padding.top)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', `translate(${this.padding.left},${this.padding.top})`)
      .call(this.zoom);

    const projectGroup = this.svg.append('g').attr('class', 'project-group');
    projectGroup.attr('transform', `translate(${this.padding.left},45)`);

    const incrementGroup = this.svg
      .append('g')
      .attr('class', 'increment-group')
      .attr('id', `incrementsArea${this.timelineData.id}`);
    incrementGroup.attr('transform', `translate(${this.padding.left},${this.padding.top + 30})`);

    const dataGroup = this.svg
      .append('g')
      .attr('class', 'data-group')
      .attr('id', `milestonesArea${this.timelineData.id}`);
    dataGroup.attr('transform', `translate(${this.padding.left},${this.padding.top + 60})`);

    const currentDateGroup = this.svg.append('g').attr('class', 'current-date-group');
    currentDateGroup.attr('transform', `translate(${this.padding.left},0)`);

    dataGroup.attr('mask', 'url(#dataMask)');
  }

  private onZoom(event: d3.D3ZoomEvent<any, any>, minTimeMs: number): void {
    const eventTransform: d3.ZoomTransform = event.transform;

    if (eventTransform.k === 1 && eventTransform.x === 0 && eventTransform.y === 0) {
      return;
    }

    // this check is needed to prevent additional zooming on the minimum/maximum zoom level
    // because zoom.transform is reset and the zoom levels are reinitiated every time
    if (event.sourceEvent) {
      const deltaY = (event.sourceEvent as WheelEvent).deltaY;
      if ((deltaY < 0 && eventTransform.y > 0) || (deltaY > 0 && eventTransform.y < 0)) {
        return;
      }
    }

    const xScaleTransformed = eventTransform.rescaleX<ScaleTime<any, any>>(this.xScale);

    const start = xScaleTransformed.domain()[0];
    const end = xScaleTransformed.domain()[1];

    this.setZoomScaleExtent(minTimeMs);
    // zoom to new start and end dates
    this.xScale.domain([start, end]);

    if (event.sourceEvent) {
      if ((event.sourceEvent as MouseEvent).type === 'mousemove') {
        this.redrawChart(0);
      } else {
        this.redrawChart(200);
        this.rearrangeLabels(200);
      }
    } else {
      this.redrawChart(0);
    }

    // reset the transform so the scale can be changed from other elements like dropdown menu
    this.zoomElement.call(this.zoom.transform, d3.zoomIdentity);

    this.periodStartDate = xScaleTransformed.invert(xScaleTransformed.range()[0]);
    this.periodEndDate = xScaleTransformed.invert(xScaleTransformed.range()[1]);

    if (this.chartElement.id.includes('gantt')) {
      this.ganttControlsService.setPeriodStartDate(this.periodStartDate);
      this.ganttControlsService.setPeriodEndDate(this.periodEndDate);
    }
  }

  private rearrangeLabels(timeout: number) {
    clearTimeout(this.arrangeLabelTimeout);
    this.arrangeLabelTimeout = setTimeout(() => {
      this.milestoneViewItem.arrangeLabels();
    }, timeout);
  }

  // set minimum and maximum zoom levels
  private setZoomScaleExtent(minTimeMs: number): void {
    // const minTimeMs = 1.2096e+9; // 14 days to show 1 day ticks
    const maxTimeMs = 3.1536e11; // ~ 10 years

    const widthMs = this.periodEndDate.getTime() - this.periodStartDate.getTime();

    const minScaleFactor = widthMs / maxTimeMs;
    const maxScaleFactor = widthMs / minTimeMs;

    this.zoom.scaleExtent([minScaleFactor, maxScaleFactor]);
  }

  // Set X axis
  private initializeXScale(): void {
    this.xScale = d3
      .scaleTime()
      .domain([this.periodStartDate, this.periodEndDate])
      .range([0, this.viewBoxWidth - this.padding.left]);
    this.setZoomScaleExtent(this.oneDayTick);
  }

  private refreshXScale(): void {
    this.xScale.domain([this.periodStartDate, this.periodEndDate]);
    this.setZoomScaleExtent(this.oneDayTick);
  }

  private resizeXScale(newSize): void {
    this.xScale.range([0, newSize - this.padding.left]);
  }

  private resizeZoomElement(newSize): void {
    this.zoomElement.attr('width', newSize - this.padding.left);
  }

  // redraw if data was changed but no additional data was added or removed
  private subscribeForRedraw(obs: Observable<any>): Subscription {
    return obs
      .pipe(
        switchMap(() =>
          forkJoin([
            this.timelinesService.getTimelines(),
            this.tasksService.getTasksForTimeline(this.timelineData.id),
            this.milestonesService.getMilestonesForTimeline(this.timelineData.id),
            this.incrementService.getIncrementsForTimeline(this.timelineData.id),
          ])
        )
      )
      .subscribe(([timelinesData, taskData, milestoneData, incrementsData]) => {
        this.setData(timelinesData, taskData, milestoneData, incrementsData);

        this.projectDuration.redraw(200);
        this.taskViewItem.redraw({ left: 0, top: 0 });
        this.milestoneViewItem.redraw({ left: 0, top: this.taskViewItem.getAreaHeight() }, 200);
        this.incrementsViewItem.redraw({ left: 0, top: this.taskViewItem.getAreaHeight() });
      });
  }

  // reset if data was added or removed
  private subscribeForReset(obs: Observable<any>): Subscription {
    return obs
      .pipe(
        switchMap(() =>
          forkJoin([
            this.timelinesService.getTimelines(),
            this.tasksService.getTasksForTimeline(this.timelineData.id),
            this.milestonesService.getMilestonesForTimeline(this.timelineData.id),
            this.incrementService.getIncrementsForTimeline(this.timelineData.id),
          ])
        )
      )
      .subscribe(([timelinesData, taskData, milestoneData, incrementsData]) => {
        this.setData(timelinesData, taskData, milestoneData, incrementsData);

        this.projectDuration.redraw(200);
        this.taskViewItem.reset({ left: 0, top: 0 });
        this.milestoneViewItem.reset({ left: 0, top: this.taskViewItem.getAreaHeight() });
        this.incrementsViewItem.reset({ left: 0, top: this.taskViewItem.getAreaHeight() });
      });
  }

  private setData(
    timelinesData: Timeline[],
    taskData: Task[],
    milestoneData: Milestone[],
    incrementsData: Increment[]
  ): void {
    this.timelineData = timelinesData.find((c) => c.id === this.timelineData.id);
    this.projectDuration.setData(this.timelineData);

    this.taskData = taskData;
    this.taskViewItem.setData(taskData);

    this.milestoneData = milestoneData;
    this.milestoneViewItem.setData(milestoneData);

    this.selectedMilestoneDataMenu = milestoneData.find((m) => m.id === this.selectedMilestoneId);

    this.incrementsData = incrementsData;
    this.incrementsViewItem.setData(incrementsData);
  }
}
