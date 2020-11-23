import * as d3 from 'd3';

export class XAxis {

  svg;
  readonly xScale;

  svgBbox;

  height = 28;
  
  formatDate;

  tickSetting;

  tooltip;
  dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
  
  today = new Date();

  constructor(svg: any, xScale: any) {
    this.svg = svg;
    this.xScale = xScale;
    this.svgBbox = this.svg.node().getBBox();
    this.tooltip = d3.select('figure#chart .tooltip');
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

    this.drawVerticalLineCurrentDate();
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

    this.redrawVerticalLineCurrentDate();
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
    return (d3.timeFormat('%V')(date) == '01' ? d3.timeFormat('KW %V-%y') : d3.timeFormat('KW %V'))
    (date);
  }
  formatDateMonth(date): any {
    return (d3.timeYear(date) < date ? d3.timeFormat('%B') : d3.timeFormat('%b %y'))
    (date);
  }

  formatDateYear(date): any {
    return (d3.timeFormat('%Y'))
    (date);
  }

  private drawVerticalLineCurrentDate(): void {

    const lightColor = '#b47ae6';
    const darkColor = '#a14fe8';

    const viewBoxHeight = this.svgBbox.height;
    const distanceFromTop = 30;

    const circle = this.svg.select('g.current-date-group')
      .append('circle')
      .attr('class', 'currentDateCircle')
      .style('stroke', lightColor)
      .attr('cx', this.xScale(this.today));

    const point = this.svg.select('g.current-date-group')
      .append('circle')
      .attr('class', 'currentDatePoint')
      .style('stroke', lightColor)
      .style('fill', lightColor)
      .attr('cx', this.xScale(this.today));
    
    const currentLine = this.svg.select('g.current-date-group')
      .append('line')
      .attr('class', 'currentDateLine')
      .attr('transform', 'translate(0, 9)')
      .attr('x1', this.xScale(this.today))
      .attr('x2', this.xScale(this.today))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight + distanceFromTop)
      .attr('stroke', d3.rgb(lightColor).darker());

      
    this.svg.select('g.current-date-group').on('mouseover', (event) => {
      currentLine.attr('stroke-width', 1.5).style('stroke', darkColor);

      point.style('stroke', darkColor).style('fill', darkColor);

      circle.style('stroke', darkColor);

      this.showLineTooltip(event.layerX, event.layerY);
    })
    .on('mouseout', () => {
      currentLine.attr('stroke-width', 1);

      point.style('stroke', lightColor).style('fill', lightColor);

      circle.style('stroke', lightColor);

      this.tooltip
        .transition()
        .duration(50)
        .style('opacity', 0)
        .transition()
        .delay(50)
        .style('display', 'none');
    });
  }

  showLineTooltip(x, y): void {
    this.tooltip
      .style('top', (y + 15) + 'px')
      .style('left', (x + 10) + 'px')
      .style('display', 'block')
      .html('Heute: '
        + `${new Date().toLocaleDateString('de-DE', this.dateOptions)}<br>`)
      .transition()
      .duration(300)
      .style('opacity', 1);
  }

  private redrawVerticalLineCurrentDate(): void {

    this.svg.select('g.current-date-group').select('line.currentDateLine')
      .attr('x1', this.xScale(this.today))
      .attr('x2', this.xScale(this.today));

    this.svg.select('g.current-date-group').select('circle.currentDateCircle')
      .attr('cx', this.xScale(this.today));
    
    this.svg.select('g.current-date-group').select('circle.currentDatePoint')
      .attr('cx', this.xScale(this.today));

  }
}
