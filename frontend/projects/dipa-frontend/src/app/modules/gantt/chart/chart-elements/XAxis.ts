import * as d3 from 'd3';
import { ScaleTime } from 'd3-scale';
import Utils from '../../../../shared/utils';

export class XAxis {
  public formatDate: (date: Date) => string;
  public tickSetting: d3.TimeInterval;

  private svg: d3.Selection<any, any, any, any>;
  private tooltip: d3.Selection<any, any, any, any>;
  private readonly xScale: ScaleTime<any, any>;

  private svgBbox: DOMRect;

  private height = 28;

  private today = new Date();

  public constructor(svg: d3.Selection<any, any, any, any>, chartElement: HTMLElement, xScale: ScaleTime<any, any>) {
    this.svg = svg;
    this.xScale = xScale;
    this.svgBbox = (this.svg.node() as SVGGraphicsElement).getBBox();
    this.tooltip = d3.select(chartElement).select('figure#chart .tooltip');
  }

  public draw(): void {
    const xGroup = this.svg.select('g.x-group');

    const viewBoxWidth = this.svgBbox.width;

    // x-axis header background
    xGroup
      .append('rect')
      .attr('class', 'headerX')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', viewBoxWidth)
      .attr('height', this.height);

    // x-axis labels
    xGroup
      .selectAll('text')
      .data(this.xScale.ticks())
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text((d) => this.formatDate(d))
      .attr('x', (d) => parseInt(this.xScale(d), 10) + 4)
      .attr('y', 18);

    this.drawVerticalGridLines();

    this.drawVerticalLineCurrentDate();
  }

  public redraw(): void {
    const xGroup = this.svg.select('g.x-group');

    // x-axis labels
    xGroup.selectAll('text.xAxisLabel').remove();
    xGroup
      .selectAll('text')
      .data(this.xScale.ticks(this.tickSetting))
      .enter()
      .append('text')
      .attr('class', 'xAxisLabel')
      .text((d) => this.formatDate(d))
      .attr('x', (d) => parseInt(this.xScale(d), 10) + 4)
      .attr('y', 18);

    this.redrawVerticalGridLines();

    this.redrawVerticalLineCurrentDate();
  }

  public resize(newSize: number): void {
    const xGroup = this.svg.select('g.x-group');

    // x-axis header background
    xGroup.select('rect.headerX').attr('width', newSize);
  }

  // Define filter conditions
  public formatDateFull(date: Date): string {
    return (
      d3.timeSecond(date) < date
        ? d3.timeFormat('.%L')
        : d3.timeMinute(date) < date
        ? d3.timeFormat(':%S')
        : d3.timeHour(date) < date
        ? d3.timeFormat('%H:%M')
        : d3.timeDay(date) < date
        ? d3.timeFormat('%H:%M')
        : d3.timeMonth(date) < date
        ? d3.timeWeek(date) < date
          ? d3.timeFormat('%a, %d.')
          : d3.timeFormat('%d. %b')
        : d3.timeYear(date) < date
        ? d3.timeFormat('%b')
        : d3.timeFormat('%Y')
    )(date);
  }

  public formatDateDay(date: Date): string {
    return (
      d3.timeYear(date) < date
        ? d3.timeMonth(date) < date
          ? d3.timeFormat('%a, %d.')
          : d3.timeFormat('%d. %b')
        : d3.timeFormat('%d.%m.%y')
    )(date);
  }

  public formatDateWeek(date: Date): string {
    return (d3.timeFormat('%V')(date) === '01' ? d3.timeFormat('KW %V-%y') : d3.timeFormat('KW %V'))(date);
  }

  public formatDateMonth(date: Date): string {
    return (d3.timeYear(date) < date ? d3.timeFormat('%B') : d3.timeFormat('%b %y'))(date);
  }

  public formatDateYear(date: Date): string {
    return d3.timeFormat('%Y')(date);
  }

  private redrawVerticalGridLines(): void {
    const xGroup = this.svg.select('g.x-group');

    // vertical grid lines
    xGroup.selectAll('line.xGridLines').remove();
    this.drawVerticalGridLines();
  }

  private drawVerticalGridLines(): void {
    const xGroup = this.svg.select('g.x-group');

    const viewBoxHeight = this.svgBbox.height;

    // vertical grid lines
    xGroup
      .selectAll('line.xGridLines')
      .data(this.xScale.ticks(this.tickSetting))
      .enter()
      .append('line')
      .attr('class', 'xGridLines')
      .attr('x1', (d) => parseInt(this.xScale(d), 10))
      .attr('x2', (d) => parseInt(this.xScale(d), 10))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .style('stroke', '#eee');
  }

  private drawVerticalLineCurrentDate(): void {
    const lightColor = '#b47ae6';
    const darkColor = '#a14fe8';

    const viewBoxHeight = this.svgBbox.height;
    const distanceFromTop = 30;

    const circle = this.svg
      .select('g.current-date-group')
      .append('circle')
      .attr('class', 'currentDateCircle')
      .style('stroke', lightColor)
      .attr('cx', this.xScale(this.today));

    const point = this.svg
      .select('g.current-date-group')
      .append('circle')
      .attr('class', 'currentDatePoint')
      .style('stroke', lightColor)
      .style('fill', lightColor)
      .attr('cx', this.xScale(this.today));

    const currentLine = this.svg
      .select('g.current-date-group')
      .append('line')
      .attr('class', 'currentDateLine')
      .attr('transform', 'translate(0, 9)')
      .attr('x1', this.xScale(this.today))
      .attr('x2', this.xScale(this.today))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight + distanceFromTop)
      .attr('stroke', d3.rgb(lightColor).darker().formatHex());

    this.svg
      .select('g.current-date-group')
      .on('mouseover', (event: MouseEvent) => {
        currentLine.attr('stroke-width', 1.5).style('stroke', darkColor);

        point.style('stroke', darkColor).style('fill', darkColor);

        circle.style('stroke', darkColor);

        this.showLineTooltip(event.clientX, event.clientY);
      })
      .on('mouseout', () => {
        currentLine.attr('stroke-width', 1);

        point.style('stroke', lightColor).style('fill', lightColor);

        circle.style('stroke', lightColor);

        this.tooltip.transition().duration(50).style('opacity', 0).transition().delay(50).style('display', 'none');
      });
  }

  private redrawVerticalLineCurrentDate(): void {
    this.svg
      .select('g.current-date-group')
      .select('line.currentDateLine')
      .attr('x1', this.xScale(this.today))
      .attr('x2', this.xScale(this.today));

    this.svg.select('g.current-date-group').select('circle.currentDateCircle').attr('cx', this.xScale(this.today));

    this.svg.select('g.current-date-group').select('circle.currentDatePoint').attr('cx', this.xScale(this.today));
  }

  private showLineTooltip(x: number, y: number): void {
    this.tooltip
      .style('top', `${y + 15}px`)
      .style('left', `${x + 10}px`)
      .style('display', 'block')
      .html('Heute: ' + `${Utils.getGermanFormattedDateString(this.today)}<br>`)
      .transition()
      .duration(300)
      .style('opacity', 1);
  }
}
