import * as d3 from 'd3';
import { ScaleTime } from 'd3-scale';
import { Timeline } from 'dipa-api-client';
import Utils from '../../../../shared/utils';

export class ProjectDuration {
  svg: d3.Selection<any, any, any, any>;
  tooltip: d3.Selection<any, any, any, any>;
  readonly xScale: ScaleTime<any, any>;

  svgBbox: DOMRect;
  projectGroup: d3.Selection<any, any, any, any>;

  elementColor: string;

  noRiskColor = '#4aed5a';
  middleRiskColor = '#f7ec1b';
  highRiskColor = '#f73b3b';

  projectStartDate: Date;
  projectEndDate: Date;

  startDateText: d3.Selection<any, any, any, any>;
  endDateText: d3.Selection<any, any, any, any>;

  riskAlarmText: d3.Selection<any, any, any, any>;
  riskAlarmStatus: string;
  riskAlarmIcon: string;
  riskTooltip: string;

  dx = 3;
  height = 18;

  dragDxStack = 0;

  projectDurationYears: number;

  timelineOperationTypeId: number;

  riskInformation = [
    {
      minVal: 0,
      maxVal: 1,
      prob: '85',
      overtime: 9,
      color: this.highRiskColor,
      icon: 'thumb_down',
      text: 'Hohes Risiko',
    },
    {
      minVal: 1,
      maxVal: 1.5,
      prob: '50',
      overtime: 3,
      color: this.middleRiskColor,
      icon: 'thumb_down',
      text: 'Mittleres Risiko',
    },
    {
      minVal: 1.5,
      maxVal: 2.5,
      prob: '10',
      overtime: 1,
      color: this.noRiskColor,
      icon: 'thumb_up',
      text: 'Kein Risiko',
    },
    {
      minVal: 2.5,
      maxVal: 3,
      prob: '50',
      overtime: 3,
      color: this.middleRiskColor,
      icon: 'thumb_down',
      text: 'Mittleres Risiko',
    },
    {
      minVal: 3,
      maxVal: 10,
      prob: '85',
      overtime: 9,
      color: this.highRiskColor,
      icon: 'thumb_down',
      text: 'Hohes Risiko',
    },
  ];

  dragStartDate: Date;

  public onDragEnd?: (days: number) => void;
  public onDragEndProjectStart?: (days: number) => void;
  public onDragEndProjectEnd?: (days: number) => void;

  modifiable = false;

  constructor(
    svg: d3.Selection<any, any, any, any>,
    chartElement: HTMLElement,
    xScale: ScaleTime<any, any>,
    timelineData: Timeline,
    modifiable: boolean
  ) {
    this.svg = svg;
    this.xScale = xScale;
    this.timelineOperationTypeId = timelineData.operationTypeId;
    this.modifiable = modifiable;
    this.svgBbox = (this.svg.node() as SVGGraphicsElement).getBBox();
    this.projectGroup = this.svg.select('g.project-group');

    this.tooltip = d3.select(chartElement).select('figure#chart .tooltip');

    this.setData(timelineData);
  }

