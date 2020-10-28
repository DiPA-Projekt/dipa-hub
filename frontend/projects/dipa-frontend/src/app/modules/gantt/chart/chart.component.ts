import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ChartComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() milestoneData = [];

  @Input() taskData = [];

  @Input() periodStartDate = new Date(2020, 0, 1);

  @Input() periodEndDate = new Date(2020, 11, 31);

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
      .attr('class', 'tooltip')
      .style('display', 'none')
      .style('position', 'absolute')
      .style('color', '#fff')
      .style('background-color', 'rgba(0, 0, 0, 0.78)')
      .style('padding', '0.5rem')
      .style('border-radius', '0.25rem')
      .style('opacity', 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.periodStartDate || changes.periodEndDate) {
      this.drawChart();
    }
  }

  private drawChart(): void {

    if (!this.svg) {
      this.createSvg();
      this.initializeSvgGraphElements();

      this.svg.append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

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

    this.initializeAxes();

    this.drawHeaderX();
    this.drawVerticalGridLines();

    this.drawHeaderY();
    this.drawGroups();

    this.drawTasks();
    this.drawMilestones();
  }

  private createSvg(): void {

    this.svg = d3.select('figure#chart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100vh')
      .attr('viewBox', '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight);
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

    const dataGroup = this.svg.append('g').attr('class', 'data-group');
    dataGroup.attr('transform', 'translate(' + this.padding.left + ',' + (this.padding.top + this.barMargin) + ')');
  }

  private initializeAxes(): void {
    // Set X axis
    this.xAxis = d3.scaleTime()
      .range([0, this.viewBoxWidth - this.padding.left]);
    this.xAxis.domain([this.periodStartDate, this.periodEndDate]);

    // Set Y axis
    this.yAxis = d3.scaleBand()
      .domain(this.taskData.map(d => d.group))
      .range([0, this.viewBoxHeight]);
  }

  private drawVerticalGridLines(): void {

    const xGroup = this.svg.select('g.x-group');

    // vertical grid lines
    xGroup.selectAll('line.xGridLines').remove();
    xGroup.selectAll('line.xGridLines')
      .data(this.xAxis.ticks())
      .enter()
      .append('line')
      .attr('class', 'xGridLines')
      .attr('x1', d => this.xAxis(d))
      .attr('x2', d => this.xAxis(d))
      .attr('y1', 0)
      .attr('y2', this.viewBoxHeight)  // TODO
      .style('stroke', '#eee');
  }

  private drawHeaderX(): void {

    const xGroup = this.svg.select('g.x-group');

    // x-axis header background
    xGroup.selectAll('line.headerX').remove();
    xGroup.selectAll('rect.headerX')
      .data(this.taskData)
      .enter()
      .append('rect')
      .attr('class', 'headerX')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (this.viewBoxWidth - this.padding.left))
      .attr('height', (this.barHeight + this.barMargin))
      .attr('stroke', 'none')
      .attr('fill', '#444')
      .attr('rx', 3)
      .attr('opacity', 0.8);

    // x-axis labels
    xGroup.selectAll('text.xAxisLabel').remove();
    xGroup.selectAll('text')
      .data(this.xAxis.ticks())
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text(d => this.formatDate(new Date(d)))
      .attr('x', d => this.xAxis(d) + 4)
      .attr('y', 18)
      .attr('font-size', 12)
      .style('fill', '#fff');

    // current date indicator
    xGroup.selectAll('line.yTicks').remove();
    xGroup.selectAll('line.yTicks')
      .data(this.xAxis.ticks())
      .enter()
      .append('line')
      .attr('class', 'yTicks')  // TODO: ??
      .attr('x1', 0)
      .attr('x2', this.xAxis(new Date()))
      .attr('y1', this.barHeight + this.barMargin)
      .attr('y2', this.barHeight + this.barMargin)
      .attr('stroke-width', 6)
      .style('stroke', '#f00');
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
    .attr('text-anchor', 'start')
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
    yGroup.selectAll('rect.group').remove();
    yGroup.selectAll('rect.group')
      .data(this.taskData)
      .enter()
      .append('rect')
      .attr('class', 'group')
      .attr('x', 0)
      .attr('y', (d, i) => (this.barHeightWithMargin) * i - this.barMargin)
      .attr('width', this.width)
      .attr('height', (this.barHeightWithMargin))
      .attr('stroke', 'none')
      .attr('fill', d => this.groupColors(d.group))
      .attr('opacity', 0.2);
  }

  private drawMilestones(): void {

    const dataGroup = this.svg.select('g.data-group');

    // milestones
    dataGroup.selectAll('path.milestone').remove();
    dataGroup.selectAll('dot.milestone')
      .data(this.milestoneData)
      .enter()
      .append('path')
      .attr('class', 'milestone')
      .attr('transform', (d) => 'translate(' + this.xAxis(new Date(d.start)) + ','
        + (this.yAxis(d.group) + 50) + ') scale(1.5 1)')
      .attr('d', d3.symbol().type(d3.symbolDiamond))
      .attr('width', '50')
      .style('fill', d => this.groupColors(d.group))
      .style('stroke', d => d3.rgb(this.groupColors(d.group)).darker())
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
    dataGroup.selectAll('text.milestoneLabel').remove();
    dataGroup.selectAll('text.milestoneLabel')
      .data(this.milestoneData)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('class', 'milestoneLabel')
      .attr('x', d => this.xAxis(new Date(d.start)) + 10)
      .attr('y', d => this.yAxis(d.group) + 55)
      .attr('font-size', 12)
      .style('fill', d => d3.rgb(this.groupColors(d.group)).darker());
  }

  private drawTasks(): void {

    const dataGroup = this.svg.select('g.data-group');

    // tasks
    dataGroup.selectAll('rect.bar').remove();
    dataGroup.selectAll('rect.bar')
      .data(this.taskData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .style('fill', d => this.groupColors(d.group))
      .style('stroke', d => d3.rgb(this.groupColors(d.group)).darker())
      .attr('rx', 3)
      .attr('x', d => this.xAxis(new Date(d.start)))
      .attr('width', d => this.calculateBarWidth(d))
      .attr('y', (d, i) => (this.barHeightWithMargin) * i)
      .attr('height', this.barHeight)
      .on('mouseover', (event, d) => {
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
      .on('mouseout', () => {
        this.tooltip
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

    // task labels
    dataGroup.selectAll('text.taskLabel').remove();
    dataGroup.selectAll('text.taskLabel')
      .data(this.taskData)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('class', 'taskLabel')
      .attr('x', d =>
        (this.xAxis(new Date(d.end))
          - this.xAxis(new Date(d.start))) / 2
        + this.xAxis(new Date(d.start)))

      .attr('y', (d, i) => (this.barHeightWithMargin) * i
        + (this.barHeight + this.barMargin) / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('text-height', this.barHeight)
      .style('fill', '#fff');
  }

  private calculateBarWidth(task: any): number {
    return this.xAxis(new Date(task.end)) - this.xAxis(new Date(task.start));
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
