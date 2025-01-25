import * as d3Scale from 'd3-scale';
import { BaseGraphData, TransformedGraphData } from "../model";
import { getMax } from "../util";

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
    // x: {
    //     type: ScaleType,
    //     Scale: Scale<number, number>
    // },
    // y: {
    //     type: ScaleType,
    //     Scale: Scale<string, string>
    // },
    // color: {
    //     type: ScaleType,
    //     Scale: Scale<string, string>
    // },

    //
    colorSchema: string[],

    transformedData: TransformedGraphData[]
    originalData: BaseGraphData[];

    //
    chartWidth: number
    chartHeight: number
} & DynamicScaleProps

export const buildScale = ({
    transformedData,
    originalData,

    colorSchema,

    chartWidth,
    chartHeight,

    betweenBarsPadding = 0.1,
}: BuildScale) => {
    const maxTick = getMax(new Set<number>(transformedData.map(x => x.total ?? 0)));
    const xScale = d3Scale.scaleBand()
        .domain(originalData.map(d => d.name))
        .rangeRound([0, chartWidth])
        .padding(betweenBarsPadding);

    const yScale = d3Scale.scaleLinear()
        .domain([0, maxTick])
        .rangeRound([chartHeight, 0])
        .nice();

    const colorScale = d3Scale.scaleOrdinal()
        .domain(originalData.map(d => d.type))
        .range(colorSchema) as d3Scale.ScaleOrdinal<string, string>;

    return {
        xScale,
        yScale,
        colorScale,
    }

}