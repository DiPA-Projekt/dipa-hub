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
  ViewEncapsulation
} from '@angular/core';

import * as d3 from 'd3';
import {GanttControlsService} from '../gantt-controls.service';
import {ResizedEvent} from 'angular-resize-event';
import {MilestonesArea} from './chart-elements/MilestonesArea';
import {TasksArea} from './chart-elements/TasksArea';
import {XAxis} from './chart-elements/XAxis';
import {ProjectDuration} from './chart-elements/ProjectDuration';
import {MilestonesService, TasksService, TimelinesService} from 'dipa-api-client';
import {forkJoin, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  constructor(public ganttControlsService: GanttControlsService,
              private milestonesService: MilestonesService,
              private tasksService: TasksService,
              private timelinesService: TimelinesService) {
    d3.timeFormatDefaultLocale({
      // @ts-ignore
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['€', ''],
      dateTime: '%a %b %e %X %Y',
      date: '%d.%m.%Y',
      time: '%H:%M:%S',
      periods: ['AM', 'PM'],
      days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    });
  }

  @Input() milestoneData = [];
  @Input() taskData = [];
  @Input() timelineData: any = {};

  @ViewChild('chart')
  chartFigure: ElementRef;

  periodStartDate: Date;
  periodEndDate: Date;

  viewType: string;

  periodStartDateSubscription;
  periodEndDateSubscription;

  viewTypeSubscription;

  // element for chart
  private svg;
  private zoomElement;

  private viewBoxHeight = 400;
  private viewBoxWidth = 750;

  private padding = { top: 40, left: 0};

  private xScale;
  private zoom;

  private oneDayTick = 1.2096e+9;

  headerX: XAxis;
  projectDuration: ProjectDuration;
  milestoneViewItem: MilestonesArea;
  taskViewItem: TasksArea;

  milestoneSubscription;
  taskSubscription;
  timelineSubscription;

  ngOnInit(): void {
    this.periodStartDateSubscription = this.ganttControlsService.getPeriodStartDate()
    .subscribe((data) => {
      if (this.periodStartDate !== data) {
        this.periodStartDate = data;

        if (this.xScale) {
          this.refreshXScale();
          this.redrawChart(200);
        }
      }
    });

    this.periodEndDateSubscription = this.ganttControlsService.getPeriodEndDate()
    .subscribe((data) => {
      if (this.periodEndDate !== data) {
        this.periodEndDate = data;

        if (this.xScale) {
          this.refreshXScale();
          this.redrawChart(200);
        }
      }
    });

    this.viewTypeSubscription = this.ganttControlsService.getViewType()
    .subscribe((data) => {
      if (this.viewType !== data) {
        this.viewType = data;

        if (this.xScale) {

          switch (data) {
            case 'DAYS': {
              this.headerX.formatDate = this.headerX.formatDateDay;
              this.headerX.tickSetting = null;

              const ticksList = this.xScale.ticks();
              const numberTicks = d3.timeDay.count(ticksList[0], ticksList[ticksList.length - 1]);

              if (numberTicks < 18){
                this.headerX.tickSetting = numberTicks;
              }

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, this.oneDayTick); });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'WEEKS': {
              this.headerX.formatDate = this.headerX.formatDateWeek;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event,  (this.oneDayTick * 7) / 12); });
              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
            case 'MONTHS': {
              this.headerX.formatDate = this.headerX.formatDateMonth;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, (this.oneDayTick * 30) / 12); });
              this.refreshXScale();
              this.redrawChart(0);

              break;
           }
            case 'YEARS': {
              this.headerX.formatDate = this.headerX.formatDateYear;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, (this.oneDayTick * 365) / 12); });
              this.refreshXScale();
              this.redrawChart(0);
              break;
            }
            case null: {
              this.headerX.formatDate = this.headerX.formatDateFull;
              this.headerX.tickSetting = null;

              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, this.oneDayTick); });

              this.refreshXScale();
              this.redrawChart(0);

              break;
            }
          }
        }
      }
    });


    d3.select('figure#chart')
      .append('div')
      .attr('class', 'tooltip');

    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskData && !changes.taskData.isFirstChange()
      || changes.milestoneData && !changes.milestoneData.isFirstChange()) {
      this.drawChart();
    }
  }

  ngOnDestroy(): void {
    this.periodStartDateSubscription.unsubscribe();
    this.periodEndDateSubscription.unsubscribe();

    this.milestoneSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
    this.timelineSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.resizeChart(this.chartFigure.nativeElement.offsetWidth);
  }

  onResized(event: ResizedEvent): void {
    // only resize if width was changed, height is not relevant here
    if (event.newWidth !== this.viewBoxWidth) {
      this.resizeChart(event.newWidth);
    }
  }

  private drawChart(): void {

    if (!this.svg) {
      this.svg = this.createSvg();
      this.initializeSvgGraphElements();

      // zoom out a bit to show all data at start
      this.svg
        .transition()
        .duration(0)
        .call(this.zoom.scaleBy, 0.8)
        .on('end', () => this.refreshXScale());
    }

    this.initializeXScale();

    this.headerX = new XAxis(this.svg, this.xScale);
    this.headerX.formatDate = this.headerX.formatDateFull;
    this.headerX.draw();
    this.projectDuration = new ProjectDuration(this.svg, this.xScale, this.timelineData);
    this.projectDuration.draw();

    this.projectDuration.onDragEnd = (offsetDays: number) => {

      const moveTimeline$ = this.timelinesService.applyOperation(
        this.timelineData.id,
        {operation: 'moveTimeline', days: offsetDays});
      this.timelineSubscription = this.subscribeForRedraw(moveTimeline$);
    };

    this.taskViewItem = new TasksArea(this.svg, this.xScale, this.taskData);
    this.taskViewItem.draw({left: 0, top: 0});

    this.milestoneViewItem = new MilestonesArea(this.svg, this.xScale, this.milestoneData);
    this.milestoneViewItem.draw({left: 0, top: this.taskViewItem.getAreaHeight()});
  }

  private redrawChart(animationDuration): void {

    const ticksList = this.xScale.ticks();

    this.svg.select('g.x-group').selectAll('text.outsideXAxisLabel').remove();

    switch (this.viewType){
      case 'WEEKS': {
        const numberTicks = d3.timeWeek.count(ticksList[0], ticksList[ticksList.length - 1]) + 1;

        if (numberTicks > 12){
          this.headerX.tickSetting = null;
        }
        else {
          this.headerX.tickSetting = d3.timeWeek.every(1);
        }

        break;
      }
      case 'MONTHS': {
        const numberTicks = d3.timeMonth.count(ticksList[0], ticksList[ticksList.length - 1]) + 1;

        if (numberTicks === 1){

          const textOutsideBox = this.xScale(ticksList[0]) < this.xScale.range()[1];

          if (textOutsideBox){
            this.svg.select('g.x-group')
            .append('text')
            .attr('class', 'outsideXAxisLabel')
            .text(this.headerX.formatDateMonth(ticksList[0]))
            .attr('x', 10)
            .attr('y', 18);
          }
        }

        if (numberTicks > 12){
          this.headerX.tickSetting = null;
        }
        else {
          this.headerX.tickSetting = d3.timeMonth.every(1);
        }
        break;
      }
      case 'YEARS': {
        const numberTicks = d3.timeYear.count(ticksList[0], ticksList[ticksList.length - 1]) + 1;

        if (numberTicks === 1){

          const textOutsideBox = this.xScale(ticksList[0]) < this.xScale.range()[1];

          if (textOutsideBox){
            this.svg.select('g.x-group')
            .append('text')
            .attr('class', 'outsideXAxisLabel')
            .text(this.headerX.formatDateYear(ticksList[0]))
            .attr('x', 10)
            .attr('y', 18);
          }
        }

        if (numberTicks > 12){
          this.headerX.tickSetting = null;
        }
        else {
          this.headerX.tickSetting = d3.timeYear.every(1);
        }
        break;
      }
    }
    this.headerX.redraw();
    this.projectDuration.redraw(animationDuration);

    this.taskViewItem.redraw({left: 0, top: 0});
    this.milestoneViewItem.redraw({left: 0, top: this.taskViewItem.getAreaHeight()}, animationDuration);
  }

  private resizeChart(newSize): void {

    this.resizeXScale(newSize);
    this.resizeZoomElement(newSize);
    this.resizeSvg(newSize);

    this.headerX.resize(newSize);

    this.viewBoxWidth = newSize;
    this.redrawChart(0);
  }

  private createSvg(): any {

    const svg = d3.select('figure#chart')
      .append('svg')
      .attr('width', '100%')
      // .attr('height', '100vh')
      .attr('viewBox', '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight);

    svg
      .append('defs')
      .append('mask')
      .attr('id', 'dataMask')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (this.viewBoxWidth - this.padding.left))
      .attr('height', (this.viewBoxHeight - this.padding.top));

    return svg;
  }

  resizeSvg(newSize): void {
    this.svg
      .attr('viewBox', '0 0 ' + newSize + ' ' + this.viewBoxHeight);

    this.svg.select('#dataMask rect')
      .attr('width', (newSize - this.padding.left));
  }

  private initializeSvgGraphElements(): void {
    const xGroup = this.svg.append('g').attr('class', 'x-group');
    xGroup.attr('transform', 'translate(' + this.padding.left + ',20)');

    this.zoom = d3.zoom()
      .on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, this.oneDayTick); });

    this.zoomElement = this.svg
      .append('rect')
      .attr('class', 'zoomAreaX')
      .attr('width', this.viewBoxWidth - this.padding.left)
      .attr('height', this.viewBoxHeight - this.padding.top)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', 'translate(' + this.padding.left + ',' + this.padding.top + ')')
      .call(this.zoom);

    const projectGroup = this.svg.append('g').attr('class', 'project-group');
    projectGroup.attr('transform', 'translate(' + this.padding.left + ',45)');

    const dataGroup = this.svg.append('g').attr('class', 'data-group');
    dataGroup.attr('transform', 'translate(' + this.padding.left + ',' + (this.padding.top + 30) + ')');

    const currentDateGroup = this.svg.append('g').attr('class', 'current-date-group');
    currentDateGroup.attr('transform', 'translate(' + this.padding.left + ',0)');

    dataGroup
      .attr('mask', 'url(#dataMask)');
  }

  onZoom(event: d3.D3ZoomEvent<any, any>, minTimeMs): void {

    const eventTransform: d3.ZoomTransform = event.transform;

    if (eventTransform.k === 1 && eventTransform.x === 0 && eventTransform.y === 0) {
      return;
    }

    // this check is needed to prevent additional zooming on the minimum/maximum zoom level
    // because zoom.transform is reset and the zoom levels are reinitiated every time
    if (event.sourceEvent) {
      const deltaY = event.sourceEvent.deltaY;
      if (deltaY < 0 && eventTransform.y > 0 || deltaY > 0 && eventTransform.y < 0) {
        return;
      }
    }

    const xScaleTransformed = eventTransform.rescaleX<any>(this.xScale);

    const start = xScaleTransformed.domain()[0];
    const end = xScaleTransformed.domain()[1];

    this.setZoomScaleExtent(minTimeMs);
    // zoom to new start and end dates
    this.xScale.domain([start, end]);

    if (event.sourceEvent){
      if (event.sourceEvent.type === 'mousemove'){
        this.redrawChart(0);
      }
      else{
        this.redrawChart(200);
      }
    }
    else{
      this.redrawChart(0);
    }

    // reset the transform so the scale can be changed from other elements like dropdown menu
    this.zoomElement.call(this.zoom.transform, d3.zoomIdentity);

    this.periodStartDate = xScaleTransformed.invert(xScaleTransformed.range()[0]);
    this.periodEndDate = xScaleTransformed.invert(xScaleTransformed.range()[1]);

    this.ganttControlsService.setPeriodStartDate(this.periodStartDate);
    this.ganttControlsService.setPeriodEndDate(this.periodEndDate);
  }

  // set minimum and maximum zoom levels
  setZoomScaleExtent(minTimeMs): void {
    // const minTimeMs = 1.2096e+9; // 14 days to show 1 day ticks
    const maxTimeMs = 3.1536e+11; // ~ 10 years

    const widthMs = this.periodEndDate.getTime() - this.periodStartDate.getTime();

    const minScaleFactor = widthMs / maxTimeMs;
    const maxScaleFactor = widthMs / minTimeMs;

    this.zoom
      .scaleExtent([minScaleFactor, maxScaleFactor]);
  }

  // Set X axis
  private initializeXScale(): void {
    this.xScale = d3.scaleTime()
      .domain([this.periodStartDate, this.periodEndDate])
      .range([0, this.viewBoxWidth - this.padding.left]);
    this.setZoomScaleExtent(this.oneDayTick);
  }

  private refreshXScale(): void {
    this.xScale
      .domain([this.periodStartDate, this.periodEndDate]);
    this.setZoomScaleExtent(this.oneDayTick);
  }

  private resizeXScale(newSize): void {
    this.xScale
      .range([0, newSize - this.padding.left]);
  }

  resizeZoomElement(newSize): void {
    this.zoomElement
      .attr('width', newSize - this.padding.left);
  }

  private subscribeForRedraw(obs): Observable<any> {
    return obs.pipe(
      switchMap(() => forkJoin([
        this.tasksService.getTasksForTimeline(this.timelineData.id),
        this.milestonesService.getMilestonesForTimeline(this.timelineData.id)
      ]))
    ).subscribe(([taskData, milestoneData]) => {

      this.projectDuration.redraw(0);

      this.taskData = taskData;
      this.taskViewItem.setData(taskData);
      this.taskViewItem.redraw({left: 0, top: 0});

      this.milestoneData = milestoneData;
      this.milestoneViewItem.setData(milestoneData);
      this.milestoneViewItem.redraw({left: 0, top: this.taskViewItem.getAreaHeight()}, 200);
    });
  }


}
