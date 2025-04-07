/* Specification for padding to apply to the graph */
export type GraphPadding = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
export type D3GraphProps<Data extends Record<string, unknown>> = {
    width: number;
    height: number;
    data: Data[];
    padding?: GraphPadding;

}

export type ItemSpace = {
    origin: {
        x: number
        y: number
    }
    shape: {
        width: number | undefined
        height: number | undefined
    }
}
