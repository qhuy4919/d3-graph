import { ChartSchema, ChartSize } from "../model"
import { reduceData } from "./data"
import { buildScale } from "./scale"

export type useD3Dashboard<ChartData> = {
    data: ChartData[]
} & ChartSchema & ChartSize
export const useD3Dashboard = <Data extends Record<string, unknown>>({
    data,
    dataSchema,
    colorSchema,

    chartHeight,
    chartWidth,
}: useD3Dashboard<Data>) => {
    const normalizeData = reduceData(data, dataSchema)
    const {
        colorScale,
        xScale,
        yScale
    } = buildScale({
        chartHeight,
        chartWidth,
        betweenBarsPadding: 0.1,
        colorSchema: colorSchema,
        originalData: normalizeData,
    });


    return {
        colorScale,
        xScale,
        yScale,
        normalizeData,
    }

}