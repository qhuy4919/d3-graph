import { CurveFactory, CurveFactoryLineOnly } from 'd3-shape';
import { AccessorForArrayItem, D3Datum } from '../../model';
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

export type LinePathConfig<Datum extends D3Datum> = {
    /** Sets the curve factory (from @visx/curve or d3-curve) for the line generator. Defaults to curveLinear. */
    curve?: CurveFactory | CurveFactoryLineOnly;
    /** Sets the x0 accessor function, and sets x1 to null. */
    x?: number | AccessorForArrayItem<Datum, number>;
    /** Sets the y0 accessor function, and sets y1 to null. */
    y?: number | AccessorForArrayItem<Datum, number>
};
