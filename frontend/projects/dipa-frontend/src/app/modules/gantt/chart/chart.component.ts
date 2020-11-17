import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';
import {parseSvg} from 'd3-interpolate/src/transform/parse';
import {GanttControlsService} from '../gantt-controls.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit, OnChanges, OnDestroy {

  constructor(public ganttControlsService: GanttControlsService) { }

  @Input() milestoneData = [];
  @Input() taskData = [];

  periodStartDate: Date;
  periodEndDate: Date;

  viewType: String;

  periodStartDateSubscription;
  periodEndDateSubscription;

  viewTypeSubscription;

  // element for chart
  private svg;
  private zoomElement;

  private viewBoxHeight = 400;
  private viewBoxWidth = 750;

  private width = '100%';
  // private height = '100%';

  private barHeight = 20;
  private barMargin = 8;
  private barHeightWithMargin = this.barHeight + 2 * this.barMargin;

  private padding = { top: 25, left: 75};


  private groupColors;
  private groups;
  private groupsUnfiltered;

  private xAxis;
  private yAxis;

  private tooltip;

  private dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

  private dragDxStack = 0;

  private zoom;

  private ticksSetting;

  private timeReverse = null;

  private oneDayTick = 1.2096e+9;

  private formatDate;

  // See: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
  private static getCounts(arr): any {
    let i = arr.length; // var to loop over
    const obj = {}; // obj to store results
    while (i) {
      obj[arr[--i]] = (obj[arr[i]] || 0) + 1;
    } // count occurrences
    return obj;
  }

  // get specific from everything
  private static getCount(word, arr): number {
    return ChartComponent.getCounts(arr)[word] || 0;
  }

  // Define filter conditions
  formatDateFull(date): any {
    return (d3.timeSecond(date) < date ? d3.timeFormat('.%L')
      : d3.timeMinute(date) < date ? d3.timeFormat(':%S')
        : d3.timeHour(date) < date ? d3.timeFormat('%H:%M')
          : d3.timeDay(date) < date ? d3.timeFormat('%H:%M')
            : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? d3.timeFormat('%a, %d.') : d3.timeFormat('%d. %b'))
              : d3.timeYear(date) < date ? d3.timeFormat('%b')
                : d3.timeFormat('%Y')
    )
    (date);
  }

  ngOnInit(): void {
    this.periodStartDateSubscription = this.ganttControlsService.getPeriodStartDate()
    .subscribe((data) => {
      if (this.periodStartDate !== data) {
        this.periodStartDate = data;

        if (this.xAxis) {
          this.refreshXAxis();
          this.updateChart();
        }
      }
    });

    this.periodEndDateSubscription = this.ganttControlsService.getPeriodEndDate()
    .subscribe((data) => {
      if (this.periodEndDate !== data) {
        this.periodEndDate = data;

        if (this.xAxis) {
          this.refreshXAxis();
          this.updateChart();
        }
      }
    });

    this.viewTypeSubscription = this.ganttControlsService.getViewType()
    .subscribe((data) => {
      if (this.viewType !== data) {
        this.viewType = data;

        if (this.xAxis) {
          console.log(data)

          switch(data) { 
            case "DAYS": { 
              this.formatDate = this.formatDateDay;
              
              if(['MONTHS', 'WEEKS', 'YEARS'].includes(this.timeReverse)){
                this.ticksSetting = null;
              }
              else{
                var ticksList = this.xAxis.ticks()
                var numberTicks = d3.timeDay.count(ticksList[0], ticksList[ticksList.length-1]) 
                if (numberTicks < 18){
                  this.ticksSetting = numberTicks;
                }
                else{
                  this.ticksSetting = null;
                }  
              }
              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, this.oneDayTick); });

              this.refreshXAxis();
              this.updateChart();

              this.ticksSetting = null;
              this.timeReverse = "DAYS"

              break; 
            } 
            case "WEEKS": { 
              this.formatDate = this.formatDateWeek;
            
              if(['MONTHS', 'YEARS'].includes(this.timeReverse)){
                this.ticksSetting = null;
              }
              else{
                let ticksList = this.xAxis.ticks()
                console.log(ticksList)
                let numberTicks = d3.timeWeek.count(ticksList[0], ticksList[ticksList.length-1]) + 1
                console.log(numberTicks)
                if (numberTicks < 7){
                  this.zoomToType(7);
                }
                else{
                  this.ticksSetting = null;
                }  
              }
              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, this.oneDayTick *7); });
              
              this.refreshXAxis();

              this.updateChart()
              this.ticksSetting = null;
              this.timeReverse = "WEEKS"
              break; 
            } 
            case "MONTHS": { 
              this.formatDate = this.formatDateMonth;

              // this.zoomToType(30)
              if(['YEARS'].includes(this.timeReverse)){
                this.ticksSetting = null;
              }
              else{
                var ticksList = this.xAxis.ticks()

                var numberTicks = d3.timeMonth.count(ticksList[0], ticksList[ticksList.length-1]) + 1  

                if (numberTicks < 7){
                  this.zoomToType(30);
                }
                else{
                  this.ticksSetting = null;
                }  
              }
            
              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, this.oneDayTick *30); });

              this.ticksSetting = null;             
              this.refreshXAxis();
              this.updateChart()

              this.timeReverse = "MONTHS"
              break; 
           } 
            case "YEARS": { 

              this.formatDate = this.formatDateYear;
              this.ticksSetting = d3.timeYear.every(1);

              var ticksList = this.xAxis.ticks()

              var numberTicks = d3.timeYear.count(ticksList[0], ticksList[ticksList.length-1]) + 1  

              if (numberTicks < 2){
                this.zoomToType(365/2);
              } 

              this.refreshXAxis()
              this.updateChart();
              this.timeReverse = "YEARS";
              break; 
            } 
            case null: {
              this.formatDate = this.formatDateFull;
              this.ticksSetting = null;
              this.zoom.on('zoom', (event: d3.D3ZoomEvent<any, any>) => { this.onZoom(event, this.oneDayTick); });

              var ticksList = this.xAxis.ticks()

              var numberTicks = d3.timeYear.count(ticksList[0], ticksList[ticksList.length-1]) + 1  

              console.log(numberTicks)
              if (numberTicks < 3){
                this.zoomToType(365/2);
              } 

              this.refreshXAxis()
              this.updateChart();
              this.timeReverse = null;
              break;
            }
          } 
        }
      }
    });

    this.formatDate = this.formatDateFull;

    this.groups = [...new Set(this.taskData.map(item => item?.group))];

    this.groupsUnfiltered = [];
    for (const item of this.taskData) {
      const groupName = item?.group;
      this.groupsUnfiltered.push(groupName);
    }

    this.createGroupColors();

    this.drawChart();

    this.tooltip = d3.select('figure#chart')
      .append('div')
      .attr('class', 'tooltip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskData || changes.milestoneData) {
      this.drawChart();
    }
  }

  ngOnDestroy(): void {
    this.periodStartDateSubscription.unsubscribe();
    this.periodEndDateSubscription.unsubscribe();
  }

  private drawChart(): void {

    if (this.groups == null) {
      return;
    }

    if (!this.svg) {
      this.createSvg();
      this.initializeSvgGraphElements();

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

      // zoom out a bit to show all data at start
      this.svg
        .transition()
        .duration(0)
        .call(this.zoom.scaleBy, 0.8)
        .on('end', () => this.refreshXAxis());
    }

    this.initializeXAxis();
    this.initializeYAxis();

    this.drawHeaderX();
    this.drawVerticalGridLines();

    this.drawHeaderY();
    this.drawGroups();

    this.drawTasks(this.taskData);
    this.drawMilestones(this.milestoneData);
  }

  private createSvg(): void {

    this.svg = d3.select('figure#chart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100vh')
      .attr('viewBox', '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight);

    this.svg
      .append('defs')
      .append('mask')
      .attr('id', 'dataMask')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (this.viewBoxWidth - this.padding.left))
      .attr('height', (this.viewBoxHeight - this.padding.top));
  }

  private createGroupColors(): void {
    this.groupColors = d3.scaleOrdinal()
      .domain(this.groups)
      .range(['#62a9f9', '#ffcc4f', '#ff2d2d', '#0ebf16', '#b501ea']);
  }

  private initializeSvgGraphElements(): void {
    const xGroup = this.svg.append('g').attr('class', 'x-group');
    xGroup.attr('transform', 'translate(' + this.padding.left + ',0)');

    const yGroup = this.svg.append('g').attr('class', 'y-group');
    yGroup.attr('transform', 'translate(0,' + (this.padding.top + this.barMargin) + ')');

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

    const dataGroup = this.svg.append('g').attr('class', 'data-group');
    dataGroup.attr('transform', 'translate(' + this.padding.left + ',' + (this.padding.top + this.barMargin) + ')');

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

    const xAxisRescaled = eventTransform.rescaleX<any>(this.xAxis);

    const start = xAxisRescaled.domain()[0];
    const end = xAxisRescaled.domain()[1];

    // reset the transform so the scale can be changed from other elements like dropdown menu
    this.zoomElement.call(this.zoom.transform, d3.zoomIdentity);

    this.setZoomScaleExtent(minTimeMs)
    this.zoomTo(start, end);

    this.periodStartDate = xAxisRescaled.invert(xAxisRescaled.range()[0]);
    this.periodEndDate = xAxisRescaled.invert(xAxisRescaled.range()[1]);

    this.ganttControlsService.setPeriodStartDate(this.periodStartDate);
    this.ganttControlsService.setPeriodEndDate(this.periodEndDate);
  }

  zoomTo(start: Date, end: Date): void {
    this.xAxis.domain([start, end]);
    this.updateChart();
  }

  updateChart(): void {
    this.redrawHeaderX();
    this.redrawVerticalGridLines();

    this.redrawTasks();
    this.redrawMilestones();
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
  private initializeXAxis(): void {
    this.xAxis = d3.scaleTime()
      .domain([this.periodStartDate, this.periodEndDate])
      .range([0, this.viewBoxWidth - this.padding.left]);
    this.setZoomScaleExtent(this.oneDayTick);
  }

  private refreshXAxis(): void {
    this.xAxis.domain([this.periodStartDate, this.periodEndDate]);
    // this.setZoomScaleExtent(this.oneDayTick);
  }

  // Set Y axis
  private initializeYAxis(): void {
    this.yAxis = d3.scaleBand()
      .domain(this.taskData.map(d => d?.group))
      .range([0, this.viewBoxHeight]);
  }

  private drawVerticalGridLines(): void {
    const xGroup = this.svg.select('g.x-group');

    // vertical grid lines
    xGroup.selectAll('line.xGridLines')
      .data(this.xAxis.ticks(this.ticksSetting))
      .enter()
      .append('line')
      .attr('class', 'xGridLines')
      .attr('x1', d => this.xAxis(d))
      .attr('x2', d => this.xAxis(d))
      .attr('y1', 0)
      .attr('y2', this.viewBoxHeight)
      .style('stroke', '#eee');
  }

  redrawVerticalGridLines(): void {
    const xGroup = this.svg.select('g.x-group');

    // vertical grid lines
    xGroup.selectAll('line.xGridLines').remove();
    this.drawVerticalGridLines();
  }

  formatDateDay(date): any {
    return (d3.timeYear(date) < date ? (d3.timeMonth(date) < date ? d3.timeFormat("%a, %d.") : d3.timeFormat("%d.%b"))
    : d3.timeFormat("%d.%m.%y"))(date)
  }

  formatDateWeek(date): any {
    return (d3.timeWeek(date) ? d3.timeFormat("KW-%V") : d3.timeFormat("KW-%V %y"))
    (date)
  }

  formatDateMonth(date): any {
    return (d3.timeYear(date) < date ? d3.timeFormat("%b") : d3.timeFormat("%b %y"))
    (date)
  }

  formatDateYear(date): any {
    return (d3.timeFormat("%Y"))
    (date)
  }

  zoomToType(dateFactor){

    const widthMs = this.periodEndDate.getTime() - this.periodStartDate.getTime();

    const maxScaleFactor = widthMs / (this.oneDayTick *dateFactor);

    console.log(maxScaleFactor)
    this.svg
    .transition()
    .duration(0)
    .call(this.zoom.scaleTo, maxScaleFactor)
    .on('end', () => this.refreshXAxis());
    
  }

  private drawHeaderX(): void {
    const xGroup = this.svg.select('g.x-group');

    // x-axis header background
    xGroup
      .append('rect')
      .attr('class', 'headerX')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (this.viewBoxWidth - this.padding.left))
      .attr('height', (this.barHeight + this.barMargin));

    // x-axis labels
    xGroup.selectAll('text')
      .data(this.xAxis.ticks(this.ticksSetting))
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text(d => this.formatDate(d))
      .attr('x', d => this.xAxis(d) + 4)
      .attr('y', 18);

    // current date indicator
    xGroup
      .append('line')
      .attr('class', 'currentDate')
      .attr('y1', this.barHeight + this.barMargin)
      .attr('y2', this.barHeight + this.barMargin)
      .transition()
      .duration(2000)
      .attr('x1', 0)
      .attr('x2', Math.min(Math.max(this.xAxis(new Date()), 0), this.xAxis.range()[1]));
   
  }

  private redrawHeaderX(): void {
    const xGroup = this.svg.select('g.x-group');

    // x-axis labels
    xGroup.selectAll('text.xAxisLabel').remove();
    xGroup.selectAll('text')
      .data(this.xAxis.ticks(this.ticksSetting))
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text(d => this.formatDate(d))
      .attr('x', d => this.xAxis(d) + 4)
      .attr('y', 18);

    // current date indicator
    xGroup.select('line.currentDate')
    .transition()
    .duration(2000)
    .attr('x2', Math.min(Math.max(this.xAxis(new Date()), 0), this.xAxis.range()[1]));
  }

  private drawHeaderY(): void {
    const occurrences = [];
    let sumOccurrences = 0;

    for (let i = 0; i < this.groups.length; i++){
      occurrences[i] = [this.groups[i], ChartComponent.getCount(this.groups[i], this.groupsUnfiltered)];
    }

    const yGroup = this.svg.select('g.y-group');
    // group titles as y-axis labels
    yGroup.selectAll('text.groupTitle')
      .data(occurrences)
      .enter()
      .append('text')
      .attr('class', 'groupTitle')
      .text(d => d[0])
      .attr('x', 5)
      .attr('y', (d, i) => {
        if (i > 0) {
          sumOccurrences += occurrences[i - 1][1];
          return sumOccurrences * (this.barHeightWithMargin)
            + d[1] * (this.barHeightWithMargin) / 2;
        } else {
          return d[1] * (this.barHeightWithMargin) / 2;
        }
      })
      .attr('fill', d => {
        for (const item of this.groups) {
          if (d[0] === item){
            return d3.rgb(this.groupColors(item)).darker();
          }
        }
      });
  }

  private drawGroups(): void {
    const yGroup = this.svg.select('g.y-group');

    // task group background color
    yGroup.selectAll('rect.groupBackground')
      .data(this.taskData)
      .enter()
      .append('rect')
      .attr('class', 'groupBackground')
      .attr('x', 0)
      .attr('y', (d, i) => (this.barHeightWithMargin) * i - this.barMargin)
      .attr('width', this.width)
      .attr('height', (this.barHeightWithMargin))
      .attr('fill', d => this.groupColors(d?.group));
  }

  private drawMilestones(milestonesToShow): void {

    const drag = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      // milestones
      const eventMilestone = dataGroup.select('#milestoneEntry_' + event.subject.id);

      const xTransformValue = parseSvg(eventMilestone.attr('transform')).translateX;
      const yTransformValue = parseSvg(eventMilestone.attr('transform')).translateY;

      const xValueNew = (xTransformValue + event.dx);

      eventMilestone.attr('transform', 'translate(' + xValueNew + ',' + yTransformValue + ')');

      event.subject.start = this.xAxis.invert(xValueNew);

      this.showMilestoneTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
    });

    const startMilestonesHeight = this.groupsUnfiltered.length * this.barHeightWithMargin + this.barMargin;

    // milestones
    const dataGroup = this.svg.select('g.data-group');
    const milestone = dataGroup.selectAll('g.milestoneEntry')
      .data(milestonesToShow)
      .enter()
      .append('g')
      .attr('class', 'milestoneEntry')
      .attr('id', (d) => 'milestoneEntry_' + d.id)
      .attr('transform', (d, i) =>
        'translate(' + this.xAxis(new Date(d.date)) + ','
        + ((this.barHeightWithMargin * (i % 3)) + startMilestonesHeight) + ')')
      .call(drag);

    milestone
      .append('path')
      .attr('class', 'milestone')
      .attr('transform', 'scale(1.5 1)')
      .attr('d', d3.symbol().type(d3.symbolDiamond))
      .style('fill', d => this.groupColors(d?.group))
      .style('stroke', d => d3.rgb(this.groupColors(d?.group)).darker());

    milestone
      .on('mouseover', (event, d) => {
        this.showMilestoneTooltip(d, event.layerX, event.layerY);
      })
      .on('mouseout', () => {
        this.tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
      });

    const maxLabelWidth = 40;

    // milestone labels
    milestone
      .append('text')
      .text(d => d.name)
      .attr('class', 'milestoneLabel')
      .attr('x', 0)
      .attr('y', 20)
      .style('fill', d => d3.rgb(this.groupColors(d?.group)).darker())
      .attr('text-anchor', 'middle')
      .call(this.wrapLabel, maxLabelWidth);
  }

  redrawMilestones(): void {
    const startMilestonesHeight = this.groupsUnfiltered.length * this.barHeightWithMargin + this.barMargin;

    // milestones
    const dataGroup = this.svg.select('g.data-group');

    dataGroup.selectAll('g.milestoneEntry')
      .attr('transform', (d, i) => 'translate(' + this.xAxis(new Date(d.date)) + ','
        + ((this.barHeightWithMargin * (i % 3)) + startMilestonesHeight) + ')');
  }

  showMilestoneTooltip(d, x, y): void {
    this.tooltip
      .style('top', (y + 15) + 'px')
      .style('left', (x) + 'px')
      .style('display', 'block')
      .attr('font-size', 11)
      .html(`${d.name}<br>`
        // + `Projekt: ${d?.group}<br>`
        + `Fällig: ${new Date(d.date).toLocaleDateString('de-DE', this.dateOptions)}<br>`)
      .transition()
      .duration(500)
      .style('opacity', 1);
  }

  private drawTasks(tasksToShow): void {

    const drag = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      // tasks
      const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

      const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
      const yTransformValue = parseSvg(eventTask.attr('transform')).translateY;

      const xValueStartNew = (xTransformValue + event.dx);
      const xValueEndNew = xValueStartNew + this.calculateBarWidth(event.subject);

      eventTask.attr('transform', () => 'translate(' + xValueStartNew + ',' + yTransformValue + ')');

      event.subject.start = this.xAxis.invert(xValueStartNew);
      event.subject.end = this.xAxis.invert(xValueEndNew);

      this.refreshLabelPosition(eventTask);

      this.showTaskTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
    });

    const dragRight = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      let dragDx = event.dx;

      // task
      const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

      const width = eventTask.select('rect.task').attr('width');
      const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

      // do not allow negative bar width and remember dx values on a stack
      const widthNew = (+width + dragDx + this.dragDxStack);

      if (widthNew <= 0) {
        this.dragDxStack += dragDx;
        return;
      } else if (this.dragDxStack < 0) {
        if (this.dragDxStack + dragDx > 0) {
          dragDx += this.dragDxStack;
          this.dragDxStack = 0;
        } else {
          this.dragDxStack += dragDx;
          return;
        }
      }

      eventTask.select('rect.task').attr('width', widthNew);

      event.subject.end = this.xAxis.invert(xTransformValue + widthNew);

      // update right drag bar handle position
      const xValueDragBarRight = eventTask.select('rect.dragBarRight').attr('x');
      const xValueDragBarRightNew = (+xValueDragBarRight + dragDx);
      eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);

      this.refreshLabelPosition(eventTask);

      this.showTaskTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
    })
    .on('end', (event: d3.D3DragEvent<any, any, any>) => {
      this.dragDxStack = 0;
    });

    const dragLeft = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      let dragDx = event.dx;

      // task
      const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

      const oldX = parseFloat(eventTask.select('rect.task').attr('x'));

      const width = eventTask.select('rect.task').attr('width');

      const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

      const xValueNew = (xTransformValue + event.dx);

      // do not allow negative bar width and remember dx values on a stack
      const widthNew = (+width - dragDx - this.dragDxStack);

      if (widthNew <= 0) {
        this.dragDxStack += dragDx;
        return;
      } else if (this.dragDxStack > 0) {
        if (this.dragDxStack + dragDx < 0) {
          dragDx += this.dragDxStack;
          this.dragDxStack = 0;
        } else {
          this.dragDxStack += dragDx;
          return;
        }
      }

      if (widthNew <= 0) {
        return;
      }

      eventTask.select('rect.task').attr('x', +oldX + dragDx);

      event.subject.start = this.xAxis.invert(xValueNew + oldX);

      eventTask.select('rect.task').attr('width', widthNew);

      ////////

      // update left drag bar handle position
      const xValueDragBarLeft = eventTask.select('rect.dragBarLeft').attr('x');
      const xValueDragBarLeftNew = (+xValueDragBarLeft + dragDx);
      eventTask.select('rect.dragBarLeft').attr('x', xValueDragBarLeftNew);

      this.refreshLabelPosition(eventTask);

      this.showTaskTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
    })
    .on('end', (event: d3.D3DragEvent<any, any, any>) => {

      this.dragDxStack = 0;

      // task
      const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

      const oldX = parseFloat(eventTask.select('rect.task').attr('x'));

      const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
      const yTransformValue = parseSvg(eventTask.attr('transform')).translateY;

      const xValueNew = (xTransformValue + oldX);

      eventTask.attr('transform', 'translate(' + xValueNew + ',' + yTransformValue + ')');

      eventTask.select('rect.task').attr('x', 0);

      /////////
      const xValueDragBarLeftNew = (- (dragBarWidth / 2) - 7);
      eventTask.select('rect.dragBarLeft').attr('x', xValueDragBarLeftNew);

      /////////
      const taskWidth = eventTask.select('rect.task').attr('width');
      const xValueDragBarRightNew = (+taskWidth + 5);
      eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);

      this.refreshLabelPosition(eventTask);
    });

    const dragBarWidth = 5;

    // tasks
    const dataGroup = this.svg.select('g.data-group');
    const taskGroup = dataGroup.selectAll('g.taskEntry')
      .data(tasksToShow)
      .enter()
      .append('g')
      .attr('class', 'taskEntry')
      .attr('id', (d) => 'taskEntry_' + d.id)
      .attr('transform', (d, i) => 'translate(' + this.xAxis(new Date(d.start)) + ',' + (this.barHeightWithMargin * i) + ')')
      .call(drag);

    taskGroup
      .append('rect')
      .attr('class', 'task')
      .style('fill', d => this.groupColors(d?.group))
      .style('stroke', d => d3.rgb(this.groupColors(d?.group)).darker())
      .attr('x', 0)
      .attr('width', d => this.calculateBarWidth(d))
      .attr('y', 0)
      .attr('height', this.barHeight);

    taskGroup
      .append('rect')
      .attr('x', - (dragBarWidth / 2) - 7)
      .attr('y', 0)
      .attr('height', this.barHeight)
      .attr('class', 'dragBarLeft')
      .attr('width', dragBarWidth)
      .attr('fill', d => this.groupColors(d?.group))
      .attr('stroke', d => d3.rgb(this.groupColors(d?.group)).darker())
      .call(dragLeft);

    taskGroup
      .append('rect')
      .attr('x', d => this.calculateBarWidth(d) + 5)
      .attr('y', 0)
      .attr('class', 'dragBarRight')
      .attr('height', this.barHeight)
      .attr('width', dragBarWidth)
      .attr('fill', d => this.groupColors(d?.group))
      .attr('stroke', d => d3.rgb(this.groupColors(d?.group)).darker())
      .call(dragRight);

    taskGroup
      .on('mouseover', (event, d) => {
        const eventTask = dataGroup.select('#taskEntry_' + d.id);
        eventTask.select('rect.dragBarLeft')
          .transition()
          .duration(500)
          .style('opacity', 1);

        eventTask.select('rect.dragBarRight')
          .transition()
          .duration(500)
          .style('opacity', 1);

        this.showTaskTooltip(d, event.layerX, event.layerY);
      })
      .on('mouseout', (event, d) => {
        const eventTask = dataGroup.select('#taskEntry_' + d.id);
        eventTask.select('rect.dragBarLeft')
          .transition()
          .duration(500)
          .style('opacity', 0);

        eventTask.select('rect.dragBarRight')
          .transition()
          .duration(500)
          .style('opacity', 0);

        this.tooltip
          .transition()
          .duration(500)
          .style('opacity', 0)
          .transition()
          .delay(500)
          .style('display', 'none');
      });

    // task labels
    taskGroup
      .append('text')
      .text(d => d.name)
      .attr('class', 'taskLabel')
      .attr('x', d => {
        const eventTask = dataGroup.select('#taskEntry_' + d.id);

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

        const xValue = parseFloat(eventTask.select('rect.task').attr('x'));
        const xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;

        return this.calculateTaskLabelPosition(d) + xValueToAdd;
      })
      .attr('y', (this.barHeight + this.barMargin) / 2)
      .attr('text-height', this.barHeight);
  }

  redrawTasks(): void {
    // tasks
    const dataGroup = this.svg.select('g.data-group');

    const taskGroup = dataGroup.selectAll('g.taskEntry')
      .attr('transform', (d, i) => 'translate(' + this.xAxis(new Date(d.start)) + ',' + (this.barHeightWithMargin * i) + ')');

    taskGroup.selectAll('rect.task')
      .attr('width', d => this.calculateBarWidth(d));

    taskGroup.selectAll('rect.dragBarRight')
      .attr('x', d => this.calculateBarWidth(d) + 5);

    // task labels
    taskGroup.selectAll('text.taskLabel')
      .attr('x', d => {

        let xValueToAdd = 0;

        if (this.isVisible(d)) {
          const eventTask = dataGroup.select('#taskEntry_' + d.id);

          const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
          const xValue = parseFloat(eventTask.select('rect.task').attr('x'));

          xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;
        }

        return this.calculateTaskLabelPosition(d) + xValueToAdd;
      });
  }

  isVisible(d): boolean {
    return !(this.xAxis(new Date(d.end)) < this.xAxis.range()[0] ||
      this.xAxis(new Date(d.start)) > this.xAxis.range()[1]);
  }

  refreshLabelPosition(eventTask): void {

    const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

    const xValue = parseFloat(eventTask.select('rect.task').attr('x'));
    const xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;

    eventTask.select('text.taskLabel')
      .attr('x', d => this.calculateTaskLabelPosition(d) + xValueToAdd)
      .attr('y', (this.barHeight + this.barMargin) / 2);
  }

  showTaskTooltip(d, x, y): void {
    this.tooltip
      .style('top', (y + 15) + 'px')
      .style('left', (x) + 'px')
      .style('display', 'block')
      .html(`${d.name}<br>`
        // + `Projekt: ${d?.group}<br>`
        + `${new Date(d.start).toLocaleDateString('de-DE', this.dateOptions)}`
        + ` - ${new Date(d.end).toLocaleDateString('de-DE', this.dateOptions)}<br>`)
      .transition()
      .style('display', 'block')
      .duration(500)
      .style('opacity', 1);
  }

  // get label position of a task depending on chart range so it is displayed centered on the visible part of the bar
  private calculateTaskLabelPosition(d: any): number {
    const xAxisStart = this.xAxis(new Date(d.start));
    const xAxisEnd = this.xAxis(new Date(d.end));

    const startPosition = Math.max(xAxisStart, this.xAxis.range()[0]);
    const endPosition = Math.min(xAxisEnd, this.xAxis.range()[1]);

    return (endPosition - startPosition) / 2;
  }

  private calculateBarWidth(task: any): number {
    return this.xAxis(new Date(task.end)) - this.xAxis(new Date(task.start));
  }

  wrapLabel(svgText, maxWidth): void {

    svgText.each(function(): void {
      const text = d3.select(this);
      const words = text.text().split(/\s+/);

      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1;
      const y = text.attr('y');

      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', y);

      for (const word of words) {

        line.push(word);

        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];

          tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + 'em')
          .text(word);
        } else {
          tspan.text(line.join(' '));
        }
      }
    });
  }
}
