import { BaseType, Selection } from "d3-selection";
import { GraphPadding } from "./graph";

export type Datum = {
    amount: number,
    type: string,
    period: string,
    color: string,
    [key: string]: any
};

export type D3Table = Datum[]

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
    top: 20,
    right: 20,
    bottom: 50,
    left: 50,
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
    D extends Record<string, unknown> | unknown = Datum,
    X extends Record<string, unknown> | undefined = undefined
> = Selection<T | null, D, T | null, X>;