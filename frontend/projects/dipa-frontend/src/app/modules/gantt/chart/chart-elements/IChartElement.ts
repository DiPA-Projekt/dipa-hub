import * as d3 from 'd3';
import { ScaleTime } from 'd3-scale';

export interface IChartElement {
  svg: d3.Selection<any, any, any, any>;
  tooltip: d3.Selection<any, any, any, any>;
  readonly xScale: ScaleTime<any, any>;
  data: any[];

  animationDuration: number;

  draw(offset): void;
  redraw(offset, animationDuration): void;
  showTooltip(d, x, y): void;
  getAreaHeight(): number;
}
