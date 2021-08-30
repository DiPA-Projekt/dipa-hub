import * as d3 from 'd3';
import { Timeline } from 'dipa-api-client';

import { IChartElement } from './IChartElement';

import { ScaleTime } from 'd3-scale';

interface SvgParse {
  translateX: number;
  translateY: number;
  rotate: number;
  skewX: number;
  scaleX: number;
  scaleY: number;
}

interface EventEntry {
  id: number;
  seriesId: number;
  eventType: string; // TYPE_APPT_SERIES, TYPE_SINGLE_APPOINTMENT, TYPE_RECURRING_EVENT
  title: string;
  dateTime: string;
  duration: number;
  status: string; // OPEN, DONE
  visibility: boolean;
}

export class EventsArea implements IChartElement {
  svg: d3.Selection<any, any, any, any>;
  tooltip: d3.Selection<any, any, any, any>;
  readonly xScale: ScaleTime<any, any>;
  data: EventEntry[];

  animationDuration: number;

  dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

  elementHeight = 20;
  elementMargin = 8;
  elementHeightWithMargin: number = this.elementHeight + 2 * this.elementMargin;

  elementColor = '#fa9937';

  initEventDate: Date;

  public onDragEndEvent?: (days: number, id: number) => void;
  public onSelectEvent?: (data: any) => void;

  modifiable = false;
  showMenu = false;
  selectedEventId: number;
  eventsAreaId: number;
  timelineData: Timeline;

  public constructor(
    svg: d3.Selection<any, any, any, any>,
    chartElement: HTMLElement,
    xScale: ScaleTime<any, any>,
    data: EventEntry[],
    modifiable: boolean,
    showMenu: boolean,
    eventsAreaId: number,
    timelineData: Timeline
  ) {
    this.svg = svg;
    this.xScale = xScale;
    this.data = data;
    this.modifiable = modifiable;
    this.showMenu = showMenu;
    this.eventsAreaId = eventsAreaId;
    this.timelineData = timelineData;
    this.tooltip = d3.select(chartElement).select('figure#chart .tooltip');
  }

