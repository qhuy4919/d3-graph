/* Specification for padding to apply to the graph */
export type GraphPadding = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
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
