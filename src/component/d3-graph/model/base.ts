
export type PrimitiveField = {
    amount: number,
    type: string,
    period: string,
    color: string,
}
export type D3BaseGraphData = {
    [key: string]: any,
} & PrimitiveField;

export type TransformedGraphData = {
    _total?: number,
    dataKey: string,
} & Partial<Record<string, D3BaseGraphData>>;

export type D3DataSchema = {
    amount: string,
    type: string,
    period: string,
    color: string,
    subColor?: string,
}
export type D3GraphContainer = {
    width: number,
    height: number,
    margin: { top: number, right: number, bottom: number, left: number },
}
export type ChartSchema = {
    dataSchema: D3DataSchema,
    colorSchema: string[],
}
export type ChartSize = {
    chartWidth: number,
    chartHeight: number,
} & Pick<D3GraphContainer, 'margin'>;
export type ChartShape = 'stacked' | 'pie' | 'group'
