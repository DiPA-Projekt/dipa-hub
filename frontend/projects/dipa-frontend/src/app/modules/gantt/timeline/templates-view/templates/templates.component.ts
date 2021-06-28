import { ResizedEvent } from 'angular-resize-event';
import * as d3 from 'd3';
import {
  Increment,
  TimelineTemplate,
  TimelineTemplatesService,
  Timeline,
  TimelinesService,
  InlineObject,
} from 'dipa-api-client';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { Increments } from '../../../chart/chart-elements/Increments';
import { MilestonesArea } from '../../../chart/chart-elements/MilestonesArea';
import { ProjectDuration } from '../../../chart/chart-elements/ProjectDuration';
import { TasksArea } from '../../../chart/chart-elements/TasksArea';
import { XAxis } from '../../../chart/chart-elements/XAxis';
import { TemplatesViewControlsService } from '../templates-view-controls.service';
import { ScaleTime } from 'd3-scale';
import { ZoomBehavior } from 'd3-zoom';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TemplatesComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() showTitle: boolean;
  @Input() active: boolean;
  @Input() timelineData: Timeline;
  @Input() templateData: TimelineTemplate[] = [];
  @Input() allTemplates: TimelineTemplate[];
  @Output() projectTypeChanged = new EventEmitter();
  @Output() operationTypeChanged = new EventEmitter();
  @Output() projectApproachChanged = new EventEmitter();

  @ViewChild('templateChart') templateChart: ElementRef;

  standardTemplatesList = null;
  selectedTemplatesIdList: number[] = [];

  chartFigure: ElementRef;
  chartElement: HTMLElement = this.elementRef.nativeElement as HTMLElement;

  periodStartDate: Date;
  periodEndDate: Date;

  viewType: string;

  arrangeLabelTimeout;

  viewTypeSubscription: Subscription;
  templateSubscription: Subscription;
  templatesListSubscription: Subscription;

  headerX: XAxis;
  projectDuration: ProjectDuration;
  milestonesArea: MilestonesArea[];
  incrementsArea: Increments[];

  // milestoneViewItem: MilestonesArea;
  taskViewItem: TasksArea;
  incrementsViewItem: Increment;

  addIncrementSubscription: Subscription;
  deleteIncrementSubscription: Subscription;
  timelineSubscription: Subscription;
  timelineStartSubscription: Subscription;
  timelineEndSubscription: Subscription;

  modifiable: boolean;

  listAreasId = [1, 2, 3];

  // element for chart
  private svg: d3.Selection<any, any, any, any>;
  private zoomElement: d3.Selection<any, any, any, any>;

  private viewBoxHeight = 290;
  private viewBoxWidth = 750;

  private padding = { top: 40, left: 0 };

  private xScale: ScaleTime<any, any>;
  private zoom: ZoomBehavior<any, any>;

  private oneDayTick = 1.2096e9;

  private operationMoveTimeline: InlineObject.OperationEnum = 'MOVE_TIMELINE';
  private operationMoveTimelineStart: InlineObject.OperationEnum = 'MOVE_TIMELINE_START';
  private operationMoveTimelineEnd: InlineObject.OperationEnum = 'MOVE_TIMELINE_END';

  constructor(
    public templatesViewControlsService: TemplatesViewControlsService,
    private timelinesService: TimelinesService,
    private timelineTemplatesService: TimelineTemplatesService,
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
    this.milestonesArea = [];
    this.incrementsArea = [];
    this.svg = null;

    // TODO: this is just temporary
    this.modifiable = false;

    this.periodStartDate = new Date(this.timelineData.start);
    this.periodEndDate = new Date(this.timelineData.end);

    d3.select(this.chartElement).select('figure').append('div').attr('class', 'tooltip');

    this.selectedTemplatesIdList = this.templateData.map((t) => t.id);

    this.templatesListSubscription = this.templatesViewControlsService
      .getTemplatesList()
      .subscribe((data: number[]) => {
        if (this.milestonesArea.length > 0) {
          if (data !== null) {
            this.selectedTemplatesIdList = data;
            const newTemplates = this.allTemplates.filter((t) => data.includes(t.id));

            this.setDataReset(this.timelineData, newTemplates);
          }
        }
      });

    this.viewTypeSubscription = this.templatesViewControlsService.getViewType().subscribe((data) => {
      if (this.viewType !== data) {
        this.viewType = data;
        if (this.xScale) {
          switch (data) {
            case 'DAYS': {
              this.headerX.formatDate = (d: Date) => this.headerX.formatDateDay(d);

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, this.oneDayTick / 5);
              });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'WEEKS': {
              this.headerX.formatDate = (d: Date) => this.headerX.formatDateWeek(d);

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, (this.oneDayTick * 7) / 12);
              });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'MONTHS': {
              this.headerX.formatDate = (d: Date) => this.headerX.formatDateMonth(d);

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, (this.oneDayTick * 30) / 12);
              });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'YEARS': {
              this.headerX.formatDate = (d: Date) => this.headerX.formatDateYear(d);

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
                this.onZoom(event, (this.oneDayTick * 365) / 12);
              });
              this.refreshXScale();
              this.redrawChart(0);
              break;
            }
            case null: {
              this.headerX.formatDate = (d: Date) => this.headerX.formatDateFull(d);
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
    this.addIncrementSubscription?.unsubscribe();
    this.deleteIncrementSubscription?.unsubscribe();
    this.timelineSubscription?.unsubscribe();
    this.templatesListSubscription?.unsubscribe();
    this.templateSubscription?.unsubscribe();
    this.viewTypeSubscription?.unsubscribe();
    this.timelineStartSubscription?.unsubscribe();
    this.timelineEndSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    const newSize = (this.templateChart.nativeElement as HTMLElement).offsetWidth;
    this.resizeChart(newSize);
  }

  onResized(event: ResizedEvent): void {
    // only resize if width was changed, height is not relevant here
    if (event.newWidth !== this.viewBoxWidth) {
      this.resizeChart(event.newWidth);
      this.rearrangeMilestoneLabels(0);
    }
  }

  private drawChart(): void {
    this.svg = this.createSvg(this.chartElement, this.chartElement.id);
    this.initializeSvgGraphElements();

    // zoom out a bit to show all data at start
    this.svg
      .transition()
      .duration(0)
      .call(this.zoom.scaleBy.bind(this), 0.8)
      .on('end', () => this.refreshXScale());

    this.initializeXScale();

    this.headerX = new XAxis(this.svg, this.chartElement, this.xScale);
    this.headerX.formatDate = (d: Date) => this.headerX.formatDateFull(d);
    this.headerX.draw();

    this.projectDuration = new ProjectDuration(this.svg, this.chartElement, this.xScale, this.timelineData, true);
    this.projectDuration.draw();

    this.projectDuration.onDragEnd = (offsetDays: number) => {
      if (offsetDays !== 0) {
        const moveTimeline$ = this.timelinesService.applyOperation(this.timelineData.id, {
          operation: this.operationMoveTimeline,
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
          operation: this.operationMoveTimelineStart,
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
          operation: this.operationMoveTimelineEnd,
          days: offsetDays,
        });

        this.timelineEndSubscription = this.subscribeForRedraw(moveTimelineEnd$);
      } else {
        this.projectDuration.redraw(200);
      }
    };

    this.milestonesArea = [];
    this.incrementsArea = [];

    let countId = 1;
    for (const template of this.templateData) {
      const milestoneViewItem = new MilestonesArea(
        this.svg,
        this.chartElement,
        this.xScale,
        template.milestones,
        this.modifiable,
        false,
        countId,
        this.timelineData
      );

      milestoneViewItem.draw({ left: this.padding.left, top: 0 });
      this.milestonesArea.push(milestoneViewItem);

      this.createIncrementsArea(template.increments, countId, this.incrementsArea);

      countId++;
    }
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

    this.milestonesArea.forEach((milestoneViewItem) => {
      milestoneViewItem.redraw({ left: 0, top: 0 }, animationDuration);
    });

    this.incrementsArea.forEach((incrementsViewItem) => {
      incrementsViewItem.redraw({ left: 0, top: 0 });
    });
  }

  private resizeChart(newSize: number): void {
    this.resizeXScale(newSize);
    this.resizeZoomElement(newSize);
    this.resizeSvg(newSize);

    this.headerX.resize(newSize);

    this.viewBoxWidth = newSize;
    this.redrawChart(0);
  }

  private createSvg(element: HTMLElement, id: string): d3.Selection<any, any, any, any> {
    const svg = d3
      .select(element)
      .select('figure')
      .append('svg')
      .attr('id', id)
      .attr('width', '100%')
      // .attr('height', '100vh')
      .attr('viewBox', `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight * this.templateData.length}`);

    svg
      .append('defs')
      .append('mask')
      .attr('id', 'dataMask')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.viewBoxWidth - this.padding.left)
      .attr('height', this.viewBoxHeight * this.templateData.length - this.padding.top);

    return svg;
  }

  private resizeSvg(newSize: number): void {
    this.svg.attr('viewBox', `0 0 ${newSize} ${this.viewBoxHeight * this.templateData.length}`);

    this.svg.select('#dataMask rect').attr('width', newSize - this.padding.left);
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
      .attr('height', this.viewBoxHeight * this.templateData.length - this.padding.top)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', `translate(${this.padding.left},${this.padding.top})`)
      .call(this.zoom);

    const projectGroup = this.svg.append('g').attr('class', 'project-group');
    projectGroup.attr('transform', `translate(${this.padding.left},45)`);

    let milestoneHeight = 120;
    let incrementHeight = 80;

    for (const id of this.listAreasId) {
      const incrementGroup = this.svg.append('g').attr('class', 'increment-group').attr('id', `incrementsArea${id}`);
      incrementGroup.attr('transform', `translate(${this.padding.left},${incrementHeight})`);

      const dataGroup = this.svg.append('g').attr('class', 'data-group').attr('id', `milestonesArea${id}`);
      dataGroup.attr('transform', `translate(${this.padding.left},${milestoneHeight})`);

      milestoneHeight = milestoneHeight + 240;
      incrementHeight = incrementHeight + 240;

      dataGroup.attr('mask', 'url(#dataMask)');
    }

    const currentDateGroup = this.svg.append('g').attr('class', 'current-date-group');
    currentDateGroup.attr('transform', `translate(${this.padding.left},0)`);
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
        this.rearrangeMilestoneLabels(200);
      }
    } else {
      this.redrawChart(0);
    }

    // reset the transform so the scale can be changed from other elements like dropdown menu
    this.zoomElement.call(this.zoom.transform.bind(this), d3.zoomIdentity);

    this.periodStartDate = xScaleTransformed.invert(xScaleTransformed.range()[0]);
    this.periodEndDate = xScaleTransformed.invert(xScaleTransformed.range()[1]);
  }

  private rearrangeMilestoneLabels(timeout: number): void {
    clearTimeout(this.arrangeLabelTimeout);

    this.arrangeLabelTimeout = setTimeout(() => {
      for (const milestoneViewItem of this.milestonesArea) {
        milestoneViewItem.arrangeLabels();
      }
    }, timeout);
  }

  // set minimum and maximum zoom levels
  private setZoomScaleExtent(minTimeMs): void {
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

  private redraw(animationDuration): any {
    this.projectDuration.redraw(animationDuration);
    for (const milestoneViewItem of this.milestonesArea) {
      milestoneViewItem.redraw({ left: 0, top: 0 }, 200);
    }
  }

  private subscribeForRedraw(obs: Observable<any>): Subscription {
    return obs
      .pipe(
        switchMap(() =>
          forkJoin([
            this.timelinesService.getTimelines(),
            this.timelineTemplatesService.getTemplatesForTimeline(this.timelineData.id),
          ])
        )
      )
      .subscribe(([timelinesData, templatesData]) => {
        this.timelineData = timelinesData.find((t) => t.id === this.timelineData.id);
        this.allTemplates = templatesData;

        const newTemplates = this.allTemplates.filter((t) => this.selectedTemplatesIdList.includes(t.id));

        this.projectDuration.setData(this.timelineData);
        this.projectDuration.redraw(200);

        this.incrementsArea = [];
        let countId = 1;

        newTemplates.forEach((temp, i) => {
          this.milestonesArea[i].setData(temp.milestones);
          this.milestonesArea[i].redraw({ left: 0, top: 0 }, 200);

          this.createIncrementsArea(temp.increments, countId, this.incrementsArea);

          countId++;
        });

        this.incrementsArea.forEach((incrementsViewItem) => {
          incrementsViewItem.redraw({ left: 0, top: 0 });
        });
      });
  }

  private setDataReset(timelineData: Timeline, templatesData: TimelineTemplate[]): void {
    this.templateData = templatesData;

    this.projectDuration.setData(timelineData);
    this.projectDuration.redraw(200);

    this.incrementsArea = [];
    let countId = 1;

    templatesData.forEach((temp, i) => {
      this.milestonesArea[i].setData(temp.milestones);
      this.milestonesArea[i].reset({ left: 0, top: 0 });

      this.createIncrementsArea(temp.increments, countId, this.incrementsArea);

      countId++;
    });
  }

  private createIncrementsArea(data: Increment[], index: number, incrementsArea: Increments[]) {
    if (data !== null) {
      const incrementsViewItem = new Increments(this.svg, this.xScale, data, index, this.active);
      incrementsViewItem.draw({ left: 0, top: 0 });
      incrementsArea.push(incrementsViewItem);
    }
  }
}
