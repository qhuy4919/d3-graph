import { BaseType, Selection } from 'd3-selection';

export type Datum = {
    [key: string]: unknown;
}
export type BaseGraphData = {
    value: number,
    type: string,
    name: string,

}
export type TransformedGraphData = {
    total?: number,
    dataKey?: string,
    dataList?: BaseGraphData[],
    [key: string]: any
};

export const DataPrimaryField = {
    nameLabel: 'date',
    valueLabel: 'value',
    stackLabel: 'stack',
};

export type DataPrimaryField = typeof DataPrimaryField;

export type D3GraphContainer = {
    width: number,
    height: number,
    margin?: { top: number, right: number, bottom: number, left: number },
}

export type D3BaseGraph<T = Record<string, unknown>> = {
    containerSize: D3GraphContainer,
    data: T[]
}

export type D3Selection<
    T extends BaseType = BaseType,
    D extends TransformedGraphData = TransformedGraphData
> = Selection<T | null, D[], null, undefined>;

export type ChartSize = {
    chartWidth: number,
    chartHeight: number,
}
