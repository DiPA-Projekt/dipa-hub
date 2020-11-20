import * as d3 from 'd3';

export class XAxis {

  svg;
  readonly xScale;

  svgBbox;

  height = 28;

  formatDate;

  tickSetting;

  constructor(svg: any, xScale: any) {
    this.svg = svg;
    this.xScale = xScale;
    this.svgBbox = this.svg.node().getBBox();
  }

  draw(): void {

    const xGroup = this.svg.select('g.x-group');

    const viewBoxWidth = this.svgBbox.width;

    // x-axis header background
    xGroup
      .append('rect')
      .attr('class', 'headerX')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (viewBoxWidth))
      .attr('height', (this.height));

    // x-axis labels
    xGroup.selectAll('text')
      .data(this.xScale.ticks())
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text(d => this.formatDate(d))
      .attr('x', d => this.xScale(d) + 4)
      .attr('y', 18);

    this.drawVerticalGridLines();
  }

  redraw(): void {

    const xGroup = this.svg.select('g.x-group');

    // x-axis labels
    xGroup.selectAll('text.xAxisLabel').remove();
    xGroup.selectAll('text')
      .data(this.xScale.ticks(this.tickSetting))
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text(d => this.formatDate(d))
      .attr('x', d => this.xScale(d) + 4)
      .attr('y', 18);

    this.redrawVerticalGridLines();
  }

  resize(newSize): void {
    const xGroup = this.svg.select('g.x-group');

    // x-axis header background
    xGroup.select('rect.headerX')
      .attr('width', (newSize));
  }

  private drawVerticalGridLines(): void {
    const xGroup = this.svg.select('g.x-group');

    const viewBoxHeight = this.svgBbox.height;

    // vertical grid lines
    xGroup.selectAll('line.xGridLines')
      .data(this.xScale.ticks(this.tickSetting))
      .enter()
      .append('line')
      .attr('class', 'xGridLines')
      .attr('x1', d => this.xScale(d))
      .attr('x2', d => this.xScale(d))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .style('stroke', '#eee');
  }

  redrawVerticalGridLines(): void {
    const xGroup = this.svg.select('g.x-group');

    // vertical grid lines
    xGroup.selectAll('line.xGridLines').remove();
    this.drawVerticalGridLines();
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

  formatDateDay(date): any {
    return (d3.timeYear(date) < date ? (d3.timeMonth(date) < date ? d3.timeFormat('%a, %d.') : d3.timeFormat('%d. %b'))
    : d3.timeFormat('%d.%m.%y'))(date);
  }

  formatDateWeek(date): any {
    return (d3.timeFormat('%V')(date) === '01' ? d3.timeFormat('%Y') : d3.timeFormat('KW %V'))
    (date);
  }

  formatDateMonth(date): any {
    return (d3.timeYear(date) < date ? d3.timeFormat('%b') : d3.timeFormat('%b %y'))
    (date);
  }

  formatDateYear(date): any {
    return (d3.timeFormat('%Y'))
    (date);
  }


}
