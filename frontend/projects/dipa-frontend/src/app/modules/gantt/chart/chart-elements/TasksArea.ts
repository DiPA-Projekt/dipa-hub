import * as d3 from 'd3';
import {parseSvg} from 'd3-interpolate/src/transform/parse';
import {IChartElement} from './IChartElement';

export class TasksArea implements IChartElement{

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

  dragDxStack = 0;
  dragBarWidth = 5;

  constructor(svg: any, xScale: any, data: any[]) {
    this.svg = svg;
    this.xScale = xScale;
    this.data = data;

    this.tooltip = d3.select('figure#chart .tooltip');
  }

  draw(offset): void {

    const dataGroup = this.svg.select('g.data-group');

    const drag = d3.drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

        // tasks
        const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
        const yTransformValue = parseSvg(eventTask.attr('transform')).translateY;

        const xValueStartNew = (xTransformValue + event.dx);
        const xValueEndNew = xValueStartNew + this.calculateBarWidth(event.subject);

        eventTask.attr('transform', () => 'translate(' + xValueStartNew + ',' + yTransformValue + ')');

        event.subject.start = this.xScale.invert(xValueStartNew);
        event.subject.end = this.xScale.invert(xValueEndNew);

        this.refreshLabelPosition(eventTask);

        this.showTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
      });

    const dragRight = d3.drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

        let dragDx = event.dx;

        // task
        const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

        const width = eventTask.select('rect.task').attr('width');
        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

        // do not allow negative bar width and remember dx values on a stack
        const widthNew = (+width + dragDx + this.dragDxStack);

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

        event.subject.end = this.xScale.invert(xTransformValue + widthNew);

        // update right drag bar handle position
        const xValueDragBarRight = eventTask.select('rect.dragBarRight').attr('x');
        const xValueDragBarRightNew = (+xValueDragBarRight + dragDx);
        eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);

        this.refreshLabelPosition(eventTask);

        this.showTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
      })
      .on('end', (event: d3.D3DragEvent<any, any, any>) => {
        this.dragDxStack = 0;
      });

    const dragLeft = d3.drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

        let dragDx = event.dx;

        // task
        const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

        const oldX = parseFloat(eventTask.select('rect.task').attr('x'));

        const width = eventTask.select('rect.task').attr('width');

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

        const xValueNew = (xTransformValue + event.dx);

        // do not allow negative bar width and remember dx values on a stack
        const widthNew = (+width - dragDx - this.dragDxStack);

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

        if (widthNew <= 0) {
          return;
        }

        eventTask.select('rect.task').attr('x', +oldX + dragDx);

        event.subject.start = this.xScale.invert(xValueNew + oldX);

        eventTask.select('rect.task').attr('width', widthNew);

        ////////

        // update left drag bar handle position
        const xValueDragBarLeft = eventTask.select('rect.dragBarLeft').attr('x');
        const xValueDragBarLeftNew = (+xValueDragBarLeft + dragDx);
        eventTask.select('rect.dragBarLeft').attr('x', xValueDragBarLeftNew);

        this.refreshLabelPosition(eventTask);

        this.showTooltip(event.subject, event.sourceEvent.layerX, event.sourceEvent.layerY);
      })
      .on('end', (event: d3.D3DragEvent<any, any, any>) => {

        this.dragDxStack = 0;

        // task
        const eventTask = dataGroup.select('#taskEntry_' + event.subject.id);

        const oldX = parseFloat(eventTask.select('rect.task').attr('x'));

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
        const yTransformValue = parseSvg(eventTask.attr('transform')).translateY;

        const xValueNew = (xTransformValue + oldX);

        eventTask.attr('transform', 'translate(' + xValueNew + ',' + yTransformValue + ')');

        eventTask.select('rect.task').attr('x', 0);

        /////////
        const xValueDragBarLeftNew = (- (this.dragBarWidth / 2) - 7);
        eventTask.select('rect.dragBarLeft').attr('x', xValueDragBarLeftNew);

        /////////
        const taskWidth = eventTask.select('rect.task').attr('width');
        const xValueDragBarRightNew = (+taskWidth + 5);
        eventTask.select('rect.dragBarRight').attr('x', xValueDragBarRightNew);

        this.refreshLabelPosition(eventTask);
      });

    // tasks
    const taskGroup = dataGroup.selectAll('g.taskEntry')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'taskEntry')
      .attr('id', (d) => 'taskEntry_' + d.id)
      .attr('transform', (d, i) => 'translate(' + (offset.left + this.xScale(new Date(d.start))) + ','
        + (offset.top + this.elementHeightWithMargin * i + this.elementHeight / 2) + ')')
      .call(drag);

    taskGroup
      .append('rect')
      .attr('class', 'task')
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker())
      .attr('x', 0)
      .attr('width', d => this.calculateBarWidth(d))
      .attr('y', 0)
      .attr('height', this.elementHeight);

    taskGroup
      .append('rect')
      .attr('x', - (this.dragBarWidth / 2) - 7)
      .attr('y', 0)
      .attr('height', this.elementHeight)
      .attr('class', 'dragBarLeft')
      .attr('width', this.dragBarWidth)
      .attr('fill', this.elementColor)
      .attr('stroke', d3.rgb(this.elementColor).darker())
      .call(dragLeft);

    taskGroup
      .append('rect')
      .attr('x', d => this.calculateBarWidth(d) + 5)
      .attr('y', 0)
      .attr('class', 'dragBarRight')
      .attr('height', this.elementHeight)
      .attr('width', this.dragBarWidth)
      .attr('fill', this.elementColor)
      .attr('stroke', d3.rgb(this.elementColor).darker())
      .call(dragRight);

    taskGroup
      .on('mouseover', (event, d) => {
        const eventTask = dataGroup.select('#taskEntry_' + d.id);
        eventTask.select('rect.dragBarLeft')
          .transition()
          .duration(500)
          .style('opacity', 1);

        eventTask.select('rect.dragBarRight')
          .transition()
          .duration(500)
          .style('opacity', 1);

        this.showTooltip(d, event.layerX, event.layerY);
      })
      .on('mouseout', (event, d) => {
        const eventTask = dataGroup.select('#taskEntry_' + d.id);
        eventTask.select('rect.dragBarLeft')
          .transition()
          .duration(500)
          .style('opacity', 0);

        eventTask.select('rect.dragBarRight')
          .transition()
          .duration(500)
          .style('opacity', 0);

        this.tooltip
          .transition()
          .duration(500)
          .style('opacity', 0)
          .transition()
          .delay(500)
          .style('display', 'none');
      });

    // task labels
    taskGroup
      .append('text')
      .text(d => d.name)
      .attr('class', 'taskLabel')
      .attr('x', d => {
        const eventTask = dataGroup.select('#taskEntry_' + d.id);

        const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

        const xValue = parseFloat(eventTask.select('rect.task').attr('x'));
        const xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;

        return this.calculateTaskLabelPosition(d) + xValueToAdd;
      })
      .attr('y', (this.elementHeight + this.elementMargin) / 2)
      .attr('text-height', this.elementHeight);
  }

  redraw(offset): void {

    // tasks
    const dataGroup = this.svg.select('g.data-group');

    const taskGroup = dataGroup.selectAll('g.taskEntry')
      .attr('transform', (d, i) => 'translate(' + (offset.left + this.xScale(new Date(d.start))) + ','
        + (offset.top + this.elementHeightWithMargin * i + this.elementHeight / 2) + ')');

    taskGroup.selectAll('rect.task')
      .attr('width', d => this.calculateBarWidth(d));

    taskGroup.selectAll('rect.dragBarRight')
      .attr('x', d => this.calculateBarWidth(d) + 5);

    // task labels
    taskGroup.selectAll('text.taskLabel')
      .attr('x', d => {

        let xValueToAdd = 0;

        if (this.isVisible(d)) {
          const eventTask = dataGroup.select('#taskEntry_' + d.id);

          const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;
          const xValue = parseFloat(eventTask.select('rect.task').attr('x'));

          xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;
        }

        return this.calculateTaskLabelPosition(d) + xValueToAdd;
      });
  }

  private calculateBarWidth(task: any): number {
    return this.xScale(new Date(task.end)) - this.xScale(new Date(task.start));
  }

  // get label position of a task depending on chart range so it is displayed centered on the visible part of the bar
  private calculateTaskLabelPosition(d: any): number {
    const xScaleStart = this.xScale(new Date(d.start));
    const xScaleEnd = this.xScale(new Date(d.end));

    const startPosition = Math.max(xScaleStart, this.xScale.range()[0]);
    const endPosition = Math.min(xScaleEnd, this.xScale.range()[1]);

    return (endPosition - startPosition) / 2;
  }

  refreshLabelPosition(eventTask): void {

    const xTransformValue = parseSvg(eventTask.attr('transform')).translateX;

    const xValue = parseFloat(eventTask.select('rect.task').attr('x'));
    const xValueToAdd = Math.abs(Math.min(xTransformValue + xValue, 0)) + xValue;

    eventTask.select('text.taskLabel')
      .attr('x', d => this.calculateTaskLabelPosition(d) + xValueToAdd)
      .attr('y', (this.elementHeight + this.elementMargin) / 2);
  }

  isVisible(d): boolean {
    return !(this.xScale(new Date(d.end)) < this.xScale.range()[0] ||
      this.xScale(new Date(d.start)) > this.xScale.range()[1]);
  }

  showTooltip(d, x, y): void {
    this.tooltip
      .style('top', (y + 15) + 'px')
      .style('left', (x) + 'px')
      .style('display', 'block')
      .html(`${d.name}<br>`
        + `${new Date(d.start).toLocaleDateString('de-DE', this.dateOptions)}`
        + ` - ${new Date(d.end).toLocaleDateString('de-DE', this.dateOptions)}<br>`)
      .transition()
      .style('display', 'block')
      .duration(500)
      .style('opacity', 1);
  }

  getAreaHeight(): number {
    return this.data.length * this.elementHeightWithMargin;
  }

}
