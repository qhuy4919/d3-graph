import { BaseType, Selection } from "d3-selection";
import { D3BaseGraphData } from "./base";

export type D3Selection<
    T extends BaseType = BaseType,
    D extends Record<string, unknown> | unknown = D3BaseGraphData,
> = Selection<T | null, D, T | null, undefined>;