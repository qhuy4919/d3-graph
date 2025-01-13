export type BarGraph<Data extends Record<string, unknown>> = {
    data: Data[],
    width: number,
    height: number,

    spec: Record<string,unknown>
}

