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

  doneColor = '#cc0000';
  openColor = '#27b500';

  initMilestoneDate;

  public onDragEndMilestone?: (days: number, id: number) => void;
  public onClickMilestone?: (data: any) => void;
  // public onCloseMenu?: () => void;

  modifiable = false;
  showMenu = false;
  clickedMilestoneId: number;

  constructor(svg: any, xScale: any, data: any[],  modifiable: boolean, showMenu: boolean) {
    this.svg = svg;
    this.xScale = xScale;
    this.data = data;
    this.modifiable = modifiable;
    this.showMenu = showMenu;

    this.tooltip = d3.select('figure#chart .tooltip');
  }

  static intersectArray(r1, arr): boolean {
    for (const r2 of arr) {
      if (MilestonesArea.intersectRect(r1, r2)) {
        return true;
      }
    }
    return false;
  }

  static intersectRect(r1, r2): boolean {
    const r1bb = r1.getBoundingClientRect();
    const r2bb = r2.getBoundingClientRect();

    return !(r2bb.left > r1bb.right ||
      r2bb.right < r1bb.left ||
      r2bb.top > r1bb.bottom ||
      r2bb.bottom < r1bb.top);
  }

  setData(data): void {
    this.data = data;

    const dataGroup = this.svg.select('g.data-group');
    dataGroup.selectAll('g.milestoneEntry')
      .data(this.data);
  }

  reset(offset): void {
    const dataGroup = this.svg.select('g.data-group');
    dataGroup.selectAll('g.milestoneEntry').remove();
    this.draw(offset);
    this.redraw(offset, 0);

    this.updateMilestoneStyle(this.clickedMilestoneId);
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

        this.showTooltip(event.subject, event.sourceEvent.clientX, event.sourceEvent.clientY);
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
      .attr('transform', d => {
        const milestoneDate = new Date(d.date);
        milestoneDate.setHours(0, 0, 0, 0);
        return 'translate(' + (offset.left + this.xScale(milestoneDate)) + ','
          + (offset.top + this.elementHeight / 2) + ')';
      });

    const milestoneIcon = milestone
      .append('path')
      .attr('class', 'milestone')
      .attr('transform', 'scale(1.5 1)')
      .attr('d', d3.symbol().type(d3.symbolDiamond))
      .style('fill', d => {
        return d.status === 'offen' ? this.openColor : this.doneColor;
      })
      .style('stroke', d => this.changeStatusColor(d));


    milestoneIcon
      .on('mouseover', (event, d) => {
        this.showTooltip(d, event.clientX, event.clientY);
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

    if (this.modifiable) {
      milestone.call(drag);
    }

    if (this.showMenu) {

      milestoneIcon.on('click', (event, d) => {
        this.onClickMilestone(d);

        this.clickedMilestoneId = d.id;

        this.resetMilestoneStyle();

        this.updateMilestoneStyle(d.id);

      });
      // this.onCloseMenu();
    }

    const maxLabelWidth = 30;

    // milestone labels
    milestone
      .append('text')
      .text(d => d.name)
      .attr('class', 'milestoneLabel')
      .attr('x', 0)
      .attr('y', this.elementHeight)
      .style('fill',  d => this.changeStatusColor(d))
      .style('text-decoration', d => {
        return d.status === 'offen' ? '' : 'line-through';
      })
      .attr('aria-label', d => `Der Meilenstein ${d.name} ist ${d.status}`)
      .call(this.wrapLabel, maxLabelWidth);

    this.arrangeLabels();
  }

  redraw(offset, animationDuration): void {
    // milestones
    const dataGroup = this.svg.select('g.data-group');

    dataGroup.selectAll('g.milestoneEntry')
      .transition()
      .ease(d3.easeCubic)
      .duration(animationDuration)
      .attr('transform', d => {
        const milestoneDate = new Date(d.date);
        milestoneDate.setHours(0, 0, 0, 0);
        return 'translate(' + (offset.left + this.xScale(milestoneDate)) + ','
        + (offset.top + this.elementHeight / 2) + ')';
      });
  }

  public arrangeLabels(): void {
    const dataGroup = this.svg.select('g.data-group');

    const step = this.elementHeight / 2;
    const lastBBoxes = [];

    dataGroup.selectAll('g.milestoneEntry text.milestoneLabel')._groups[0].forEach(x => {
      // reset y value of each milestone
      x.setAttribute('y', this.elementHeight);

      let showLine = false;

      while (MilestonesArea.intersectArray(x, lastBBoxes)) {
        const currentY = parseFloat(x.getAttribute('y'));

        dataGroup.select('#' + x.parentElement.id + ' text')
          .attr('y', currentY + step);

        x.setAttribute('y', currentY + step);

        showLine = true;
      }

      dataGroup.select('#' + x.parentElement.id + ' line.labelLine').remove();

      if (showLine) {
        // draw line between milestone and label if they are drawn at a distance
        dataGroup.select('#' + x.parentElement.id)
          .append('line')
          .attr('class', 'labelLine')
          .attr('x1', x.getAttribute('x'))
          .attr('x2', x.getAttribute('x'))
          .attr('y1', 15)
          .attr('y2', parseFloat(x.getAttribute('y')) - 15);
      }
      lastBBoxes.push(x);
    });
  }

  showTooltip(d, x, y): void {
    this.tooltip
      .style('top', (y + 20) + 'px')
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
      const dy = text.attr('dy');

      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('dy', dy);

      for (const word of words) {

        line.push(word);

        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];

          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('dy', '10')
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

  private updateMilestoneStyle(milestoneId): void {
    const dataGroup = this.svg.select('g.data-group');

    dataGroup
    .select('#milestoneEntry_' + milestoneId)
    .select('path')
    .attr('transform', 'scale(1.8 1.2)')
    .style('fill', d => this.changeStatusColor(d))
    .style('stroke', d => this.changeStatusColor(d));

    dataGroup
    .select('#milestoneEntry_' + milestoneId)
    .select('text')
    .style('fill', d => this.changeStatusColor(d));

  }

  private resetMilestoneStyle(): void {
    const dataGroup = this.svg.select('g.data-group');

    dataGroup
    .selectAll('g.milestoneEntry')
    .select('path')
    .attr('transform', 'scale(1.5 1)')
    .style('fill', d => {
      return d.status === 'offen' ? this.openColor : this.doneColor;
    })
    .style('stroke', d => this.changeStatusColor(d));

    dataGroup
    .selectAll('g.milestoneEntry')
    .select('text')
    .style('fill', d => this.changeStatusColor(d));
  }

  private changeStatusColor(data): any {
    return data.status === 'offen' ? d3.rgb(this.openColor).darker() : d3.rgb(this.doneColor).darker();
  }

  public onCloseMenu(): void {
    this.clickedMilestoneId = null;
    this.resetMilestoneStyle();
  }

}
