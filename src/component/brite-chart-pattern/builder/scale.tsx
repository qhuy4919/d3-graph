import * as d3Scale from 'd3-scale';
import { BaseGraphData, ChartShape } from "../model";
import { getMax } from "../util";
import { transformData } from './data';

// type ScaleType = 'band' | 'ordinal' | 'utc' | 'linear';
// type Scale<In, Out> = {
//     (input?: In): Out,
//     range?: () => Out,
//     domain?: () => In[],

// };
type DynamicScaleProps = {
    betweenBarsPadding?: number
    betweenGroupsPadding?: number
}
type BuildScale = {
    shape: ChartShape

    //
    colorSchema: string[],
    originalData: BaseGraphData[];
    //
    chartWidth: number
    chartHeight: number
} & DynamicScaleProps

export const buildScale = ({
    shape,
    originalData,

    colorSchema,

    chartWidth,
    chartHeight,

    betweenBarsPadding = 0.1,


}: BuildScale) => {
    const transformedData = transformData(originalData, 'period');
    const maxTick = getMax(new Set<number>(
        shape === 'stack'
            ? transformedData.map(x => x._total ?? 0)
            : originalData.map(x => x.amount ?? 0)
    ));

    const xScale = d3Scale.scaleBand()
        .domain(originalData.map(d => d.period))
        .rangeRound([0, chartWidth])
        .padding(betweenBarsPadding);

    const x2Scale = d3Scale.scaleBand()
        .domain(originalData.map(d => d.type))
        .rangeRound([0, xScale.bandwidth()]);

    const yScale = d3Scale.scaleLinear()
        .domain([0, maxTick])
        .rangeRound([chartHeight, 0])
        .nice();

    const colorScale = d3Scale.scaleOrdinal()
        .domain(originalData.map(d => d.type))
        .range(colorSchema) as d3Scale.ScaleOrdinal<string, string>;

    return {
        xScale,
        x2Scale,
        yScale,
        colorScale,
    }

}