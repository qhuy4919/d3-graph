import { BaseType, Selection } from "d3-selection";
import { GraphPadding } from "./graph";

export type D3Datum = {
    amount: number,
    type: string,
    period: string,
    color: string,
    [key: string]: any
};

export type D3Table = D3Datum[]

export type D3DataSchema = {
    amount: string,
    type: string,
    period: string,
    color: string,
}

export type ViewSize = {
    width: number
    height: number
}

export const defaultChartOptionPadding: GraphPadding = {
    top: 40,
    //Make sure min bottom, left and right are below 100 for axis label spacing
    right: 80,
    bottom: 80,
    left: 80,
}
export const getDefaultChartOptions = (): ChartOptions => ({
    width: 0,
    height: 0,
    padding: defaultChartOptionPadding,
})
export type ChartOptions = {
    /**
     * In pixel, the coordinate system will 
     * translated to this point 
    */
    origin?: [number, number],
    width: number,
    height: number,
    padding?: number | GraphPadding
}

export type D3Selection<
    T extends BaseType = BaseType,
    D extends Record<string, unknown> | unknown = D3Datum,
    X extends BaseType = BaseType,
    Y extends Record<string, unknown> | unknown = D3Datum,
> = Selection<T | null, D, X, Y>;