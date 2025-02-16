import * as d3Scale from 'd3-scale';
import { ChartSize, D3BaseGraphData } from "../model";
import { getMax, getTextWidth } from "../util";
import { transformData } from './data';
import { ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { max as d3Max } from 'd3-array';
import { select } from 'd3-selection';

type DynamicScaleProps = {
    betweenBarsPadding?: number
    betweenGroupsPadding?: number
}
type BuildScale = {
    colorSchema: string[],
    data: D3BaseGraphData[];
    //

} & DynamicScaleProps & ChartSize;

type StackedScale = {
    isHorizontal: boolean,

} & BuildScale

export const buildStackedScale = ({
    data,
    chartWidth,
    chartHeight,
    margin,
    colorSchema,
    isHorizontal,
    betweenBarsPadding = 0.1,
}: StackedScale) => {
    const transformedData = transformData(data, 'period');
    const maxTick = getMax(new Set<number>(
        transformedData.map(x => x._total ?? 0)
    ));
    const maxWidthTickLabel = d3Max(
        transformedData.map(x => getTextWidth(x.dataKey) ?? 0)
    ) ?? 0;

    function adjustChartByLabel() {
        select('.container-group')
            .attr('transform', `translate(${margin?.left + margin?.right + maxWidthTickLabel / 2},${margin?.top})`);
    };
    // adjustChartByLabel();


    if (isHorizontal) {
        return {
            xScale: d3Scale.scaleBand()
                .domain(data.map(d => d.period))
                .rangeRound([0, chartWidth])
                .padding(betweenBarsPadding),
            yScale: d3Scale.scaleLinear()
                .domain([0, maxTick])
                .rangeRound([chartHeight, 0])
                .nice(),
            colorScale: scaleOrdinal()
                .domain(data.map(d => d.type))
                .range(colorSchema) as ScaleOrdinal<string, string>
        }
    }

    return {
        xScale: d3Scale.scaleLinear()
            .domain([0, maxTick])
            .rangeRound([0, chartWidth])
            .nice(),
        yScale: d3Scale.scaleBand()
            .domain(data.map(d => d.period))
            .rangeRound([0, chartHeight])
            .padding(betweenBarsPadding),
        colorScale: scaleOrdinal()
            .domain(data.map(d => d.type))
            .range(colorSchema) as ScaleOrdinal<string, string>
    }


};

export const buildGroupScale = ({
    data,
    chartWidth,
    chartHeight,
    colorSchema,
    betweenBarsPadding = 0.1,
}: BuildScale) => {
    const maxTick = getMax(new Set<number>(
        data.map(x => x.amount ?? 0)
    ));

    const xScale = d3Scale.scaleBand()
        .domain(data.map(d => d.period))
        .rangeRound([0, chartWidth])
        .padding(betweenBarsPadding);

    const x2Scale = d3Scale.scaleBand()
        .domain(data.map(d => d.type))
        .rangeRound([0, xScale.bandwidth()]);

    const yScale = d3Scale.scaleLinear()
        .domain([0, maxTick])
        .rangeRound([chartHeight, 0])
        .nice();

    const colorScale = scaleOrdinal()
        .domain(data.map(d => d.type))
        .range(colorSchema) as ScaleOrdinal<string, string>;

    return {
        xScale,
        x2Scale,
        yScale,
        colorScale
    }
};

export const buildPieScale = ({
    data,
    colorSchema,
}: BuildScale) => {
    const colorScale = scaleOrdinal()
        .domain(data.map(d => d.type))
        .range(colorSchema) as ScaleOrdinal<string, string>;

    return {
        colorScale
    };
}