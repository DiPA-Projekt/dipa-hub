export interface IChartElement {

  svg: any;
  xScale: any;
  data: any[];
  tooltip: any;

  dateOptions: any;

  draw(offset): void;
  redraw(offset): void;
  showTooltip(d, x, y): void;
  getAreaHeight(): number;
}
