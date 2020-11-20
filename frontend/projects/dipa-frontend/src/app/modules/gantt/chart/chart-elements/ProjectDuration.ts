import * as d3 from 'd3';

export class ProjectDuration {

  svg;
  readonly xScale;

  svgBbox;
  projectGroup;

  dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

  elementColor = '#c6e0b4';

  projectStartDate: Date = new Date(2020, 7, 17);
  projectEndDate: Date = new Date(2024, 7, 19);

  startDateText;
  endDateText;

  dx = 3;
  height = 18;

  constructor(svg: any, xScale: any, timelineData: any) {
    this.svg = svg;
    this.xScale = xScale;
    this.projectStartDate = new Date(timelineData.start);
    this.projectEndDate = new Date(timelineData.end);
    this.svgBbox = this.svg.node().getBBox();
    this.projectGroup = this.svg.select('g.project-group');
  }

  draw(): void {
    const visibleProjectStartDatePosition = Math.max(this.xScale(this.projectStartDate), 0);
    const visibleProjectEndDatePosition = Math.min(this.xScale(this.projectEndDate), this.xScale.range()[1]);

    // project duration indicator
    this.projectGroup
      .append('rect')
      .attr('class', 'projectDuration')
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker())
      .attr('x', Math.min(visibleProjectStartDatePosition, this.xScale.range()[1]))
      .attr('width', Math.min(Math.max(this.xScale(this.projectEndDate) - visibleProjectStartDatePosition, 0), this.xScale.range()[1]))
      .attr('height', this.height);

    const initialStartDatePosition = Math.min(visibleProjectStartDatePosition, this.xScale.range()[1] - 120);
    const initialEndDatePosition = visibleProjectEndDatePosition - 60;

    this.drawProjectStartDate(initialStartDatePosition);
    this.drawProjectEndDate(initialEndDatePosition);

    this.drawVerticalProjectDateLines();
  }

  private drawProjectStartDate(x): void {
    // project start date
    this.startDateText = this.projectGroup
      .append('text')
      .attr('class', 'projectStartDateLabel')
      .attr('x', x)
      .attr('y', this.height / 2)
      .attr('dominant-baseline', 'central');

    this.startDateText
      .append('tspan')
      .attr('class', 'triangleLeft')
      .text('◀');

    this.startDateText.append('tspan')
      .text(this.projectStartDate.toLocaleDateString('de-DE', this.dateOptions))
      .attr('class', 'projectStartDate')
      .attr('dx', this.dx);

    this.startDateText
      .append('tspan')
      .attr('class', 'minusText')
      .text(' - ')
      .attr('dx', this.dx);
  }

  private drawProjectEndDate(x): void {
    // project end date
    this.endDateText = this.projectGroup
      .append('text')
      .attr('class', 'projectEndDateLabel')
      .attr('x', x)
      .attr('y', this.height / 2)
      .attr('dominant-baseline', 'central');

    this.endDateText.append('tspan')
      .text(this.projectEndDate.toLocaleDateString('de-DE', this.dateOptions))
      .attr('class', 'projectEndDate')
      .attr('dx', this.dx);

    this.endDateText
      .append('tspan')
      .attr('class', 'triangleRight')
      .text('▶')
      .attr('dx', this.dx);
  }

  private drawVerticalProjectDateLines(): void {
    const viewBoxHeight = this.svgBbox.height;

    // projectStartDate grid line
    this.projectGroup
      .append('line')
      .attr('class', 'projectStartDateLine')
      .attr('x1', this.xScale(this.projectStartDate))
      .attr('x2', this.xScale(this.projectStartDate))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .attr('stroke', d3.rgb(this.elementColor).darker());

    // projectEndDate grid line
    this.projectGroup
      .append('line')
      .attr('class', 'projectEndDateLine')
      .attr('x1', this.xScale(this.projectEndDate))
      .attr('x2', this.xScale(this.projectEndDate))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .attr('stroke', d3.rgb(this.elementColor).darker());
  }

  redraw(): void {
    // get current width of text elements
    const startDateSvgBbox = this.startDateText.node().getBBox().width;
    const endDateSvgBbox = this.endDateText.node().getBBox().width;

    const visibleProjectStartDatePosition = Math.max(this.xScale(this.projectStartDate), 0);
    const visibleProjectEndDatePosition = Math.min(this.xScale(this.projectEndDate), this.xScale.range()[1]);

    // position where startDateText will be drawn
    const leftBorder = Math.min(visibleProjectStartDatePosition, this.xScale.range()[1] - (startDateSvgBbox + endDateSvgBbox + this.dx));
    // position where endDateText will be drawn
    const rightBorder = Math.max(visibleProjectEndDatePosition - (endDateSvgBbox + this.dx), startDateSvgBbox);

    // project duration indicator
    this.projectGroup.select('rect.projectDuration')
      .attr('x', this.xScale(this.projectStartDate))
      .attr('width', (this.xScale(this.projectEndDate) - this.xScale(this.projectStartDate)));

    this.redrawProjectStartDate(leftBorder);
    this.redrawProjectEndDate(rightBorder);

    const connectLeftAndRightDate = rightBorder - leftBorder <= startDateSvgBbox;
    this.startDateText.select('tspan.minusText')
      .attr('fill', connectLeftAndRightDate ? null : 'none');

    this.redrawVerticalProjectDateLines();
  }

  private redrawProjectStartDate(x): void {
    // project start date
    this.startDateText
      .attr('x', x);

    const projectStartDateOutsideViewbox = this.xScale(this.projectStartDate) < 0;
    this.startDateText.select('tspan.triangleLeft')
      .attr('fill', projectStartDateOutsideViewbox ? null : 'none');

    this.startDateText.select('tspan.projectStartDate')
      .text(this.projectStartDate.toLocaleDateString('de-DE', this.dateOptions));
  }

  private redrawProjectEndDate(x): void {
    // project end date
    this.endDateText
      .attr('x', x);

    this.endDateText.select('tspan.projectEndDate')
      .text(this.projectEndDate.toLocaleDateString('de-DE', this.dateOptions));

    const projectEndDateOutsideViewbox = this.xScale(this.projectEndDate) > this.xScale.range()[1];
    this.endDateText.select('tspan.triangleRight')
      .attr('fill', projectEndDateOutsideViewbox ? null : 'none');
  }

  private redrawVerticalProjectDateLines(): void {
    // projectStartDate grid line
    this.projectGroup.select('line.projectStartDateLine')
      .attr('x1', this.xScale(this.projectStartDate))
      .attr('x2', this.xScale(this.projectStartDate));

    // projectEndDate grid line
    this.projectGroup.select('line.projectEndDateLine')
      .attr('x1', this.xScale(this.projectEndDate))
      .attr('x2', this.xScale(this.projectEndDate));
  }

}
