import * as d3 from 'd3';

export class Increments {

  svg;
  readonly xScale;
  data: any[];

  elementColor = '#62a9f9';

  height = 200;
  incrementsAreaId;

  constructor(svg: any, xScale: any, data: any, incrementsAreaId: any) {
    this.svg = svg;
    this.xScale = xScale;
    this.incrementsAreaId = incrementsAreaId;

    this.setData(data);
  }

  public onClickAddButton?: () => void;
  public onClickDeleteButton?: () => void;

  setData(data): void {

    this.data = data;

    const dataGroup = this.svg.select('g' + '#incrementsArea' + this.incrementsAreaId + '.increment-group');
    dataGroup.selectAll('g.incrementEntry')
      .data(this.data);
  }

  reset(offset): void {
    const dataGroup = this.svg.select('g' + '#incrementsArea' + this.incrementsAreaId + '.increment-group');
    dataGroup.selectAll('g.incrementEntry').remove();
    this.draw(offset);
    this.redraw(offset);
  }

  draw(offset): void {

    const dataGroup = this.svg.select('g' + '#incrementsArea' + this.incrementsAreaId + '.increment-group');;

    const incrementGroup = dataGroup.selectAll('g.incrementEntry')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'incrementEntry')
      .attr('id', (d) => 'incrementEntry_' + d.id)
      .attr('transform', d => {
        const incrementStartDate = new Date(d.start);
        incrementStartDate.setHours(0, 0, 0, 0);
        return 'translate(' + (offset.left + this.xScale(incrementStartDate)) + ','
          + offset.top + ')';
      });

    // increment background
    incrementGroup
      .append('rect')
      .attr('class', 'increment')
      .style('fill', d3.rgb(this.elementColor).brighter())
      .style('stroke', d3.rgb(this.elementColor).darker())
      .attr('x', 0)
      .attr('width', d => this.calculateBarWidth(d))
      .attr('y', 0)
      .attr('height', this.height);

    // increment header background
    incrementGroup
      .append('rect')
      .attr('class', 'incrementHeader')
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker())
      .attr('x', 0)
      .attr('width', d => this.calculateBarWidth(d))
      .attr('y', 0)
      .attr('height', 24);

    // increment label
    incrementGroup
      .append('text')
      .text(d => d.name)
      .attr('class', 'incrementName')
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');

    // increment action buttons
    const incrementActionsButton = incrementGroup
      .append('text')
      .attr('class', 'incrementActions')
      .attr('x', d => this.calculateBarWidth(d))
      .attr('y', 12)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central');

    // delete increment icon
    const deleteIcon = incrementActionsButton
      .filter((d, i, list) => i !== 0 && i === list.length - 1)
      .append('tspan')
      .attr('class', 'btn material-icons')
      .text('delete');

    deleteIcon.on('click', (event, d) => {
      this.onClickDeleteButton();
    });

    // add increment icon
    const addIcon = incrementActionsButton
      .filter((d, i) => i === 0)
      .append('tspan')
      .attr('class', 'btn material-icons')
      .text('add_circle');

    addIcon.on('click', (event, d) => {
      this.onClickAddButton();
    });
  }

  redraw(offset): void {

    const dataGroup = this.svg.select('g' + '#incrementsArea' + this.incrementsAreaId + '.increment-group');;

    // increment entry
    const incrementGroup = dataGroup.selectAll('g.incrementEntry')
      .attr('transform', d => {
        const incrementStartDate = new Date(d.start);
        incrementStartDate.setHours(0, 0, 0, 0);
        return 'translate(' + (offset.left + this.xScale(incrementStartDate)) + ','
          + offset.top + ')';
      });

    incrementGroup.select('rect.increment')
      .attr('width', d => this.calculateBarWidth(d));

    incrementGroup.select('rect.incrementHeader')
      .attr('width', d => this.calculateBarWidth(d));

    incrementGroup.select('text.incrementActions')
      .attr('x', d => this.calculateBarWidth(d));

    // increment labels
    incrementGroup.select('text.incrementName')
      .attr('x', d =>  this.calculateBarWidth(d) / 2);
  }

  private calculateBarWidth(increment: any): number {
    return this.xScale(new Date(increment.end)) - this.xScale(new Date(increment.start));
  }
}
