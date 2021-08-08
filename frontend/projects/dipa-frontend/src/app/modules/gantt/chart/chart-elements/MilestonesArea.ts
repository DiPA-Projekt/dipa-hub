import * as d3 from 'd3';
import { parseSvg } from 'd3-interpolate/src/transform/parse';
import { Timeline, Milestone } from 'dipa-api-client';

import { IChartElement } from './IChartElement';

import ProjectTypeEnum = Timeline.ProjectTypeEnum;
import { ScaleTime } from 'd3-scale';

interface SvgParse {
  translateX: number;
  translateY: number;
  rotate: number;
  skewX: number;
  scaleX: number;
  scaleY: number;
}

export class MilestonesArea implements IChartElement {
  svg: d3.Selection<any, any, any, any>;
  tooltip: d3.Selection<any, any, any, any>;
  readonly xScale: ScaleTime<any, any>;
  data: Milestone[];

  animationDuration: number;

  dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

  elementHeight = 20;
  elementMargin = 8;
  elementHeightWithMargin: number = this.elementHeight + 2 * this.elementMargin;

  elementColor = '#62a9f9';

  initMilestoneDate: Date;

  public onDragEndMilestone?: (days: number, id: number) => void;
  public onSelectMilestone?: (data: any) => void;

  modifiable = false;
  showMenu = false;
  selectedMilestoneId: number;
  milestonesAreaId: number;
  timelineData: Timeline;

  constructor(
    svg: d3.Selection<any, any, any, any>,
    chartElement: HTMLElement,
    xScale: ScaleTime<any, any>,
    data: Milestone[],
    modifiable: boolean,
    showMenu: boolean,
    milestonesAreaId: number,
    timelineData: Timeline
  ) {
    this.svg = svg;
    this.xScale = xScale;
    this.data = data;
    this.modifiable = modifiable;
    this.showMenu = showMenu;
    this.milestonesAreaId = milestonesAreaId;
    this.timelineData = timelineData;
    this.tooltip = d3.select(chartElement).select('figure#chart .tooltip');
  }

  static intersectArray(r1: SVGTextElement, arr: SVGTextElement[]): boolean {
    for (const r2 of arr) {
      if (MilestonesArea.intersectRect(r1, r2)) {
        return true;
      }
    }
    return false;
  }

  static intersectRect(r1: SVGTextElement, r2: SVGTextElement): boolean {
    const r1bb = r1.getBoundingClientRect();
    const r2bb = r2.getBoundingClientRect();

    return !(r2bb.left > r1bb.right || r2bb.right < r1bb.left || r2bb.top > r1bb.bottom || r2bb.bottom < r1bb.top);
  }

