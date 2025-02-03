import { ChartShape, ChartSize, D3GraphSpec } from "../model"
import { reduceData as defaultReduceData } from "./data"
import { buildScale } from "./scale"
// import { colorSchema as defaultColorSchema } from "../color";

export type useD3Dashboard<ChartData> = {
    data: ChartData[],
    shape: ChartShape,
} & D3GraphSpec<ChartData> & ChartSize;
export const useD3Dashboard = <Data extends Record<string, unknown>>({
    data,
    shape,
    chartHeight,
    chartWidth,
    reduceData,
}: useD3Dashboard<Data>) => {
    const normalizeData = reduceData?.(data) ?? defaultReduceData(data, {
        amount: 'amount',
        color: 'bgcolor',
        type: 'type',
        period: 'period',
        subColor: 'subColor',
    });

    const colorSchema = [... new Set(normalizeData.map(x => x.color))]
    const legendList = [... new Set(normalizeData.map(x => x.type))];

    const {
        colorScale,
        xScale,
        x2Scale,
        yScale
    } = buildScale({
        shape,
        chartHeight,
        chartWidth,
        betweenBarsPadding: 0.1,
        colorSchema: colorSchema,
        originalData: normalizeData,
    });


    return {
        colorScale,
        xScale,
        x2Scale,
        yScale,
        normalizeData,
        legendList
    }

}