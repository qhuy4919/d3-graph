// import { DefaultGraphColorSchema } from "@gotecq/theme";
import { D3BaseGraphData, ChartShape, D3DataSchema, TransformedGraphData } from "../model";
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';

export function reduceData<ChartData extends Record<string, any>>(data: ChartData[], dataSchema: D3DataSchema) {
    const {
        period,
        type,
        amount,
        color,
        subColor
    } = dataSchema
    return data.reduce((acc: D3BaseGraphData[], d: ChartData, i) => {
        return [
            ...acc,
            {
                amount: parseInt(d[amount]),
                type: d[type],
                period: d[period],
                color: d[color],
                subColor: subColor ? d[subColor] : undefined,
                ...d,
            }
        ]
    }, []);
};

export function transformData(data: D3BaseGraphData[], groupBy: keyof D3BaseGraphData) {
    return d3Array.groups(data ?? [], d => d[groupBy]).reduce(
        (acc: TransformedGraphData[], d: [string, D3BaseGraphData[]]) => {
            let total = 0;

            const newEntry = {} as TransformedGraphData;

            (d?.[1] ?? []).forEach((entry) => {
                if (typeof entry.type === 'string')
                    newEntry[entry.type] = entry
                total += entry.amount;

            });
            newEntry.dataKey = d[0];
            newEntry['_total'] = total;

            return [
                ...acc,
                newEntry
            ]
        }, []);
}

export function buildDataShape<Shape extends ChartShape>(
    shape: Shape,
    originalData: D3BaseGraphData[],
    transformedData: TransformedGraphData[]) {
    switch (shape) {
        case 'stacked': {
            const stackList = [...new Set(originalData.map(x => x.type))];
            const stackBar = d3Shape.stack<TransformedGraphData, string>().keys(stackList)
                .value((d, k) => d?.[k]?.amount ?? 0);
            return stackBar(transformedData)
        }
        case 'group': {
            return transformedData
        }
        case 'pie': {
            const pie = d3Shape.pie<TransformedGraphData>().value(d => d._total ?? 0);
            return pie(transformedData)
        }

    }

}