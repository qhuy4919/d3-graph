import { ScaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis'
import { AxisProps, D3Selection } from '../model';

const getDefaultXAxisPadding = () => ({ top: 0, left: 0, bottom: 0, right: 0 })
export const buildAxis = ({
    x, y

}: AxisProps) => {
    const { ticks: xTicks, scale: xScale } = x;
    const { ticks: yTicks, scale: yScale } = y;

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
} & Pick<AxisProps, 'chartSize' | 'x' | 'y'>
export const drawGridLine = ({

    scale,
    selection,
    isHorizontal = true,
    //
    x,
    y,
    //
    chartSize
}: DynamicGridLineProps) => {
    const xAxisPadding = getDefaultXAxisPadding();
    const { ticks: xTicks } = x;
    const { ticks: yTicks } = y;
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
} & AxisProps
export const drawAxis = ({
    selection,
    ...rest
}: DrawAxis) => {
    const { chartSize, y } = rest;
    const xAxisPadding = getDefaultXAxisPadding();
    const { chartHeight } = chartSize;
    const { xAxis, yAxis } = buildAxis(rest)

    selection.select<SVGGElement>('.x-axis-group .axis.x')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call((d) => xAxis(d))

    selection.select<SVGGElement>('.y-axis-group.axis')
        .attr('transform', `translate(${-xAxisPadding.left}, 0)`)
        .call((d) => yAxis(d));

    drawGridLine({
        scale: y.scale,
        selection,
        isHorizontal: true,
        ...rest
    });
}