import { BaseType, Selection } from 'd3-selection';
export type Datum = {
    [key: string]: unknown;
}

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
    T extends BaseType,
    D extends Datum
> = Selection<T | null, D[], null, undefined>