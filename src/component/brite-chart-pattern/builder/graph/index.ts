import { ChartShape, ChartSize, DynamicGraphProps, DynamicGraphScale } from '../../model'
import { drawAxis, drawGridLine } from '../axis';
import { drawStackBar } from './bar-graph';
import { drawPie } from './pie-graph';

export type DrawGraph = {
    shape: ChartShape,
} & ChartSize & DynamicGraphProps & DynamicGraphScale
export const drawGraph = ({
    shape,
    graphSvg,
    data,
    chartHeight,
    chartWidth,
    //
    yScale,
    xScale,
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
            });

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
        default:
            throw new Error('Unsupported chart shape')
    }
}