import { ScaleBand, ScaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis'
import { ChartSize, D3Selection } from '../model';

export type DynamicAxisProps = {
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>,
    xAxisLabel?: string,
    yAxisLabel?: string,
    xAxisLabelOffset?: number,
    yAxisLabelOffset?: number,
    yTicks?: number,
    xTicks?: number,
    yTickTextYOffset?: number,
    yTickTextXOffset?: number,


    //
    chartSize: ChartSize
};

const getDefaultXAxisPadding = () => ({ top: 0, left: 0, bottom: 0, right: 0 })
export const buildAxis = ({
    xScale,
    yScale,
    yTicks = 5,
    xTicks = 5,
}: DynamicAxisProps) => {
    return {
        xAxis: axisBottom(xScale).ticks(xTicks),
        yAxis: axisLeft(yScale).ticks(yTicks),
    }
}

type DynamicGridLineProps = {
    scale: ScaleLinear<number, number>
    selection: D3Selection<SVGGElement>,
    //
    isHorizontal?: boolean
    //
} & Pick<DynamicAxisProps, 'yTicks' | 'xTicks' | 'chartSize'>
export const drawGridLine = ({

    scale,
    selection,
    isHorizontal = true,
    //
    yTicks,
    xTicks,
    //
    chartSize
}: DynamicGridLineProps) => {
    const xAxisPadding = getDefaultXAxisPadding();
    const { chartHeight, chartWidth } = chartSize

    if (isHorizontal) {
        selection.select('.grid-lines-group')
            .selectAll('line.horizontal-grid-line')
            .data(scale.ticks(yTicks).slice(1))
            .enter()
            .append('line')
            .attr('class', 'horizontal-grid-line')
            .attr('x1', (-xAxisPadding.left + 1))
            .attr('x2', chartWidth)
            .attr('y1', (d) => scale(d))
            .attr('y2', (d) => scale(d))
            .attr('stroke', 'grey')
            .attr('stroke-width', '1px');
    }
    else {
        selection.select('.grid-lines-group')
            .selectAll('line.vertical-grid-line')
            .data(scale.ticks(xTicks).slice(1))
            .enter()
            .append('line')
            .attr('class', 'vertical-grid-line')
            .attr('y1', 0)
            .attr('y2', chartHeight)
            .attr('x1', (d) => scale(d))
            .attr('x2', (d) => scale(d))
            .attr('stroke', 'grey')
            .attr('stroke-width', '1px');;
    }

    return selection;
};

type DrawAxis = {
    selection: D3Selection<SVGGElement>,
} & DynamicAxisProps
export const drawAxis = ({
    selection,
    xScale,
    yScale,
    chartSize,
}: DrawAxis) => {
    const xAxisPadding = getDefaultXAxisPadding();
    const { chartHeight } = chartSize;
    const { xAxis, yAxis } = buildAxis({ xScale, yScale, chartSize })

    selection.select<SVGGElement>('.x-axis-group .axis.x')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call((d) => xAxis(d))

    selection.select<SVGGElement>('.y-axis-group.axis')
        .attr('transform', `translate(${-xAxisPadding.left}, 0)`)
        .call((d) => yAxis(d))
}