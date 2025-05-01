export type AccessorForArrayItem<D3Datum, Output> = (
    d: D3Datum,
    index: number,
    data: D3Datum[],
) => Output;
