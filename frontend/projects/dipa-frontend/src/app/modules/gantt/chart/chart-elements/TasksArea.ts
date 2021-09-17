import * as d3 from 'd3';
import { parseSvg } from 'd3-interpolate/src/transform/parse';
import { IChartElement } from './IChartElement';
import { ScaleTime } from 'd3-scale';
import { Task } from 'dipa-api-client';
import Utils from '../../../../shared/utils';

interface SvgParse {
  translateX: number;
  translateY: number;
  rotate: number;
  skewX: number;
  scaleX: number;
  scaleY: number;
}

export class TasksArea implements IChartElement {
  svg: d3.Selection<any, any, any, any>;
  tooltip: d3.Selection<any, any, any, any>;
  readonly xScale: ScaleTime<any, any>;
  data: Task[];

  animationDuration: number;

  elementHeight = 20;
  elementMargin = 8;
  elementHeightWithMargin = this.elementHeight + 2 * this.elementMargin;

  elementColor = '#62a9f9';

  dragDxStack = 0;
  dragBarWidth = 5;

  constructor(svg: d3.Selection<any, any, any, any>, xScale: ScaleTime<any, any>, data: Task[]) {
    this.svg = svg;
    this.xScale = xScale;
    this.data = data;

    this.tooltip = d3.select('figure#chart .tooltip');
  }

  setData(data: Task[]): void {
    this.data = data;

    const dataGroup = this.svg.select('g.data-group');
    dataGroup.selectAll('g.taskEntry').data(this.data);
  }

  reset(offset: { [key: string]: number }): void {
    const dataGroup = this.svg.select('g.data-group');
    dataGroup.selectAll('g.taskEntry').remove();
    this.draw(offset);
    this.redraw(offset);
  }

  draw(offset: { [key: string]: number }): void {
    const dataGroup = this.svg.select('g.data-group');

    const drag = d3.drag().on('drag', (event: d3.D3DragEvent<any, any, Task>) => {
      // tasks
      const eventTask = dataGroup.select(`#taskEntry_${event.subject.id}`);

      const transform = eventTask.attr('transform');
      const transformSVGElement = parseSvg(transform) as SvgParse;

      const xTransformValue = transformSVGElement.translateX;
      const yTransformValue = transformSVGElement.translateY;

      const xValueStartNew = xTransformValue + event.dx;
      const xValueEndNew = xValueStartNew + this.calculateBarWidth(event.subject);

      eventTask.attr('transform', () => `translate(${xValueStartNew},${yTransformValue})`);

      event.subject.start = this.xScale.invert(xValueStartNew).toISOString();
      event.subject.end = this.xScale.invert(xValueEndNew).toISOString();

      this.refreshLabelPosition(eventTask);

      this.showTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
    });

    const dragRight = d3
      .drag()
      .on('drag', (event: d3.D3DragEvent<any, any, Task>) => {
        let dragDx = event.dx;

        // task
        const eventTask = dataGroup.select(`#taskEntry_${event.subject.id}`);

        const width = eventTask.select('rect.task').attr('width');
        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

        // do not allow negative bar width and remember dx values on a stack
        const widthNew = +width + dragDx + this.dragDxStack;

        if (widthNew <= 0) {
          this.dragDxStack += dragDx;
          return;
        } else if (this.dragDxStack < 0) {
          if (this.dragDxStack + dragDx > 0) {
            dragDx += this.dragDxStack;
            this.dragDxStack = 0;
          } else {
            this.dragDxStack += dragDx;
            return;
          }
        }

        eventTask.select('rect.task').attr('width', widthNew);

        event.subject.end = this.xScale.invert(xTransformValue + widthNew).toISOString();

        // update right drag bar handle position
        const xValueDragBarRight = eventTask.select('rect.dragBarRight').attr('x');
        const xValueDragBarRightNew = +xValueDragBarRight + dragDx;
        eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);

        this.refreshLabelPosition(eventTask);

        this.showTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
      })
      .on('end', (event: d3.D3DragEvent<any, any, Task>) => {
        this.dragDxStack = 0;
      });

