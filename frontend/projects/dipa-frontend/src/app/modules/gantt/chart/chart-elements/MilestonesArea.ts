import * as d3 from 'd3';
import {parseSvg} from 'd3-interpolate/src/transform/parse';
import {IChartElement} from './IChartElement';

export class MilestonesArea implements IChartElement {

  svg;
  readonly xScale;
  data: any[];
  tooltip;

  animationDuration;

  dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

  elementHeight = 20;
  elementMargin = 8;
  elementHeightWithMargin = this.elementHeight + 2 * this.elementMargin;

  elementColor = '#62a9f9';

  initMilestoneDate;

  public onDragEndMilestone?: (days: number, id: number) => void;

  constructor(svg: any, xScale: any, data: any[]) {
    this.svg = svg;
    this.xScale = xScale;
    this.data = data;

    this.tooltip = d3.select('figure#chart .tooltip');
  }

  setData(data): void {
    this.data = data;

    const dataGroup = this.svg.select('g.data-group');
    dataGroup.selectAll('g.milestoneEntry')
      .data(this.data);
  }

  draw(offset): void {

    const dataGroup = this.svg.select('g.data-group');

    const drag = d3.drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

        // milestones
        const eventMilestone = dataGroup.select('#milestoneEntry_' + event.subject.id);

        const xTransformValue = parseSvg(eventMilestone.attr('transform')).translateX;
        const yTransformValue = parseSvg(eventMilestone.attr('transform')).translateY;

        const xValueNew = (xTransformValue + event.dx);

        eventMilestone.attr('transform', 'translate(' + xValueNew + ',' + yTransformValue + ')');

        event.subject.date = this.xScale.invert(xValueNew);

        this.showTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
      })
      .on('start', (event: d3.D3DragEvent<any, any, any>) => {

        this.initMilestoneDate = new Date(this.data.find(d => d.id === event.subject.id).date);
        this.initMilestoneDate.setHours(0, 0, 0, 0);
      })
      .on('end', (event: d3.D3DragEvent<any, any, any>) => {

        this.adjustMilestonePosition(event.subject);

        const milestoneDate: any = new Date(event.subject.date);
        const dragOffset: number = Math.floor((milestoneDate - this.initMilestoneDate) / (1000 * 60 * 60 * 24));

        this.onDragEndMilestone(dragOffset, event.subject.id);

      });

    // milestones
    const milestone = dataGroup.selectAll('g.milestoneEntry')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'milestoneEntry')
      .attr('id', (d) => 'milestoneEntry_' + d.id)
      .attr('transform', (d, i) => {
        const milestoneDate = new Date(d.date);
        milestoneDate.setHours(0, 0, 0, 0);
        return 'translate(' + (offset.left + this.xScale(milestoneDate)) + ','
          + (offset.top + this.elementHeightWithMargin * (i % 3) + this.elementHeight / 2) + ')';
      })
      .call(drag);

    milestone
      .append('path')
      .attr('class', 'milestone')
      .attr('transform', 'scale(1.5 1)')
      .attr('d', d3.symbol().type(d3.symbolDiamond))
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker());

    milestone
      .on('mouseover', (event, d) => {
        this.showTooltip(d, event.layerX, event.layerY);
      })
      .on('mouseout', () => {
        this.tooltip
          .transition()
          .duration(500)
          .style('opacity', 0)
          .transition()
          .delay(500)
          .style('display', 'none');
      });

    const maxLabelWidth = 40;

    // milestone labels
    milestone
      .append('text')
      .text(d => d.name)
      .attr('class', 'milestoneLabel')
      .attr('x', 0)
      .attr('y', 20)
      .style('fill', d3.rgb(this.elementColor).darker())
      .attr('text-anchor', 'middle')
      .call(this.wrapLabel, maxLabelWidth);
  }

  redraw(offset, animationDuration): void {
    // milestones
    const dataGroup = this.svg.select('g.data-group');

    dataGroup.selectAll('g.milestoneEntry')
      .transition()
      .ease(d3.easeCubic)
      .duration(animationDuration)
      .attr('transform', (d, i) => {
        const milestoneDate = new Date(d.date);
        milestoneDate.setHours(0, 0, 0, 0);
        return 'translate(' + (offset.left + this.xScale(milestoneDate)) + ','
        + (offset.top + this.elementHeightWithMargin * (i % 3) + this.elementHeight / 2) + ')';
      });
  }

  showTooltip(d, x, y): void {
    this.tooltip
      .style('top', (y + 15) + 'px')
      .style('left', (x) + 'px')
      .style('display', 'block')
      .attr('font-size', 11)
      .html(`${d.name}<br>`
        + `Fällig: ${new Date(d.date).toLocaleDateString('de-DE', this.dateOptions)}<br>`)
      .transition()
      .duration(500)
      .style('opacity', 1);
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

  getAreaHeight(): number {
    // for now the milestones are spread over 3 rows
    return Math.max(this.data.length, 3) * this.elementHeightWithMargin;
  }

  private adjustMilestonePosition(milestoneData): void {
    const dataGroup = this.svg.select('g.data-group');

    const milestone = dataGroup.select('#milestoneEntry_' + milestoneData.id);

    const milestoneDate = new Date(milestoneData.date);
    milestoneDate.setHours(0, 0, 0, 0);

    const xValueNew = this.xScale(milestoneDate);
    const yTransformValue = parseSvg(milestone.attr('transform')).translateY;

    milestone
      .transition()
      .ease(d3.easeCubic)
      .duration(this.animationDuration)
      .attr('transform', 'translate(' + xValueNew + ',' + yTransformValue + ')');
  }

}
