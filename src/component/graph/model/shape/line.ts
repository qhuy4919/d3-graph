import { CurveFactory, CurveFactoryLineOnly } from 'd3-shape';
export type D3CurveType =
    | 'curveBasis'
    | 'curveBasisClosed'
    | 'curveBasisOpen'
    | 'curveStep'
    | 'curveStepAfter'
    | 'curveStepBefore'
    | 'curveBundle'
    | 'curveLinear'
    | 'curveLinearClosed'
    | 'curveCardinal'
    | 'curveCardinalClosed'
    | 'curveCardinalOpen'
    | 'curveCatmullRom'
    | 'curveCatmullRomClosed'
    | 'curveCatmullRomOpen'
    | 'curveMonotoneX'
    | 'curveMonotoneY'
    | 'curveNatural';

export type LinePathConfig = {
    /** Sets the curve factory (from @visx/curve or d3-curve) for the line generator. Defaults to curveLinear. */
    curve?: D3CurveType | CurveFactory | CurveFactoryLineOnly;
    /** Sets the x0 accessor function, and sets x1 to null. */
    x?: number
    /** Sets the y0 accessor function, and sets y1 to null. */
    y?: number
};