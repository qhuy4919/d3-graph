import { ChartShape, ChartSize } from "../model"
import { reduceData as defaultReduceData } from "./data"
import { buildStackedScale, buildGroupScale } from "./scale"
import { scaleOrdinal, ScaleOrdinal } from 'd3-scale';

export type useD3Dashboard<
    T extends Record<string, unknown>[],
> = {
    data: T,
    shape: ChartShape
} & ChartSize;

export const useD3Dashboard = <
    Data extends Record<string, unknown>[],
>({
    data,
    shape,
    ...rest
}: useD3Dashboard<Data>) => {
    const normalizeData = defaultReduceData(data, {
        amount: 'amount',
        color: 'bgcolor',
        type: 'type',
        period: 'period',
        subColor: 'subColor',
    });

    const colorSchema = [... new Set(normalizeData.map(x => x.color))];
    const colorScale = scaleOrdinal()
        .domain(normalizeData.map(d => d.type))
        .range(colorSchema) as ScaleOrdinal<string, string>;
    const defaultProps = {
        colorScale,
        normalizeData
    }

    switch (shape) {
        case 'stacked': {
            return {
                ...defaultProps,
                ...buildStackedScale({
                    betweenBarsPadding: 0.1,
                    colorSchema: colorSchema,
                    originalData: normalizeData,
                    ...rest
                })
            }
        }
        case 'group': {
            return {
                ...defaultProps,
                ...buildGroupScale({
                    betweenBarsPadding: 0.1,
                    colorSchema: colorSchema,
                    originalData: normalizeData,
                    ...rest
                })
            }
        }
        default: return defaultProps
    }
}