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

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  constructor(public ganttControlsService: GanttControlsService) {
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

  @ViewChild('chart')
  chartFigure: ElementRef;

  periodStartDate: Date;
  periodEndDate: Date;

  periodStartDateSubscription;
  periodEndDateSubscription;

  // element for chart
  private svg;
  private zoomElement;

  private viewBoxHeight = 400;
  private viewBoxWidth = 750;

  private padding = { top: 25, left: 0};

  private xScale;
  private zoom;

  headerX: XAxis;
  milestoneViewItem: MilestonesArea;
  taskViewItem: TasksArea;

  ngOnInit(): void {
    this.periodStartDateSubscription = this.ganttControlsService.getPeriodStartDate()
    .subscribe((data) => {
      if (this.periodStartDate !== data) {
        this.periodStartDate = data;

        if (this.xScale) {
          this.refreshXScale();
          this.redrawChart();
        }
      }
    });

    this.periodEndDateSubscription = this.ganttControlsService.getPeriodEndDate()
    .subscribe((data) => {
      if (this.periodEndDate !== data) {
        this.periodEndDate = data;

        if (this.xScale) {
          this.refreshXScale();
          this.redrawChart();
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
    this.headerX.draw();

    this.taskViewItem = new TasksArea(this.svg, this.xScale, this.taskData);
    this.taskViewItem.draw({left: 0, top: 0});
    this.milestoneViewItem = new MilestonesArea(this.svg, this.xScale, this.milestoneData);
    this.milestoneViewItem.draw({left: 0, top: this.taskViewItem.getAreaHeight()});
  }

  private redrawChart(): void {
    this.headerX.redraw();

    this.taskViewItem.redraw({left: 0, top: 0});
    this.milestoneViewItem.redraw({left: 0, top: this.taskViewItem.getAreaHeight()});
  }

  private resizeChart(newSize): void {

    this.resizeXScale(newSize);
    this.resizeZoomElement(newSize);
    this.resizeSvg(newSize);

    this.headerX.resize(newSize);

    this.viewBoxWidth = newSize;
    this.redrawChart();
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
    xGroup.attr('transform', 'translate(' + this.padding.left + ',0)');

    this.zoom = d3.zoom()
      .on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event); });

    this.zoomElement = this.svg
      .append('rect')
      .attr('class', 'zoomAreaX')
      .attr('width', this.viewBoxWidth - this.padding.left)
      .attr('height', this.viewBoxHeight - this.padding.top)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', 'translate(' + this.padding.left + ',' + this.padding.top + ')')
      .call(this.zoom);

    const dataGroup = this.svg.append('g').attr('class', 'data-group');
    dataGroup.attr('transform', 'translate(' + this.padding.left + ',' + (this.padding.top + 10) + ')');

    dataGroup
      .attr('mask', 'url(#dataMask)');
  }

  onZoom(event: d3.D3ZoomEvent<any, any>): void {

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

    this.zoomTo(start, end);

    // reset the transform so the scale can be changed from other elements like dropdown menu
    this.zoomElement.call(this.zoom.transform, d3.zoomIdentity);

    this.periodStartDate = xScaleTransformed.invert(xScaleTransformed.range()[0]);
    this.periodEndDate = xScaleTransformed.invert(xScaleTransformed.range()[1]);

    this.ganttControlsService.setPeriodStartDate(this.periodStartDate);
    this.ganttControlsService.setPeriodEndDate(this.periodEndDate);
  }

  zoomTo(start: Date, end: Date): void {
    this.xScale.domain([start, end]);
    this.setZoomScaleExtent();

    this.redrawChart();
  }

  // set minimum and maximum zoom levels
  setZoomScaleExtent(): void {
    const minTimeMs = 1.2096e+9; // 14 days to show 1 day ticks
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
    this.setZoomScaleExtent();
  }

  private refreshXScale(): void {
    this.xScale
      .domain([this.periodStartDate, this.periodEndDate]);
    this.setZoomScaleExtent();
  }

  private resizeXScale(newSize): void {
    this.xScale
      .range([0, newSize - this.padding.left]);
  }

  resizeZoomElement(newSize): void {
    this.zoomElement
      .attr('width', newSize - this.padding.left);
  }

}
