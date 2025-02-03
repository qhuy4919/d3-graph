import { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';
import { BaseType, Selection } from 'd3-selection';
import { Stack } from 'd3-shape';
import { Dispatch } from 'd3-dispatch';

export type PrimitiveField = {
    amount: number,
    type: string,
    period: string,
    color: string,
    subColor?: string,
}
export type BaseGraphData = {
    [key: string]: any,
} & PrimitiveField;

export type TransformedGraphData = {
    _total?: number,
    dataKey?: string,
} & Partial<Record<string, BaseGraphData>>;

export type StackData<D, K> = Stack<any, D, K>
export type ChartShape = 'stack' | 'pie' | 'group'

export type D3GraphContainer = {
    width: number,
    height: number,
    margin?: { top: number, right: number, bottom: number, left: number },
}

export type D3BaseGraph<T = Record<string, unknown>> = {
    chartKey: string,
    containerSize: D3GraphContainer,
    data: T[],
    spec: D3GraphSpec<T>
}

export type D3DataSchema = {
    amount: string,
    type: string,
    period: string,
    color: string,
    subColor?: string,
}
export type D3GraphSpec<Data> = {
    shape: ChartShape,
    reduceData?: (data: Data[]) => BaseGraphData[]
    buildScale?: (props: DynamicGraphProps) => DynamicGraphScale,
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
    dataSchema: D3DataSchema,
    colorSchema: string[],
}

export type DynamicGraphProps = {
    data: BaseGraphData[],
    graphSvg: D3Selection<SVGGElement>
}

export type DynamicGraphScale = {
    xScale: ScaleBand<string>,
    x2Scale: ScaleBand<string>
    yScale: ScaleLinear<number, number, never>,
    colorScale: ScaleOrdinal<string, string, never>
}

export type D3Dispatcher = Dispatch<object>;


export type MouseEventCallBack = (
    e: any,
    d: [any] | unknown,
) => void;
export type OnMouseOverEvent = (
    e: any,
    d: TransformedGraphData | unknown,
    key: string,
) => void

export type D3MouseEvent = {
    selection: D3Selection<SVGGElement>,
    selectionElement: string
    //
    //
    onMouseOver?: OnMouseOverEvent,
    onMouseOut?: MouseEventCallBack,
    onMouseMove?: MouseEventCallBack
    onClick?: MouseEventCallBack,
}