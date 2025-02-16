import { BaseType, Selection } from "d3-selection";
import { TransformedGraphData } from "./base";

export type D3Selection<
    T extends BaseType = BaseType,
    D = TransformedGraphData,
    X = TransformedGraphData
> = Selection<T | null, D, T | null, X>;