import { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';
import { BaseType, Selection } from 'd3-selection';
import { Stack } from 'd3-shape';

export type PrimitiveField = {
    value: number | string,
    type: string,
    name: string,
}
export type BaseGraphData = {
    [key: string]: any,
} & PrimitiveField;

export type TransformedGraphData = {
    _total?: number,
    dataKey?: string,
} & Partial<Record<string, BaseGraphData>>;

export type StackData<D, K> = Stack<any, D, K>
export type ChartShape = 'stack' | 'pie'

export type D3GraphContainer = {
    width: number,
    height: number,
    margin?: { top: number, right: number, bottom: number, left: number },
}

export type D3BaseGraph<T = Record<string, unknown>> = {
    chartKey: string,
    containerSize: D3GraphContainer,
    data: T[],
    shape: ChartShape,
    spec?: D3GraphSpec
}

export type D3GraphSpec = {
    buildScale: (props: DynamicGraphProps) => DynamicGraphScale,

}

export type D3Selection<
    T extends BaseType = BaseType,
    D extends TransformedGraphData = TransformedGraphData
> = Selection<T | null, D[], null, undefined>;

export type ChartSize = {
    chartWidth: number,
    chartHeight: number,
} & Pick<D3GraphContainer, 'margin'>;

export type ChartSchema = {
    dataSchema: PrimitiveField,
    colorSchema: string[],
}

export type DynamicGraphProps = {
    data: BaseGraphData[],
    graphSvg: D3Selection<SVGGElement>
}

export type DynamicGraphScale = {
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number, never>,
    colorScale: ScaleOrdinal<string, string, never>
}