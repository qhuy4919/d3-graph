import { ChartShape, ChartSize, D3Dispatcher, DynamicGraphProps, DynamicGraphScale } from '../../model'
import { drawAxis, drawGridLine } from '../axis';
import { drawGroupBar, drawStackBar } from './bar-graph';
import { drawMarker, highlightMarker } from './marker';
import { drawPie } from './pie-graph';
export type DrawGraph = {
    shape: ChartShape,
    dispatcher: D3Dispatcher
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
}: DrawGraph) => {

    switch (shape) {
        case 'stack': {
            drawGridLine({
                chartSize: {
                    chartHeight: chartHeight,
                    chartWidth: chartWidth,
                },
                scale: yScale,
                selection: graphSvg,
                isHorizontal: true,
                yTicks: 5,
                xTicks: 5,
            });
            drawAxis({
                chartSize: {
                    chartHeight: chartHeight,
                    chartWidth: chartWidth,
                },
                selection: graphSvg,
                xScale,
                yScale
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

            dispatcher.on('chartMouseOver', (d) => {
                const normalizeY = yScale(d[1])
                const normalizeX = (xScale(d.data.dataKey) ?? 0) + xScale.bandwidth() / 2;
                highlightMarker(markerSelection, [normalizeX, normalizeY]);
            })
            dispatcher.on('chartMouseOut', () => {
                highlightMarker(markerSelection, [99999, 99999]);
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
            drawGridLine({
                chartSize: {
                    chartHeight: chartHeight,
                    chartWidth: chartWidth,
                },
                scale: yScale,
                selection: graphSvg,
                isHorizontal: true,
                yTicks: 5,
                xTicks: 5,
            });
            drawAxis({
                chartSize: {
                    chartHeight: chartHeight,
                    chartWidth: chartWidth,
                },
                selection: graphSvg,
                xScale,
                yScale
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