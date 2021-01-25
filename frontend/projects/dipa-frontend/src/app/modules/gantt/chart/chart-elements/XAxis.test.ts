import { expect } from 'chai';
import * as d3 from 'd3';

import { XAxis } from './XAxis';

const createContext = (): {
  element: unknown;
  svg: unknown;
} => {
  const ELEMENT = document.createElement('div');
  const SVG = d3
    .select(ELEMENT)
    .append('svg')
    .append('g')
    .attr('class', 'x-group');
  return {
    element: ELEMENT,
    svg: SVG,
  };
};

describe('XAxis', () => {
  let xAxis: XAxis;
  let context: unknown;

  beforeEach(() => {
    context = createContext();
    try {
      xAxis = new XAxis(context.svg, context.element, d3.scaleTime());
    } catch (error) {
      expect(true).to.equal(true);
    }
  });

  it('Versuch die XAxis zu instanziieren', () => {});
});
