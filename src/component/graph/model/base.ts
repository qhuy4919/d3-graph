import { BaseType, Selection } from "d3-selection";
import { GraphPadding } from "./graph";

export type Datum = {
    amount: number,
    type: string,
    period: string,
    color: string,
    [key: string]: unknown
};

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

export const getDefaultChartOptions = (): ChartOptions => ({
    width: 0,
    height: 0,
    padding: 10,
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