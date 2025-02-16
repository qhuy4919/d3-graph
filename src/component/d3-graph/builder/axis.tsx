import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis'
import { ChartSize, D3AxisProps, D3BaseGraphData, D3Selection, DynamicAxisProps } from '../model';
import { getTextWidth } from '../util';
import { CSSVariableValue } from '@/lib-root/theme'
import { withDynamicSize } from '../../util';

const getDefaultXAxisPadding = () => ({ top: 50, left: 0, bottom: 50, right: 0 })
export const buildAxis = <Domain extends string | number>({
    scale,
    orientation,
    //
    ticks,
    tickPadding = 10,
    tickFormat: customFormat
}: DynamicAxisProps<Domain>) => {
    const normalizedFormat = customFormat ? customFormat : (d: Domain) => d.toString();
    const getAxisOrientation = ({
        orientation,
    }: Pick<DynamicAxisProps<Domain>, 'orientation'>) => {
        switch (orientation) {
            case 'bottom':
                return axisBottom;
            case 'top':
                return axisTop;
            case 'left':
                return axisLeft;
            case 'right':
                return axisRight
            default:
                throw new Error('Invalid axis orientation')
        }
    };

    return getAxisOrientation({ orientation })(scale)
        .tickArguments([ticks])
        .tickFormat(normalizedFormat)
        .tickPadding(tickPadding)
}

type DynamicGridLineProps<ScaleX extends string | number, ScaleY extends string | number> = {
    selection: D3Selection<SVGGElement>,
    //
    isHorizontal?: boolean
    //
} & Pick<D3AxisProps<ScaleX, ScaleY>, 'x' | 'y'> & ChartSize
export const drawGridLine = <DomainX extends string | number, DomainY extends string | number>({
    selection,
    isHorizontal = true,
    //
    x,
    y,
    //
    chartHeight,
    chartWidth
}: DynamicGridLineProps<DomainX, DomainY>) => {
    const xAxisPadding = getDefaultXAxisPadding();
    const { ticks: xTicks, scale: xScale } = x;
    const { ticks: yTicks, scale: yScale } = y;

    /* NOTE: AxisScale chưa hỗ trợ ticks, ... như Scale nên tạm thời ignore lỗi typing */
    if (isHorizontal) {
        selection.select('.grid-lines-group')
            .selectAll('line.horizontal-grid-line')
            .data(yScale.ticks(yTicks))
            .enter()
            .append('line')
            .attr('class', 'horizontal-grid-line')
            .attr('x1', (-xAxisPadding.left + 1))
            .attr('x2', chartWidth)
            .attr('y1', (d) => yScale(d))
            .attr('y2', (d) => yScale(d))
            .attr('stroke', 'grey')
            .style('opacity', 0.3)
            .attr('stroke-width', '1px');
    }
    else {
        selection.select('.grid-lines-group')
            .selectAll('line.vertical-grid-line')
            .data(xScale.ticks(xTicks))
            .enter()
            .append('line')
            .attr('class', 'vertical-grid-line')
            .attr('y1', 0)
            .attr('y2', chartHeight)
            .attr('x1', (d) => xScale(d))
            .attr('x2', (d) => xScale(d))
            .attr('stroke', 'grey')
            .style('opacity', 0.3)
            .attr('stroke-width', '1px');;
    }

    return selection;
};

type DrawAxis<DomainX extends string | number, DomainY extends string | number> = {
    selection: D3Selection<SVGGElement>,
    isHorizontal?: boolean,
    data: D3BaseGraphData[]
} & D3AxisProps<DomainX, DomainY> & ChartSize
export const drawAxis = <DomainX extends string | number, DomainY extends string | number>(
    props: DrawAxis<DomainX, DomainY>
) => {
    const {
        selection,
        chartHeight,
        chartWidth,
        margin,
        data,
        x,
        y,
    } = props;
    const xAxisPadding = getDefaultXAxisPadding();
    const xAxis = buildAxis<DomainX>(x);
    const yAxis = buildAxis<DomainY>(y);

    const {
        axisLabel: xLabel = '',
        ...xRest
    } = x;
    const {
        axisLabel: yLabel = '',
        ...yRest
    } = y;
    const xLabelWidth = getTextWidth(xLabel);
    const yLabelWidth = getTextWidth(yLabel);
    const {
        fontSize,
    } = withDynamicSize(data, chartWidth, false);

    selection.select('.x-axis-group')
        .append('text')
        .text(xLabel)
        .classed('x-axis-label', true)
        .attr(
            'transform',
            `translate(
            ${chartWidth / 2 - xLabelWidth / 2}, 
            ${chartHeight + (margin.top + margin.bottom) / 2})` // 16 is font size text
        );

    selection.select<SVGGElement>('.x-axis-group .axis.x')
        .attr('transform', `translate(0, ${chartHeight + 8})`) // 8 is offset which make x axis doesn't overlap grid line
        .call((d) => xAxis(d))
        .style('font-family', CSSVariableValue.fontFamily.base)
        .style('font-weight', xRest?.tickLabelFontWeight ?? 'normal')
        .style('font-size', xRest?.tickLabelFontSize ?? fontSize)

    selection.select('.x-axis-group')
        .append('g')
        .classed('x-axis-label-wrapper', true)
        .attr('transform', `translate(${-margin?.left - fontSize}, ${chartHeight / 2 + yLabelWidth / 2})`)

        .append('text')
        .text(yLabel)
        .classed('y-axis-label', true)
        .attr('transform', "rotate(-90)")


    selection.select<SVGGElement>('.y-axis-group.axis')
        .attr('transform', `translate(${xAxisPadding.left}, 0)`)
        .call((d) => yAxis(d))
        .style('font-family', CSSVariableValue.fontFamily.base)
        .style('font-weight', yRest?.tickLabelFontWeight ?? 'normal')
        .style('font-size', yRest?.tickLabelFontSize ?? fontSize)

    drawGridLine({
        ...props
    });
}