  setData(data: Milestone[]): void {
    this.data = data;
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);
    dataGroup.selectAll('g.milestoneEntry').data(this.data);
  }

  reset(offset: { [key: string]: number }): void {
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);
    dataGroup.selectAll('g.milestoneEntry').remove();
    this.draw(offset);
    this.redraw(offset, 0);

    this.updateMilestoneStyle(this.selectedMilestoneId);
  }

  draw(offset: { [key: string]: number }): void {
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);

    const drag = d3
      .drag()
      .on('drag', (event: d3.D3DragEvent<any, any, Milestone>) => {
        // milestones
        const eventMilestone = dataGroup.select(`#milestoneEntry_${event.subject.id}`);

        const transform = eventMilestone.attr('transform');
        const transformSVGElement = parseSvg(transform) as SvgParse;

        const xTransformValue = transformSVGElement.translateX;
        const yTransformValue = transformSVGElement.translateY;

        const xValueNew = xTransformValue + event.dx;

        eventMilestone.attr('transform', `translate(${xValueNew},${yTransformValue})`);

        event.subject.date = this.xScale.invert(xValueNew).toISOString();

        this.showTooltip(
          event.subject,
          (event.sourceEvent as MouseEvent).clientX,
          (event.sourceEvent as MouseEvent).clientY
        );
      })
      .on('start', (event: d3.D3DragEvent<any, any, Milestone>) => {
        this.initMilestoneDate = new Date(this.data.find((d: Milestone) => d.id === event.subject.id).date);
        this.initMilestoneDate.setHours(0, 0, 0, 0);
      })
      .on('end', (event: d3.D3DragEvent<any, any, Milestone>) => {
        this.adjustMilestonePosition(event.subject);

        const milestoneDate = new Date(event.subject.date);
        const dragOffset: number = Math.floor(
          (milestoneDate.valueOf() - this.initMilestoneDate.valueOf()) / (1000 * 60 * 60 * 24)
        );

        this.onDragEndMilestone(dragOffset, event.subject.id);
      });

    // milestones
    const milestone = dataGroup
      .selectAll('g.milestoneEntry')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'milestoneEntry')
      .attr('id', (d: Milestone) => `milestoneEntry_${d.id}`)
      .attr('transform', (d: Milestone) => {
        const milestoneDate = new Date(d.date);
        milestoneDate.setHours(0, 0, 0, 0);
        return `translate(${offset.left + parseInt(this.xScale(milestoneDate), 10)},${
          offset.top + this.elementHeight / 2
        })`;
      });

    const milestoneIcon = milestone
      .append('path')
      .attr('class', 'milestone')
      .attr('transform', 'scale(1.75 1.2)')
      .attr('d', d3.symbol().type(d3.symbolDiamond))
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker().formatHex());

    milestoneIcon
      .on('mouseover', (event: MouseEvent, d) => {
        this.showTooltip(d, event.clientX, event.clientY);
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(500).style('opacity', 0).transition().delay(500).style('display', 'none');
      });

    if (this.modifiable) {
      milestone.call(drag);
    }

    if (this.showMenu) {
      milestoneIcon.on('click', (event, d) => {
        if (d.id !== this.selectedMilestoneId) {
          this.resetMilestoneStyle();

          this.selectedMilestoneId = d.id;

          this.updateMilestoneStyle(d.id);
        }

        this.onSelectMilestone(d);
      });
    }

    // milestone status icon
    milestone
      .append('text')
      .text('done')
      .attr('class', 'material-icons milestoneStatusIcon')
      .attr('x', 0)
      .attr('y', 6)
      .style('opacity', (d: { status: Milestone.StatusEnum }) => (d.status === Milestone.StatusEnum.Open ? 0 : 1));

    const maxLabelWidth = 30;

    // milestone labels
    milestone
      .append('text')
      .text((d) => d.name)
      .attr('class', 'milestoneLabel')
      .attr('x', 0)
      .attr('y', this.elementHeight)
      .style('fill', d3.rgb(this.elementColor).darker().formatHex())
      .call(this.wrapLabel.bind(this), maxLabelWidth);

    setTimeout(() => {
      this.arrangeLabels();
    }, 0);
  }

  redraw(offset: { [key: string]: number }, animationDuration: number): void {
    // milestones
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);

    dataGroup
      .selectAll('g.milestoneEntry')
      .transition()
      .ease(d3.easeCubic)
      .duration(animationDuration)
      .attr('transform', (d: Milestone) => {
        const milestoneDate = new Date(d.date);
        milestoneDate.setHours(0, 0, 0, 0);
        return `translate(${offset.left + parseInt(this.xScale(milestoneDate), 10)},${
          offset.top + this.elementHeight / 2
        })`;
      });

    // update tooltip
    dataGroup
      .selectAll('g.milestoneEntry')
      .select('path.milestone')
      .on('mouseover', (event: MouseEvent, d) => {
        this.showTooltip(d, event.clientX, event.clientY);
      });
  }

  public arrangeLabels(): void {
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);

    const step = this.elementHeight / 2;
    const lastBBoxes = [];

    // @ts-ignore
    dataGroup.selectAll('g.milestoneEntry text.milestoneLabel')._groups[0].forEach((x: SVGTextElement) => {
      // reset y value of each milestone
      x.setAttribute('y', String(this.elementHeight));

      let showLine = false;

      while (MilestonesArea.intersectArray(x, lastBBoxes)) {
        const currentY = parseFloat(x.getAttribute('y'));

        dataGroup.select('#' + x.parentElement.id + ' text.milestoneLabel').attr('y', currentY + step);

        x.setAttribute('y', String(currentY + step));

        showLine = true;
      }

      dataGroup.select('#' + x.parentElement.id + ' line.labelLine').remove();

      if (showLine) {
        // draw line between milestone and label if they are drawn at a distance
        dataGroup
          .select('#' + x.parentElement.id)
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

  showTooltip(d: Milestone, x: number, y: number): void {
    this.tooltip
      .style('top', `${y + 20}px`)
      .style('left', `${x}px`)
      .style('display', 'block')
      .attr('font-size', 11)
      .html(this.tooltipContent(d))
      .transition()
      .duration(500)
      .style('opacity', 1);
  }

  wrapLabel(svgText: d3.Selection<SVGGElement, {}, any, any>, maxWidth: number): void {
    svgText.each(function (): void {
      const text = d3.select(this);
      const words = text.text().split(/\s+/);

      let line = [];
      const dy = text.attr('dy');

      let tspan = text.text(null).append('tspan').attr('x', 0).attr('dy', dy);

      for (const word of words) {
        line.push(word);

        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];

          tspan = text.append('tspan').attr('x', 0).attr('dy', '10').text(word);
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

  public onCloseMenu(): void {
    this.resetMilestoneStyle();
    this.selectedMilestoneId = null;
  }

  public tooltipContent(data: Milestone): any {
    let tooltip =
      `${data.name}<br>` + `Fällig: ${new Date(data.date).toLocaleDateString('de-DE', this.dateOptions)}<br>`;
    // alle Meilensteine der agilen Softwareentwicklung im ITZBund
    if (
      this.timelineData.projectApproachId === 2 &&
      data.name !== 'Projekteinrichtung' &&
      data.name !== 'Projektabschluss'
    ) {
      let projectType = '';

      if (this.timelineData.projectType === ProjectTypeEnum.InternesProjekt) {
        projectType = 'Internes Projekt (Agile SWE)';
      } else if (this.timelineData.projectType === ProjectTypeEnum.AnProjekt) {
        projectType = 'AN-Projekt SWE';
      }

      tooltip += `<br>zugeordnete Entscheidungspunkte<br>
      - V-Modell XT Version: ITZBund 2.3<br>
      - Projekttyp: ${projectType}<br>
      - Entwicklungsstrategie: agil<br><br>
      * Sprint gestartet<br>
      * Sprint abgeschlossen<br>
      * Lieferung durchgeführt<br>
      * Abnahme durchgeführt<br>
      * Systembetrieb freigegeben<br>`;
    }

    return tooltip;
  }

  private adjustMilestonePosition(milestoneData: Milestone): void {
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);

    const milestone = dataGroup.select(`#milestoneEntry_${milestoneData.id}`);

    const milestoneDate = new Date(milestoneData.date);
    milestoneDate.setHours(0, 0, 0, 0);

    const xValueNew = parseInt(this.xScale(milestoneDate), 10);

    const transform = milestone.attr('transform');
    const transformSVGElement = parseSvg(transform) as SvgParse;

    const yTransformValue = transformSVGElement.translateY;

    milestone
      .transition()
      .ease(d3.easeCubic)
      .duration(this.animationDuration)
      .attr('transform', `translate(${xValueNew},${yTransformValue})`);
  }

  private updateMilestoneStyle(milestoneId: number): void {
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);

    dataGroup
      .select(`#milestoneEntry_${milestoneId}`)
      .select('path.milestone')
      .attr('transform', 'scale(1.85 1.25)')
      .style('stroke', d3.rgb('#2b41ff').darker().formatHex());

    dataGroup
      .select(`#milestoneEntry_${milestoneId}`)
      .select('text.milestoneLabel')
      .style('fill', d3.rgb('#2b41ff').darker().formatHex());
  }

  private resetMilestoneStyle(): void {
    const dataGroup = this.svg.select(`g#milestonesArea${this.milestonesAreaId}.data-group`);

    if (this.selectedMilestoneId !== null) {
      dataGroup
        .select(`#milestoneEntry_${this.selectedMilestoneId}`)
        .select('path.milestone')
        .attr('transform', 'scale(1.75 1.2)')
        .style('fill', this.elementColor)
        .style('stroke', d3.rgb(this.elementColor).darker().formatHex());

      dataGroup
        .selectAll('g.milestoneEntry')
        .select('text.milestoneLabel')
        .style('fill', d3.rgb(this.elementColor).darker().formatHex());
    }
  }
}
