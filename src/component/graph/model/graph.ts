import { D3GraphSceneBuilder } from "../builder";
import { ChartOptions } from "./base";

/* Specification for padding to apply to the graph */
export type GraphPadding = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
export type D3BaseGraph<Data extends Record<string, unknown>> = {
    data: Data[];
    builder?: D3GraphSceneBuilder,
    options: ChartOptions
}

export type ItemSpace = {
    origin: {
        x: number
        y: number
    }
    shape: {
        width: number
        height: number
    }
}
