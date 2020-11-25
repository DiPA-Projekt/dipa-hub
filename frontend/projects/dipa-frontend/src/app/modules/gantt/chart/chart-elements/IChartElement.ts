export interface IChartElement {

  svg: any;
  xScale: any;
  data: any[];
  tooltip: any;

  dateOptions: any;

  animationDuration: any;

  draw(offset): void;
  redraw(offset, animationDuration): void;
  showTooltip(d, x, y): void;
  getAreaHeight(): number;
}