    const dragLeft = d3
      .drag()
      .on('drag', (event: d3.D3DragEvent<any, any, Task>) => {
        let dragDx = event.dx;

        // task
        const eventTask = dataGroup.select(`#taskEntry_${event.subject.id}`);

        const oldX = parseFloat(eventTask.select('rect.task').attr('x'));

        const width = eventTask.select('rect.task').attr('width');

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

        const xValueNew = xTransformValue + event.dx;

        // do not allow negative bar width and remember dx values on a stack
        const widthNew = +width - dragDx - this.dragDxStack;

        if (widthNew <= 0) {
          this.dragDxStack += dragDx;
          return;
        } else if (this.dragDxStack > 0) {
          if (this.dragDxStack + dragDx < 0) {
            dragDx += this.dragDxStack;
            this.dragDxStack = 0;
          } else {
            this.dragDxStack += dragDx;
            return;
          }
        }

        eventTask.select('rect.task').attr('x', +oldX + dragDx);

        event.subject.start = this.xScale.invert(xValueNew + oldX).toISOString();

        eventTask.select('rect.task').attr('width', widthNew);

        ////////

        // update left drag bar handle position
        const xValueDragBarLeft = eventTask.select('rect.dragBarLeft').attr('x');
        const xValueDragBarLeftNew = +xValueDragBarLeft + dragDx;
        eventTask.select('rect.dragBarLeft').attr('x', xValueDragBarLeftNew);

        this.refreshLabelPosition(eventTask);

        this.showTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
      })
      .on('end', (event: d3.D3DragEvent<any, any, any>) => {
        this.dragDxStack = 0;

        // task
        const eventTask = dataGroup.select(`#taskEntry_${event.subject.id}`);

        const oldX = parseFloat(eventTask.select('rect.task').attr('x'));

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
        const yTransformValue = parseSvg(eventTask.attr('transform')).translateY;

        const xValueNew = xTransformValue + oldX;

        eventTask.attr('transform', `translate(${xValueNew},${yTransformValue})`);

        eventTask.select('rect.task').attr('x', 0);

        /////////
        const xValueDragBarLeftNew = -(this.dragBarWidth / 2) - 7;
        eventTask.select('rect.dragBarLeft').attr('x', xValueDragBarLeftNew);

        /////////
        const taskWidth = eventTask.select('rect.task').attr('width');
        const xValueDragBarRightNew = +taskWidth + 5;
        eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);

        this.refreshLabelPosition(eventTask);
      });

    // tasks
    const taskGroup = dataGroup
      .selectAll('g.taskEntry')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'taskEntry')
      .attr('id', (d) => `taskEntry_${d.id}`)
      .attr('transform', (d, i) => {
        const taskStartDate = new Date(d.start);
        taskStartDate.setHours(0, 0, 0, 0);
        return `translate(${offset.left + parseInt(this.xScale(taskStartDate), 10)},${
          offset.top + this.elementHeightWithMargin * i + this.elementHeight / 2
        })`;
      })
      .call(drag);

    taskGroup
      .append('rect')
      .attr('class', 'task')
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker().formatHex())
      .attr('x', 0)
      .attr('width', (d) => this.calculateBarWidth(d))
      .attr('y', 0)
      .attr('height', this.elementHeight);

    taskGroup
      .append('rect')
      .attr('x', -(this.dragBarWidth / 2) - 7)
      .attr('y', 0)
      .attr('height', this.elementHeight)
      .attr('class', 'dragBarLeft')
      .attr('width', this.dragBarWidth)
      .attr('fill', this.elementColor)
      .attr('stroke', d3.rgb(this.elementColor).darker().formatHex())
      .call(dragLeft);

    taskGroup
      .append('rect')
      .attr('x', (d) => this.calculateBarWidth(d) + 5)
      .attr('y', 0)
      .attr('class', 'dragBarRight')
      .attr('height', this.elementHeight)
      .attr('width', this.dragBarWidth)
      .attr('fill', this.elementColor)
      .attr('stroke', d3.rgb(this.elementColor).darker().formatHex())
      .call(dragRight);

    taskGroup
      .on('mouseover', (event, d) => {
        const eventTask = dataGroup.select(`#taskEntry_${d.id}`);
        eventTask.select('rect.dragBarLeft').transition().duration(500).style('opacity', 1);

        eventTask.select('rect.dragBarRight').transition().duration(500).style('opacity', 1);

        this.showTooltip(d, event.clientX, event.clientY);
      })
      .on('mouseout', (event, d) => {
        const eventTask = dataGroup.select(`#taskEntry_${d.id}`);
        eventTask.select('rect.dragBarLeft').transition().duration(500).style('opacity', 0);

        eventTask.select('rect.dragBarRight').transition().duration(500).style('opacity', 0);

        this.tooltip.transition().duration(500).style('opacity', 0).transition().delay(500).style('display', 'none');
      });

    // task labels
    taskGroup
      .append('text')
      .text((d) => d.name)
      .attr('class', 'taskLabel')
      .attr('x', (d) => {
        const eventTask = dataGroup.select(`#taskEntry_${d.id}`);

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

        const xValue = parseFloat(eventTask.select('rect.task').attr('x'));
        const xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;

        return this.calculateTaskLabelPosition(d) + xValueToAdd;
      })
      .attr('y', (this.elementHeight + this.elementMargin) / 2)
      .attr('text-height', this.elementHeight);
  }

  redraw(offset: { [key: string]: number }): void {
    // tasks
    const dataGroup = this.svg.select('g.data-group');

    const taskGroup = dataGroup.selectAll('g.taskEntry').attr('transform', (d: Task, i: number) => {
      const taskStartDate = new Date(d.start);
      taskStartDate.setHours(0, 0, 0, 0);
      return `translate(${offset.left + parseInt(this.xScale(taskStartDate), 10)},${
        offset.top + this.elementHeightWithMargin * i + this.elementHeight / 2
      })`;
    });

    taskGroup.selectAll('rect.task').attr('width', (d: Task) => this.calculateBarWidth(d));

    taskGroup.selectAll('rect.dragBarRight').attr('x', (d: Task) => this.calculateBarWidth(d) + 5);

    // task labels
    taskGroup.selectAll('text.taskLabel').attr('x', (d: Task) => {
      let xValueToAdd = 0;

      if (this.isVisible(d)) {
        const eventTask = dataGroup.select(`#taskEntry_${d.id}`);

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
        const xValue = parseFloat(eventTask.select('rect.task').attr('x'));

        xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;
      }

      return this.calculateTaskLabelPosition(d) + xValueToAdd;
    });
  }

  refreshLabelPosition(eventTask: d3.Selection<any, any, any, any>): void {
    const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

    const xValue = parseFloat(eventTask.select('rect.task').attr('x'));
    const xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;

    eventTask
      .select('text.taskLabel')
      .attr('x', (d) => this.calculateTaskLabelPosition(d) + xValueToAdd)
      .attr('y', (this.elementHeight + this.elementMargin) / 2);
  }

  isVisible(d: Task): boolean {
    return !(
      this.xScale(new Date(d.end)) < this.xScale.range()[0] || this.xScale(new Date(d.start)) > this.xScale.range()[1]
    );
  }

  showTooltip(d: Task, x: number, y: number): void {
    this.tooltip
      .style('top', `${y + 20}px`)
      .style('left', `${x}px`)
      .style('display', 'block')
      .html(
        `${d.name}<br>` +
          `${Utils.getGermanFormattedDateString(d.start)}` +
          ` - ${Utils.getGermanFormattedDateString(d.end)}<br>`
      )
      .transition()
      .style('display', 'block')
      .duration(500)
      .style('opacity', 1);
  }

  getAreaHeight(): number {
    return this.data.length * this.elementHeightWithMargin;
  }

  private calculateBarWidth(task: Task): number {
    return this.xScale(new Date(task.end)) - this.xScale(new Date(task.start));
  }

  // get label position of a task depending on chart range so it is displayed centered on the visible part of the bar
  private calculateTaskLabelPosition(d: Task): number {
    const xScaleStart = this.xScale(new Date(d.start));
    const xScaleEnd = this.xScale(new Date(d.end));

    const startPosition = Math.max(xScaleStart, this.xScale.range()[0]);
    const endPosition = Math.min(xScaleEnd, this.xScale.range()[1]);

    return (endPosition - startPosition) / 2;
  }
}
