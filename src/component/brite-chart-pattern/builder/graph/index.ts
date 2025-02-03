import { D3AxisProps, ChartShape, ChartSize, D3Dispatcher, DynamicGraphProps, DynamicGraphScale } from '../../model'
import { drawAxis } from '../axis';
import { drawGroupBar, drawStackBar } from './bar-graph';
import { drawMarker, highlightMarker } from './marker';
import { drawPie } from './pie-graph';
export type DrawGraph = {
    shape: ChartShape,
    dispatcher: D3Dispatcher,
    axisProps?: Partial<D3AxisProps>
} & ChartSize & DynamicGraphProps & DynamicGraphScale
export const drawGraph = ({
    shape,
    graphSvg,
    data,
    chartHeight,
    chartWidth,
    //
    dispatcher,
    //
    yScale,
    xScale,
    x2Scale,
    colorScale,
    //
    axisProps
}: DrawGraph) => {

    switch (shape) {
        case 'stack': {
            drawAxis({
                chartHeight,
                chartWidth,
                selection: graphSvg,
                x: {
                    scale: xScale,
                    axisLabel: 'x-axis',
                    axisLabelOffset: -10,
                    ticks: 5,
                    tickTextOffset: 10,
                    ...axisProps?.x
                },
                y: {
                    scale: yScale,
                    axisLabel: 'y-axis',
                    axisLabelOffset: 10,
                    ticks: 5,
                    tickTextOffset: 10,
                    ...axisProps?.y

                }
            })
            drawStackBar({
                selection: graphSvg,
                originalData: data,
                colorScale,
                xScale,
                yScale,
                x2Scale,
            });
            const markerSelection = drawMarker({
                graphSvg,
                chartHeight,
                chartWidth,
            })

            dispatcher.on('chartMouseOver', (d, type) => {
                const normalizeY = yScale(d[1])
                const normalizeX = (xScale(d.data.dataKey) ?? 0) + xScale.bandwidth() / 2;
                const color = colorScale(type)
                highlightMarker(markerSelection, [0, normalizeY], color);
            })
            dispatcher.on('chartMouseOut', () => {
                highlightMarker(markerSelection, [99999, 99999]);
            })
            dispatcher.on('chartClick', () => {
                console.log("🚀 ~ dispatcher.on ~ chartClick:");

            })
            return;
        }
        case 'pie': {
            drawPie({
                selection: graphSvg,
                originalData: data,
                colorScale,
                chartHeight,
                chartWidth,
            })
            return;
        }
        case 'group': {
            drawAxis({
                chartHeight,
                chartWidth,
                selection: graphSvg,
                x: {
                    scale: xScale,
                    axisLabel: 'x-axis',
                    axisLabelOffset: -10,
                    ticks: 5,
                    tickTextOffset: 10,
                    ...axisProps?.x
                },
                y: {
                    scale: yScale,
                    axisLabel: 'y-axis',
                    axisLabelOffset: 10,
                    ticks: 5,
                    tickTextOffset: 10,
                    ...axisProps?.y
                }
            })
            drawGroupBar({
                selection: graphSvg,
                originalData: data,
                colorScale,
                xScale,
                x2Scale,
                yScale,
            });

            return;
        }
        default:
            throw new Error('Unsupported chart shape')
    }
}