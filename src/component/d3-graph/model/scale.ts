import { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';

export type D3ScaleLinear<T extends number = number> = ScaleLinear<T, T>;
export type D3ScaleOrdinal<T extends string = string, K = T> = ScaleOrdinal<T, K>;
export type D3ScaleBand<T extends string = string> = ScaleBand<T>;

export type D3Scale =
    D3ScaleBand |
    D3ScaleLinear |
    D3ScaleOrdinal;

export type DynamicGraphScale = {
    xScale: D3Scale,
    x2Scale: D3Scale
    yScale: D3Scale,
    y2Scale: D3Scale
    colorScale: D3Scale
}


export type StackedBarScale = {
    xScale: D3ScaleBand,
    yScale: D3ScaleLinear,
    colorScale: D3ScaleOrdinal,
}