  static intersectArray(r1: SVGTextElement, arr: SVGTextElement[]): boolean {
    for (const r2 of arr) {
      if (EventsArea.intersectRect(r1, r2)) {
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

  setData(data: EventEntry[]): void {
    this.data = data;
    const dataGroup = this.svg.select(`g#eventsArea${this.eventsAreaId}.event-data-group`);
    dataGroup.selectAll('g.eventEntry').data(
      d3.group(
        this.data.filter((d) => d.visibility === true),
        (d: EventEntry) => d.dateTime
      )
    );
  }

  public reset(offset: { [key: string]: number }): void {
    const dataGroup = this.svg.select(`g#eventsArea${this.eventsAreaId}.event-data-group`);
    dataGroup.selectAll('g.eventEntry').remove();
    this.draw(offset);
    this.redraw(offset, 0);

    this.updateEventStyle(this.selectedEventId);
  }

  public draw(offset: { [key: string]: number }): void {
    const dataGroup = this.svg.select(`g#eventsArea${this.eventsAreaId}.event-data-group`);

    // events
    const drawEvent = dataGroup
      .selectAll('g.eventEntry')
      .data(
        d3.group(
          this.data.filter((d) => d.visibility === true),
          (d: EventEntry) => d.dateTime
        )
      )
      .enter()
      .append('g')
      .attr('class', 'eventEntry')
      .attr('id', (d: [string, EventEntry[]]) => `eventEntry_${d[1][0].id}`)
      .attr('transform', (d: [string, EventEntry[]]) => {
        const eventDate = new Date(d[0]);
        eventDate.setHours(0, 0, 0, 0);
        return `translate(${offset.left + parseInt(this.xScale(eventDate), 10)},${
          offset.top + this.elementHeight / 2
        })`;
      });

    const eventIcon = drawEvent
      .append('path')
      .attr('class', 'event')
      .attr('transform', 'scale(1.4 1.4)')
      .attr('d', d3.symbol().type(d3.symbolCircle))
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker().formatHex());

    eventIcon
      .on('mouseover', (event: MouseEvent, d) => {
        this.showTooltip(d, event.clientX, event.clientY);
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(500).style('opacity', 0).transition().delay(500).style('display', 'none');
      });

    if (this.showMenu) {
      eventIcon.on('click', (event, d) => {
        if (d[1][0].id !== this.selectedEventId) {
          this.resetEventStyle();

          this.selectedEventId = d[1][0].id;

          this.updateEventStyle(d[1][0].id);
        }

        this.onSelectEvent(d);
      });
    }

    const maxLabelWidth = 30;

    // event labels
    drawEvent
      .append('text')
      .text((d) => (d[1].length === 1 ? `Termin` : `${d[1].length} Termine`))
      .attr('class', 'eventLabel')
      .attr('x', 0)
      .attr('y', this.elementHeight)
      .style('fill', d3.rgb(this.elementColor).darker().formatHex())
      .call(this.wrapLabel.bind(this), maxLabelWidth);

    setTimeout(() => {
      this.arrangeLabels();
    }, 0);
  }

  public redraw(offset: { [key: string]: number }, animationDuration: number): void {
    // events
    const dataGroup = this.svg.select(`g#eventsArea${this.eventsAreaId}.event-data-group`);

    dataGroup
      .selectAll('g.eventEntry')
      .transition()
      .ease(d3.easeCubic)
      .duration(animationDuration)
      .attr('transform', (d: [string, EventEntry[]]) => {
        const eventDate = new Date(d[0]);
        eventDate.setHours(0, 0, 0, 0);
        return `translate(${offset.left + parseInt(this.xScale(eventDate), 10)},${
          offset.top + this.elementHeight / 2
        })`;
      });
  }

  public arrangeLabels(): void {
    const dataGroup = this.svg.select(`g#eventsArea${this.eventsAreaId}.event-data-group`);

    const step = this.elementHeight / 2;
    const lastBBoxes = [];

    // @ts-ignore
    dataGroup.selectAll('g.eventEntry text.eventLabel')._groups[0].forEach((x: SVGTextElement) => {
      // reset y value of each event
      x.setAttribute('y', String(this.elementHeight));

      let showLine = false;

      while (EventsArea.intersectArray(x, lastBBoxes)) {
        const currentY = parseFloat(x.getAttribute('y'));

        dataGroup.select('#' + x.parentElement.id + ' text.eventLabel').attr('y', currentY + step);

        x.setAttribute('y', String(currentY + step));

        showLine = true;
      }

      dataGroup.select('#' + x.parentElement.id + ' line.labelLine').remove();

      if (showLine) {
        // draw line between event and label if they are drawn at a distance
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

  showTooltip(d: [string, EventEntry[]], x: number, y: number): void {
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

  public getAreaHeight(): number {
    // for now the events are spread over 3 rows
    return Math.max(this.data.length, 3) * this.elementHeightWithMargin;
  }

  public onCloseMenu(): void {
    this.resetEventStyle();
    this.selectedEventId = null;
  }

  public tooltipContent(data: [string, EventEntry[]]): any {
    const entryList = data[1];

    let tooltip = `Fällig: ${new Date(entryList[0].dateTime).toLocaleDateString('de-DE', this.dateOptions)}<br>`;

    entryList.forEach((entry) => {
      tooltip += `- ${entry.title}<br>`;
    });

    return tooltip;
  }

  private updateEventStyle(eventId: number): void {
    const dataGroup = this.svg.select(`g#eventsArea${this.eventsAreaId}.event-data-group`);

    dataGroup
      .select(`#eventEntry_${eventId}`)
      .select('path.event')
      .attr('transform', 'scale(1.5 1.5)')
      .style('stroke', d3.rgb('#2b41ff').darker().formatHex());

    dataGroup
      .select(`#eventEntry_${eventId}`)
      .select('text.eventLabel')
      .style('fill', d3.rgb('#2b41ff').darker().formatHex());
  }

  private resetEventStyle(): void {
    const dataGroup = this.svg.select(`g#eventsArea${this.eventsAreaId}.event-data-group`);

    if (this.selectedEventId !== null) {
      dataGroup
        .select(`#eventEntry_${this.selectedEventId}`)
        .select('path.event')
        .attr('transform', 'scale(1.4 1.4)')
        .style('fill', this.elementColor)
        .style('stroke', d3.rgb(this.elementColor).darker().formatHex());

      dataGroup
        .selectAll('g.eventEntry')
        .select('text.eventLabel')
        .style('fill', d3.rgb(this.elementColor).darker().formatHex());
    }
  }
}
