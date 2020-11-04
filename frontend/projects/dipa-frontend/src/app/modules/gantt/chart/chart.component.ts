import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() milestoneData = [];

  @Input() taskData = [];

  @Input() periodStartDate;

  @Input() periodEndDate;

  // element for chart
  private svg;

  private viewBoxHeight = 400;
  private viewBoxWidth = 750;

  // TODO: change to fixed height and variable length
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

  // get label position of a task depending on chart range so it is displayed centered on the visible part of the bar
  private static calculateTaskLabelPosition(d: any, xAxis): number {

    const xAxisStart = xAxis(d.start);
    const xAxisEnd = xAxis(d.end);

    const startPosition = Math.max(xAxisStart, xAxis.range()[0]);
    const endPosition = Math.min(xAxisEnd, xAxis.range()[1]);

    return (endPosition - startPosition) / 2;
  }

  private static calculateBarWidth(task: any, xAxis): number {
    return xAxis(task.end) - xAxis(task.start);
  }

  // Define filter conditions
  formatDate(date): any {
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

    this.groups = [...new Set(this.taskData.map(item => item.group))];

    this.groupsUnfiltered = [];
    for (const item of this.taskData) {
      this.groupsUnfiltered.push(item.group);
    }

    this.createGroupColors();

    this.drawChart();

    this.tooltip = d3.select('figure#chart')
      .append('div')
      .attr('class', 'tooltip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.periodStartDate || changes.periodEndDate) {
      this.drawChart();
    }
  }

  private drawChart(): void {

    // TODO
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
    }

    const xAxis = this.initializeXAxis();
    const yAxis = this.initializeYAxis();
    // this.initializeTestScale();

    this.drawHeaderX(xAxis);
    this.drawVerticalGridLines(xAxis);

    this.drawHeaderY();
    this.drawGroups();

    // draw only tasks which are visible
    // TODO: but keep the distance between
    const tasksToShow = this.taskData; // .filter((e): any => !(e.start >= this.periodEndDate || e.end <= this.periodStartDate));
    this.drawTasks(tasksToShow, xAxis);
    // draw only milestones which are visible
    const milestonesToShow = this.milestoneData; // .filter((e): any => e.start >= this.periodStartDate && e.start <= this.periodEndDate);
    this.drawMilestones(milestonesToShow, xAxis, yAxis);
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

    const zoom = d3.zoom()
      .scaleExtent([0.1, 30])
      .on('zoom', (event: d3.D3ZoomEvent<any, any>) => {

        const xAxisRescaled = event.transform.rescaleX(this.xAxis);

        // for testing the xAxis
        /*
        const xAxisB = this.svg.select('g.x-axis-bottom');
        xAxisB.call(d3.axisBottom(xAxisRescaled));
        */

        this.periodStartDate = xAxisRescaled.invert(xAxisRescaled.range()[0]);
        this.periodEndDate = xAxisRescaled.invert(xAxisRescaled.range()[1]);

        this.updateChart(event);
      });

    this.svg.append('rect')
      .attr('width', this.viewBoxWidth)
      .attr('height', this.viewBoxHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', 'translate(' + this.padding.left + ',' + this.padding.top + ')')
      .call(zoom);

    const dataGroup = this.svg.append('g').attr('class', 'data-group');
    dataGroup.attr('transform', 'translate(' + this.padding.left + ',' + (this.padding.top + this.barMargin) + ')');


    dataGroup
      .attr('mask', 'url(#dataMask)');

    // for testing the xAxis
    /*
    const xAxisBottom = this.svg.append('g').attr('class', 'x-axis-bottom');
    xAxisBottom.attr('transform', 'translate(' + this.padding.left + ',250)');
    */
  }

  updateChart(event): void {

    const newScaleX = event.transform.rescaleX(this.xAxis);

    this.drawHeaderX(newScaleX);
    this.drawVerticalGridLines(newScaleX);

    const tasksToShow = this.taskData; // .filter((e): any => !(e.start >= this.periodEndDate || e.end <= this.periodStartDate));
    this.drawTasks(tasksToShow, newScaleX);

    const milestonesToShow = this.milestoneData; // .filter((e): any => e.start >= this.periodStartDate && e.start <= this.periodEndDate);
    this.drawMilestones(milestonesToShow, newScaleX, this.yAxis);
  }

  // Set X axis
  private initializeXAxis(): any {
    return this.xAxis = d3.scaleTime()
      .domain([this.periodStartDate, this.periodEndDate])
      .range([0, this.viewBoxWidth - this.padding.left]);
  }

  // Set Y axis
  private initializeYAxis(): any {
    return this.yAxis = d3.scaleBand()
      .domain(this.taskData.map(d => d.group))
      .range([0, this.viewBoxHeight]);
  }

  /*
  private initializeTestScale(): void {
    // for testing
    const xAxisBottom = this.svg.select('g.x-axis-bottom');
    xAxisBottom.selectAll('line.xGridLines').remove();
    xAxisBottom
      // .attr('transform', 'translate(' + this.padding.left + ',250)')
      .attr('stroke-width', 0.5)
      .call(d3.axisBottom(this.xAxis)); // .tickFormat(this.formatDate));
    xAxisBottom
      // .attr('transform', 'translate(' + this.padding.left + ',250)')
      .style('font-size', '6')
      .style('stroke-dasharray', ('1,1'))
      .attr('stroke-width', 0.1)
      .call(d3.axisBottom(this.xAxis).ticks(10));
  }
  */

  private drawVerticalGridLines(xAxis): void {

    const xGroup = this.svg.select('g.x-group');

    // vertical grid lines
    xGroup.selectAll('line.xGridLines').remove();
    xGroup.selectAll('line.xGridLines')
      .data(xAxis.ticks())
      .enter()
      .append('line')
      .attr('class', 'xGridLines')
      .attr('x1', d => xAxis(d))
      .attr('x2', d => xAxis(d))
      .attr('y1', 0)
      .attr('y2', this.viewBoxHeight)  // TODO
      .style('stroke', '#eee');
  }

  private drawHeaderX(xAxis): void {

    const xGroup = this.svg.select('g.x-group');

    // x-axis header background
    xGroup.select('rect.headerX').remove();
    xGroup
      .append('rect')
      .attr('class', 'headerX')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (this.viewBoxWidth - this.padding.left))
      .attr('height', (this.barHeight + this.barMargin));

    // x-axis labels
    xGroup.selectAll('text.xAxisLabel').remove();
    xGroup.selectAll('text')
      .data(xAxis.ticks())
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text(d => this.formatDate(d))
      .attr('x', d => xAxis(d) + 4)
      .attr('y', 18);

    // current date indicator
    xGroup.select('line.currentDate').remove();
    xGroup
      .append('line')
      .attr('class', 'currentDate')
      .attr('x1', 0)
      .attr('x2', Math.min(Math.max(xAxis(new Date()), 0), xAxis.range()[1]))
      .attr('y1', this.barHeight + this.barMargin)
      .attr('y2', this.barHeight + this.barMargin);
  }

  private drawHeaderY(): void {
    const occurrences = [];
    let sumOccurrences = 0;

    for (let i = 0; i < this.groups.length; i++){
      occurrences[i] = [this.groups[i], ChartComponent.getCount(this.groups[i], this.groupsUnfiltered)];
    }

    const yGroup = this.svg.select('g.y-group');
    // group titles as y-axis labels
    yGroup.selectAll('text.groupTitle').remove();
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
    yGroup.selectAll('rect.groupBackground').remove();
    yGroup.selectAll('rect.groupBackground')
      .data(this.taskData)
      .enter()
      .append('rect')
      .attr('class', 'groupBackground')
      .attr('x', 0)
      .attr('y', (d, i) => (this.barHeightWithMargin) * i - this.barMargin)
      .attr('width', this.width)
      .attr('height', (this.barHeightWithMargin))
      .attr('fill', d => this.groupColors(d.group));
  }

  private drawMilestones(milestonesToShow, xAxis, yAxis): void {

    const dataGroup = this.svg.select('g.data-group');

    const drag = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      console.log(event);

      // milestones
      const eventMilestone = dataGroup.select('#milestoneEntry_' + event.subject.id);

      // const oldTranslate = d3.transform(eventMilestone.attr('transform')).translate;

      // TODO: get the y-value in other way
      const xValue = eventMilestone.attr('transform').split('(')[1].split(',')[0];
      const yValue = eventMilestone.attr('transform').split('(')[1].split(',')[1].split(')')[0];

      const xValueNew = (+xValue + event.dx);

      eventMilestone.attr('transform', 'translate(' + xValueNew + ',' + yValue + ')');

      // TODO: auslagern
      event.subject.start = xAxis.invert(xValueNew);
    });

    // milestones
    dataGroup.selectAll('g.milestoneEntry').remove();
    const milestone = dataGroup.selectAll('g.milestoneEntry')
      .data(milestonesToShow)
      .enter()
      .append('g')
      .attr('class', 'milestoneEntry')
      .attr('id', (d) => 'milestoneEntry_' + d.id)
      .attr('transform', (d) => 'translate(' + xAxis(d.start) + ',' + (yAxis(d.group) + 50) + ')')
      .call(drag);

    milestone
      .append('path')
      .attr('class', 'milestone')
      .attr('transform', 'scale(1.5 1)')
      .attr('d', d3.symbol().type(d3.symbolDiamond))
      .style('fill', d => this.groupColors(d.group))
      .style('stroke', d => d3.rgb(this.groupColors(d.group)).darker());

    milestone
      .on('mouseover', (event, d) => {
        this.tooltip
        .style('top', (event.layerY + 15) + 'px')
        .style('left', (event.layerX) + 'px')
        .style('display', 'block')
        .attr('font-size', 11)
        .html(`${d.name}<br>`
          + `Projekt: ${d.group}<br>`
          + `Fällig: ${new Date(d.start).toLocaleDateString('de-DE', this.dateOptions)}<br>`
          + `Abgeschlossen: ${d.complete}<br>`)
        .transition()
        .duration(500)
        .style('opacity', 1);
    })
    .on('mouseout', () => {
      this.tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

    // milestone labels
    /*dataGroup.selectAll('text.milestoneLabel').remove();
    dataGroup.selectAll('text.milestoneLabel')
      .data(milestonesToShow)
      .enter()*/
    milestone
      .append('text')
      .text(d => d.name)
      .attr('class', 'milestoneLabel')
      .attr('x', 10)
      .attr('y', 5)
      .style('fill', d => d3.rgb(this.groupColors(d.group)).darker());
  }

  private drawTasks(tasksToShow, xAxis): void {

    const dataGroup = this.svg.select('g.data-group');

    const drag = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      console.log(event);

      // tasks
      const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

      // const oldTranslate = d3.transform(eventTask.attr('transform')).translate;

      // TODO: get the y-value in other way
      const xValue = eventTask.attr('transform').split('(')[1].split(',')[0];
      const yValue = eventTask.attr('transform').split('(')[1].split(',')[1].split(')')[0];

      const xValueStartNew = (+xValue + event.dx);
      const xValueEndNew = xValueStartNew + ChartComponent.calculateBarWidth(event.subject, xAxis);

      eventTask.attr('transform', () => 'translate(' + xValueStartNew + ',' + yValue + ')');

      // TODO: auslagern
      event.subject.start = xAxis.invert(xValueStartNew);
      event.subject.end = xAxis.invert(xValueEndNew);
    });

    const dragRight = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      // task
      const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

      // const oldTranslate = d3.transform(eventTask.attr('transform')).translate;

      // TODO: get the y-value in other way

      const width = eventTask.select('rect.task').attr('width');

      const xValue = eventTask.attr('transform').split('(')[1].split(',')[0];
      /* const yValue = eventTask.attr('transform').split('(')[1].split(',')[1].split(')')[0];*/

      // TODO: keine negativen Werte erlauben
      const widthNew = (+width + event.dx);

      eventTask.select('rect.task').attr('width', widthNew);

      // eventTask.attr('transform', 'translate(' + xValueNew + ',' + yValue + ')');

      // TODO: auslagern
      event.subject.end = xAxis.invert(+xValue + widthNew);

      ////////

      const xValueDragBarRight = eventTask.select('rect.dragBarRight').attr('x');
      const xValueDragBarRightNew = (+xValueDragBarRight + event.dx);
      eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);
    });

    const dragLeft = d3.drag()
    .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

      // task
      const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

      // const oldTranslate = d3.transform(eventTask.attr('transform')).translate;

      // TODO: get the y-value in other way

      const oldX = eventTask.select('rect.task').attr('x');

      const width = eventTask.select('rect.task').attr('width');

      const xValue = eventTask.attr('transform').split('(')[1].split(',')[0];
      // const yValue = eventTask.attr('transform').split('(')[1].split(',')[1].split(')')[0];

      // TODO: keine negativen Werte erlauben
      const widthNew = (+width - event.dx);

      const xValueNew = (parseFloat(xValue) + event.dx);

      // console.log('old xValue: ' + xValue + ', width: ' + width + ', sum: ' + (parseFloat(xValue) + parseFloat(width)));
      // console.log('new xValue: ' + xValueNew + ', width: ' + widthNew + ', sum: ' + (xValueNew + widthNew));

      console.log(event.dx);

      // eventTask.attr('transform', 'translate(' + xValueNew + ',' + yValue + ')');

      eventTask.attr('x', oldX + event.dx);

      // TODO: auslagern
      event.subject.start = xAxis.invert(xValueNew);

      eventTask.select('rect.task').attr('width', widthNew);

      ////////

      const xValueDragBarRight = eventTask.select('rect.dragBarRight').attr('x');
      const xValueDragBarRightNew = (+xValueDragBarRight - event.dx);
      eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);

    });

    const dragBarWidth = 5;

    // tasks
    dataGroup.selectAll('g.taskEntry').remove();
    const taskGroup = dataGroup.selectAll('g.taskEntry')
      .data(tasksToShow)
      .enter()
      .append('g')
      .attr('class', 'taskEntry')
      .attr('id', (d) => 'taskEntry_' + d.id)
      .attr('transform', (d, i) => 'translate(' + xAxis(d.start) + ',' + (this.barHeightWithMargin * i) + ')')
      .call(drag);

    taskGroup
      .append('rect')
      .attr('class', 'task')
      .style('fill', d => this.groupColors(d.group))
      .style('stroke', d => d3.rgb(this.groupColors(d.group)).darker())
      .attr('x', 0)
      .attr('width', d => ChartComponent.calculateBarWidth(d, xAxis))
      .attr('y', 0)
      .attr('height', this.barHeight);

    taskGroup
      .append('rect')
      .attr('x', - (dragBarWidth / 2) - 7)
      .attr('y', 0)
      .attr('height', this.barHeight)
      .attr('class', 'dragBarLeft')
      .attr('width', dragBarWidth)
      .attr('fill', d => this.groupColors(d.group))
      .attr('stroke', d => d3.rgb(this.groupColors(d.group)).darker())
      .call(dragLeft);

    taskGroup
      .append('rect')
      .attr('x', d => ChartComponent.calculateBarWidth(d, xAxis) + 5)
      .attr('y', 0)
      .attr('class', 'dragBarRight')
      .attr('height', this.barHeight)
      .attr('width', dragBarWidth)
      .attr('fill', d => this.groupColors(d.group))
      .attr('stroke', d => d3.rgb(this.groupColors(d.group)).darker())
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

        this.tooltip
          .style('top', (event.layerY + 15) + 'px')
          .style('left', (event.layerX) + 'px')
          .style('display', 'block')
          .html(`${d.name}<br>`
            + `Projekt: ${d.group}<br>`
            + `${new Date(d.start).toLocaleDateString('de-DE', this.dateOptions)}`
            + ` - ${new Date(d.end).toLocaleDateString('de-DE', this.dateOptions)}<br>`
            + `Fortschritt: ${d.progress}<br>`)
          .transition()
          .duration(500)
          .style('opacity', 1);
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
          .style('opacity', 0);
      });

    // task labels
    taskGroup
      .append('text')
      .text(d => d.name)
      .attr('class', 'taskLabel')
      .attr('x', d => ChartComponent.calculateTaskLabelPosition(d, xAxis))
      .attr('y', (this.barHeight + this.barMargin) / 2)
      .attr('text-height', this.barHeight);
  }


  changeStartDate(change: string, $event: any): void {
    if ($event.value) {
      this.periodStartDate = $event.value;
      console.log($event);
      this.drawChart();
    }
  }

  changeEndDate(change: string, $event: any): void {
    if ($event.value) {
      this.periodEndDate = $event.value;
      console.log($event);
      this.drawChart();
    }
  }
}
