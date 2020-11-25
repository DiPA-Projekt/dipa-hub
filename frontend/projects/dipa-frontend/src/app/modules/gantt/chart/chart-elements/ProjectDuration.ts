import * as d3 from 'd3';

export class ProjectDuration {

  svg;
  readonly xScale;

  svgBbox;
  projectGroup;

  dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

  elementColor;

  noRiskColor = '#4aed5a';
  middleRiskColor = '#f7ec1b';
  highRiskColor = '#f71b1b';

  projectStartDate: Date = new Date(2020, 7, 17);
  projectEndDate: Date = new Date(2024, 7, 19);

  startDateText;
  endDateText;

  riskAlarmText;
  riskAlarmStatus;
  riskAlarmIcon;

  dx = 3;
  height = 18;

  dragDxStack = 0;

  initialProjectDuration;
  changedProjectDuration;


  constructor(svg: any, xScale: any, timelineData: any) {
    this.svg = svg;
    this.xScale = xScale;
    this.projectStartDate = new Date(timelineData.start);
    this.projectEndDate = new Date(timelineData.end);
    this.svgBbox = this.svg.node().getBBox();
    this.projectGroup = this.svg.select('g.project-group');
  }

  draw(): void {
    this.elementColor = this.noRiskColor;

    const visibleProjectStartDatePosition = Math.max(this.xScale(this.projectStartDate), 0);
    const visibleProjectEndDatePosition = Math.min(this.xScale(this.projectEndDate), this.xScale.range()[1]);

    const drag = d3.drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

        const projectDuration = this.projectGroup.select('rect.projectDuration');

        const xValueStart = parseFloat(projectDuration.attr('x'));
        const width = parseFloat(projectDuration.attr('width'));

        const xValueStartNew = xValueStart + event.dx;
        const xValueEndNew = xValueStartNew + width;

        // set new values
        this.projectStartDate = this.xScale.invert(xValueStartNew);
        this.projectEndDate = this.xScale.invert(xValueEndNew);

        // refresh gui
        projectDuration.attr('x', xValueStartNew);
        this.redraw(0);
      });

    // project duration indicator
    this.projectGroup
      .append('rect')
      .attr('class', 'projectDuration')
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker())
      .attr('x', Math.min(visibleProjectStartDatePosition, this.xScale.range()[1]))
      .attr('width', Math.min(Math.max(this.xScale(this.projectEndDate) - visibleProjectStartDatePosition, 0), this.xScale.range()[1]))
      .attr('height', this.height)
      .call(drag);

    const initialStartDatePosition = Math.min(visibleProjectStartDatePosition, this.xScale.range()[1] - 120);
    const initialEndDatePosition = visibleProjectEndDatePosition - 60;

    this.drawProjectStartDate(initialStartDatePosition);
    this.drawProjectEndDate(initialEndDatePosition);

    // const visible = Math.abs(initialEndDatePosition - initialStartDatePosition);

    // this.drawRiskAlarmText(initialStartDatePosition + (visible / 2) -10);
    // this.drawRiskAlarmText((initialEndDatePosition-initialStartDatePosition)/2);

    this.drawVerticalProjectDateLines();

    this.initialProjectDuration = this.calculateProjectDuration(this.projectStartDate, this.projectEndDate);
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

  private redrawRiskAlarmText(x): void {
    // 
    this.projectGroup.select('text.riskAlarmText').remove();

    this.riskAlarmText = this.projectGroup
      .append('text')
      .attr('x', x)
      .attr('y', this.height / 2)
      .attr('class', 'riskAlarmText')
      .attr('dominant-baseline', 'central');

    this.riskAlarmText
      .append('tspan')
      .attr('class', 'fa') 
      .text(this.riskAlarmIcon)
      .attr('dominant-baseline', 'central')
      .attr('x', x)
      .attr('dx', this.dx);
    
    this.riskAlarmText
      .append('tspan')
      .text(this.riskAlarmStatus)
      .attr('dx', this.dx); 

  }

  private drawVerticalProjectDateLines(): void {
    const viewBoxHeight = this.svgBbox.height;

    const dragProjectLeft = d3.drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

        const projectDuration = this.projectGroup.select('rect.projectDuration');

        const width = parseFloat(projectDuration.attr('width'));
        const xValueStart = parseFloat(projectDuration.attr('x'));

        const xValueNew = (xValueStart + event.dx);
        const widthNew = (width - event.dx - this.dragDxStack);

        // do not allow negative project duration and remember dx values on a stack
        if (widthNew <= 0) {
          this.dragDxStack += event.dx;
          return;
        } else if (this.dragDxStack > 0) {
          if (this.dragDxStack + event.dx < 0) {
            this.dragDxStack = 0;
          } else {
            this.dragDxStack += event.dx;
            return;
          }
        }

        this.projectStartDate = this.xScale.invert(xValueNew);

        this.changedProjectDuration = this.calculateProjectDuration(this.projectStartDate, this.projectEndDate);
        this.riskCalculate(this.initialProjectDuration, this.changedProjectDuration);

        this.redraw(0);
      })
      .on('end', (event: d3.D3DragEvent<any, any, any>) => {
        this.dragDxStack = 0;
      });

    const dragProjectEnd = d3.drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {

        const projectDuration = this.projectGroup.select('rect.projectDuration');

        const width = parseFloat(projectDuration.attr('width'));
        const xValueStart = parseFloat(projectDuration.attr('x'));

        const widthNew = (width + event.dx + this.dragDxStack);

        // do not allow negative project duration and remember dx values on a stack
        if (widthNew <= 0) {
          this.dragDxStack += event.dx;
          return;
        } else if (this.dragDxStack < 0) {
          if (this.dragDxStack + event.dx > 0) {
            this.dragDxStack = 0;
          } else {
            this.dragDxStack += event.dx;
            return;
          }
        }

        this.projectEndDate = this.xScale.invert(xValueStart + widthNew);

        this.changedProjectDuration = this.calculateProjectDuration(this.projectStartDate, this.projectEndDate);
        this.riskCalculate(this.initialProjectDuration, this.changedProjectDuration);

        this.redraw(0);
      })
      .on('end', (event: d3.D3DragEvent<any, any, any>) => {
        this.dragDxStack = 0;
      });

    // projectStartDate grid line
    this.projectGroup
      .append('line')
      .attr('class', 'projectStartDateLine')
      .attr('x1', this.xScale(this.projectStartDate))
      .attr('x2', this.xScale(this.projectStartDate))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .attr('stroke', d3.rgb(this.elementColor).darker())
      .call(dragProjectLeft);

    // projectEndDate grid line
    this.projectGroup
      .append('line')
      .attr('class', 'projectEndDateLine')
      .attr('x1', this.xScale(this.projectEndDate))
      .attr('x2', this.xScale(this.projectEndDate))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .attr('stroke', d3.rgb(this.elementColor).darker())
      .call(dragProjectEnd);
  }

  redraw(animationDuration): void {
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
      .transition()
      .ease(d3.easeLinear)
      .duration(animationDuration)
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker())
      .attr('x', this.xScale(this.projectStartDate))
      .attr('width', (this.xScale(this.projectEndDate) - this.xScale(this.projectStartDate)));

    this.redrawProjectStartDate(leftBorder, animationDuration);
    this.redrawProjectEndDate(rightBorder, animationDuration);

    const visible = Math.abs(visibleProjectEndDatePosition - visibleProjectStartDatePosition);

    const connectLeftAndRightDate = rightBorder - leftBorder <= startDateSvgBbox;
    this.startDateText.select('tspan.minusText')
      .attr('fill', connectLeftAndRightDate ? null : 'none');
    
    if (connectLeftAndRightDate) {
      this.riskAlarmIcon = null;
      this.riskAlarmStatus = null;
    }

    this.redrawRiskAlarmText(leftBorder + (visible / 2) - 10);

    this.redrawVerticalProjectDateLines(animationDuration);
  }

  private redrawProjectStartDate(x, animationDuration): void {
    // project start date
    this.startDateText
      .transition()
      .ease(d3.easeLinear)
      .duration(animationDuration)
      .attr('x', x);

    const projectStartDateOutsideViewbox = this.xScale(this.projectStartDate) < 0;
    this.startDateText.select('tspan.triangleLeft')
      .attr('fill', projectStartDateOutsideViewbox ? null : 'none');

    this.startDateText.select('tspan.projectStartDate')
      .text(this.projectStartDate.toLocaleDateString('de-DE', this.dateOptions));
  }

  private redrawProjectEndDate(x, animationDuration): void {
    // project end date
    this.endDateText
      .transition()
      .ease(d3.easeLinear)
      .duration(animationDuration)
      .attr('x', x);

    this.endDateText.select('tspan.projectEndDate')
      .text(this.projectEndDate.toLocaleDateString('de-DE', this.dateOptions));

    const projectEndDateOutsideViewbox = this.xScale(this.projectEndDate) > this.xScale.range()[1];
    this.endDateText.select('tspan.triangleRight')
      .attr('fill', projectEndDateOutsideViewbox ? null : 'none');
  }

  private redrawVerticalProjectDateLines(animationDuration): void {
    // projectStartDate grid line
    this.projectGroup.select('line.projectStartDateLine')
      .transition()
      .ease(d3.easeLinear)
      .duration(animationDuration)
      .attr('stroke', d3.rgb(this.elementColor).darker())
      .attr('x1', this.xScale(this.projectStartDate))
      .attr('x2', this.xScale(this.projectStartDate));

    // projectEndDate grid line
    this.projectGroup.select('line.projectEndDateLine')
      .transition()
      .ease(d3.easeLinear)
      .duration(animationDuration)
      .attr('stroke', d3.rgb(this.elementColor).darker())
      .attr('x1', this.xScale(this.projectEndDate))
      .attr('x2', this.xScale(this.projectEndDate));
  }

  private calculateProjectDuration(startDate, endDate): number{
    return Math.round(Math.abs((startDate - endDate) / 24 * 60 * 60 * 1000));
  }

  private riskCalculate(initProjectDuration, changedProjectDuration): void {
    const riskPercentage = Math.abs(initProjectDuration - changedProjectDuration) / initProjectDuration;

    console.log(riskPercentage)

    if (riskPercentage < 0.25){
      this.elementColor = this.noRiskColor;
      this.riskAlarmIcon = '\uf164';
      this.riskAlarmStatus = 'Kein Risiko'
    }
    else if (riskPercentage > 0.25 && riskPercentage < 0.5) {
      this.elementColor = this.middleRiskColor;
      this.riskAlarmIcon = '\uf165';
      this.riskAlarmStatus = 'Mittleres Risiko'
    }
    else {
      this.elementColor = this.highRiskColor;
      this.riskAlarmIcon = '\uf165';
      this.riskAlarmStatus = 'Hohes Risiko'
    }
  }
}