  private static calculateProjectDuration(startDate: Date, endDate: Date): number {
    const daysDiff = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (24 * 60 * 60 * 1000)));
    return Math.round((daysDiff / 365) * 10) / 10;
  }

  redraw(animationDuration: number): void {
    // get current width of text elements
    const startDateSvgBbox = (this.startDateText.node() as SVGGraphicsElement).getBBox().width;
    const endDateSvgBbox = (this.endDateText.node() as SVGGraphicsElement).getBBox().width;

    const visibleProjectStartDatePosition = Math.max(this.xScale(this.projectStartDate), 0);
    const visibleProjectEndDatePosition = Math.min(this.xScale(this.projectEndDate), this.xScale.range()[1]);

    // position where startDateText will be drawn
    const leftBorder = Math.min(
      visibleProjectStartDatePosition,
      this.xScale.range()[1] - (startDateSvgBbox + endDateSvgBbox + this.dx)
    );
    // position where endDateText will be drawn
    const rightBorder = Math.max(visibleProjectEndDatePosition - (endDateSvgBbox + this.dx), startDateSvgBbox);

    // project duration indicator
    this.projectGroup
      .select('rect.projectDuration')
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker().formatHex())
      .attr('x', this.xScale(this.projectStartDate))
      .attr('width', this.xScale(this.projectEndDate) - this.xScale(this.projectStartDate));

    this.redrawProjectStartDate(leftBorder, animationDuration);
    this.redrawProjectEndDate(rightBorder, animationDuration);

    const visible = Math.abs(visibleProjectEndDatePosition - visibleProjectStartDatePosition);

    const connectLeftAndRightDate = rightBorder - leftBorder <= startDateSvgBbox;
    this.startDateText.select('tspan.minusText').attr('fill', connectLeftAndRightDate ? null : 'none');

    if (connectLeftAndRightDate) {
      this.projectGroup.select('text.riskAlarmText').remove();
    } else {
      this.redrawRiskAlarmText(leftBorder + visible / 2 - 50);
    }

    this.redrawVerticalProjectDateLines(animationDuration);
  }

  setData(timelineData: Timeline): void {
    this.projectStartDate = new Date(timelineData.start);
    this.projectEndDate = new Date(timelineData.end);
    this.projectStartDate.setHours(0, 0, 0, 0);
    this.projectEndDate.setHours(0, 0, 0, 0);

    this.projectDurationYears = ProjectDuration.calculateProjectDuration(this.projectStartDate, this.projectEndDate);
    this.riskCalculate(this.projectDurationYears);
  }

  draw(): void {
    this.elementColor = this.noRiskColor;

    const visibleProjectStartDatePosition = Math.max(this.xScale(this.projectStartDate), 0);
    const visibleProjectEndDatePosition = Math.min(this.xScale(this.projectEndDate), this.xScale.range()[1]);

    const drag = d3
      .drag()
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
      })
      .on('start', () => {
        this.dragStartDate = this.projectStartDate;
      })
      .on('end', () => {
        this.projectStartDate.setHours(0, 0, 0, 0);
        this.projectEndDate.setHours(0, 0, 0, 0);

        const dragOffset: number = Math.floor(
          (this.projectStartDate.valueOf() - this.dragStartDate.valueOf()) / (1000 * 60 * 60 * 24)
        );

        this.onDragEnd(dragOffset);
      });

    // project duration indicator
    const projectDurationIndicator = this.projectGroup
      .append('rect')
      .attr('class', 'projectDuration')
      .style('fill', this.elementColor)
      .style('stroke', d3.rgb(this.elementColor).darker().formatHex())
      .attr('x', Math.min(visibleProjectStartDatePosition, this.xScale.range()[1]))
      .attr(
        'width',
        Math.min(
          Math.max(this.xScale(this.projectEndDate) - visibleProjectStartDatePosition, 0),
          this.xScale.range()[1]
        )
      )
      .attr('height', this.height);

    if (this.modifiable) {
      projectDurationIndicator.call(drag);
    } else {
      projectDurationIndicator.classed('inactive', true);
    }

    const initialStartDatePosition = Math.min(visibleProjectStartDatePosition, this.xScale.range()[1] - 120);
    const initialEndDatePosition = visibleProjectEndDatePosition - 60;

    this.drawProjectStartDate(initialStartDatePosition);
    this.drawProjectEndDate(initialEndDatePosition);

    this.drawVerticalProjectDateLines();

    this.projectDurationYears = ProjectDuration.calculateProjectDuration(this.projectStartDate, this.projectEndDate);
    this.riskCalculate(this.projectDurationYears);
  }

  private drawProjectStartDate(x): void {
    // project start date
    this.startDateText = this.projectGroup
      .append('text')
      .attr('class', 'projectStartDateLabel')
      .attr('x', x)
      .attr('y', this.height / 2)
      .attr('dominant-baseline', 'central');

    this.startDateText.append('tspan').attr('class', 'triangleLeft').text('◀');

    this.startDateText
      .append('tspan')
      .text(Utils.getGermanFormattedDateString(this.projectStartDate))
      .attr('class', 'projectStartDate')
      .attr('dx', this.dx);

    this.startDateText.append('tspan').attr('class', 'minusText').text(' - ').attr('dx', this.dx);
  }

  private drawProjectEndDate(x: number): void {
    // project end date
    this.endDateText = this.projectGroup
      .append('text')
      .attr('class', 'projectEndDateLabel')
      .attr('x', x)
      .attr('y', this.height / 2)
      .attr('dominant-baseline', 'central');

    this.endDateText
      .append('tspan')
      .text(Utils.getGermanFormattedDateString(this.projectEndDate))
      .attr('class', 'projectEndDate')
      .attr('dx', this.dx);

    this.endDateText.append('tspan').attr('class', 'triangleRight').text('▶').attr('dx', this.dx);
  }

  private drawVerticalProjectDateLines(): void {
    const viewBoxHeight = this.svgBbox.height;

    const dragProjectStart = d3
      .drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {
        const projectDuration = this.projectGroup.select('rect.projectDuration');

        const width = parseFloat(projectDuration.attr('width'));
        const xValueStart = parseFloat(projectDuration.attr('x'));

        const xValueNew = xValueStart + event.dx;
        const widthNew = width - event.dx - this.dragDxStack;

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

        this.redraw(0);
      })
      .on('start', () => {
        this.dragStartDate = this.projectStartDate;
      })
      .on('end', () => {
        this.dragDxStack = 0;
        this.projectStartDate.setHours(0, 0, 0, 0);

        const dragOffset: number = Math.floor(
          (this.projectStartDate.valueOf() - this.dragStartDate.valueOf()) / (1000 * 60 * 60 * 24)
        );

        this.onDragEndProjectStart(dragOffset);
      });

    const dragProjectEnd = d3
      .drag()
      .on('drag', (event: d3.D3DragEvent<any, any, any>) => {
        const projectDuration = this.projectGroup.select('rect.projectDuration');

        const width = parseFloat(projectDuration.attr('width'));
        const xValueStart = parseFloat(projectDuration.attr('x'));

        const widthNew = width + event.dx + this.dragDxStack;

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

        if (this.xScale.invert(xValueStart + widthNew).toDateString() !== this.projectStartDate.toDateString()) {
          this.projectEndDate = this.xScale.invert(xValueStart + widthNew);
          this.redraw(0);
        }
      })
      .on('start', () => {
        this.dragStartDate = this.projectEndDate;
      })
      .on('end', () => {
        this.dragDxStack = 0;
        this.projectEndDate.setHours(0, 0, 0, 0);

        const dragOffset: number = Math.floor(
          (this.projectEndDate.valueOf() - this.dragStartDate.valueOf()) / (1000 * 60 * 60 * 24)
        );

        this.onDragEndProjectEnd(dragOffset);
      });

    // projectStartDate grid line
    const projectStartDateLine = this.projectGroup
      .append('line')
      .attr('class', 'projectStartDateLine')
      .attr('x1', this.xScale(this.projectStartDate))
      .attr('x2', this.xScale(this.projectStartDate))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .attr('stroke', d3.rgb(this.elementColor).darker().formatHex());

    if (this.modifiable) {
      projectStartDateLine.call(dragProjectStart);
    } else {
      projectStartDateLine.classed('inactive', true);
    }

    // projectEndDate grid line
    const projectEndDateLine = this.projectGroup
      .append('line')
      .attr('class', 'projectEndDateLine')
      .attr('x1', this.xScale(this.projectEndDate))
      .attr('x2', this.xScale(this.projectEndDate))
      .attr('y1', 0)
      .attr('y2', viewBoxHeight)
      .attr('stroke', d3.rgb(this.elementColor).darker().formatHex());

    if (this.modifiable) {
      projectEndDateLine.call(dragProjectEnd);
    } else {
      projectEndDateLine.classed('inactive', true);
    }
  }

  private redrawProjectStartDate(x, animationDuration): void {
    // project start date
    this.startDateText.transition().ease(d3.easeLinear).duration(animationDuration).attr('x', x);

    const projectStartDateOutsideViewBox = this.xScale(this.projectStartDate) < 0;
    this.startDateText.select('tspan.triangleLeft').attr('fill', projectStartDateOutsideViewBox ? null : 'none');

    this.startDateText.select('tspan.projectStartDate').text(Utils.getGermanFormattedDateString(this.projectStartDate));
  }

  private redrawProjectEndDate(x: number, animationDuration: number): void {
    // project end date
    this.endDateText.transition().ease(d3.easeLinear).duration(animationDuration).attr('x', x);

    this.endDateText.select('tspan.projectEndDate').text(Utils.getGermanFormattedDateString(this.projectEndDate));

    const projectEndDateOutsideViewBox = this.xScale(this.projectEndDate) > this.xScale.range()[1];
    this.endDateText.select('tspan.triangleRight').attr('fill', projectEndDateOutsideViewBox ? null : 'none');
  }

  private redrawVerticalProjectDateLines(animationDuration: number): void {
    // projectStartDate grid line
    this.projectGroup
      .select('line.projectStartDateLine')
      .transition()
      .ease(d3.easeLinear)
      .duration(animationDuration)
      .attr('stroke', d3.rgb(this.elementColor).darker().formatHex())
      .attr('x1', this.xScale(this.projectStartDate))
      .attr('x2', this.xScale(this.projectStartDate));

    // projectEndDate grid line
    this.projectGroup
      .select('line.projectEndDateLine')
      .transition()
      .ease(d3.easeLinear)
      .duration(animationDuration)
      .attr('stroke', d3.rgb(this.elementColor).darker().formatHex())
      .attr('x1', this.xScale(this.projectEndDate))
      .attr('x2', this.xScale(this.projectEndDate));
  }

  private redrawRiskAlarmText(x: number): void {
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
      .attr('class', 'material-icons')
      .text(this.riskAlarmIcon)
      .style('font-size', '16px')
      .attr('x', x)
      .attr('dx', this.dx);

    this.riskAlarmText.append('tspan').text(this.riskAlarmStatus).attr('dx', this.dx);

    this.riskAlarmText
      .on('mouseover', (event: MouseEvent) => {
        this.showLineTooltip(event.clientX, event.clientY, this.riskTooltip);
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(50).style('opacity', 0).transition().delay(50).style('display', 'none');
      });
  }

  private riskCalculate(projectDurationYears: number): void {
    const timeText = projectDurationYears < 1 ? 'Monaten' : 'Jahren';

    const time = projectDurationYears < 1 ? Math.round(projectDurationYears * 12) : projectDurationYears;

    if (this.timelineOperationTypeId === 1) {
      for (const item of this.riskInformation) {
        if (item.minVal < projectDurationYears && projectDurationYears < item.maxVal) {
          const info = item;

          const overtimeText = info.overtime > 1 ? 'Monate' : 'Monat';

          this.riskAlarmIcon = info.icon;
          this.riskAlarmStatus = `${info.text}: ${info.prob}% +${info.overtime}M`;
          this.elementColor = info.color;
          this.riskTooltip =
            `<span class="material-icons">${info.icon}</span>` +
            ` Das Projekt hat eine Laufzeit von ${time} ${timeText} mit ${info.prob}% Wahrscheinlichkeit,` +
            ` dass es um ${info.overtime} ${overtimeText} verlängert wird.`;
        }
      }
    }
  }

  private showLineTooltip(x: number, y: number, textTooltip: string): void {
    this.tooltip
      .style('top', `${y + 15}px`)
      .style('left', `${x + 12}px`)
      .style('display', 'block')
      .html(textTooltip)
      .transition()
      .duration(300)
      .style('opacity', 1);
  }
}
