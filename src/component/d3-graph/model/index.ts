import { SignalListener } from '@gotecq/base-graph/model';
import { DynamicAxisProps } from './axis';
import { ChartShape, D3GraphContainer, ChartSize, D3BaseGraphData, TransformedGraphData } from './base';
import { D3Selection } from './selection';
import { D3ScaleOrdinal } from './scale';
import { D3Dispatcher, D3EventListeners } from './event';
import { DynamicLegendProps } from './legend';

export * from './base';
export * from './event';
export * from './axis';
export * from './selection';
export * from './scale';
export * from './legend';
export * from './constant';

export type D3BaseGraph<T extends Record<string, unknown>> = {
    containerSize: D3GraphContainer,
    data: T[],
    signalListener?: Record<string, SignalListener>
    spec: D3GraphSpec<T>
}

export type D3GraphBuilder<
    T extends Record<string, unknown>,
> = {
    graphSelection: D3Selection<SVGGElement>,
    dispatcher: D3Dispatcher,
    signalListener?: Record<string, SignalListener>,
    tooltipEvent?: D3EventListeners<D3BaseGraphData>
    data: T[],
} & ChartSize & Omit<D3GraphSpec<T>, 'builder' | 'tooltip'>;

export type D3BuilderReturn = {
    shape: ChartShape,
    normalizeData: D3BaseGraphData[],
    colorScale: D3ScaleOrdinal,
    graphSelection: D3Selection<SVGGElement>
}

export type D3DynamicTooltip<ChartData extends Record<string, unknown>> = {
    header: (d: ChartData) => string,
    content: (d: ChartData) => string;

}

export type D3GraphSpec<T extends Record<string, unknown>> = {
    className?: string,
    builder: (props: D3GraphBuilder<T>) => D3BuilderReturn
    axis?: {
        x?: Omit<DynamicAxisProps<any>, 'scale' | 'orientation'>
        y?: Omit<DynamicAxisProps<any>, 'scale' | 'orientation'>
    }
    tooltip?: D3DynamicTooltip<T>,
    legend?: Partial<Omit<DynamicLegendProps, 'selection'>>
}