import { BaseGraphData, ChartShape, PrimitiveField, TransformedGraphData } from "../model";
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';

export function reduceData<ChartData extends Record<string, any>>(data: ChartData[], dataSchema: PrimitiveField) {
    const {
        name,
        type,
        value
    } = dataSchema
    return data.reduce((acc: BaseGraphData[], d: ChartData) => {
        return [
            ...acc,
            {
                value: parseInt(d[value]),
                type: d[type],
                name: d[name],
            }
        ]
    }, []);
};

export function transformData(data: BaseGraphData[], groupBy: keyof BaseGraphData) {
    return d3Array.groups(data, d => d[groupBy]).reduce(
        (acc: TransformedGraphData[], d: [string, BaseGraphData[]]) => {
            let total = 0;
            const newEntry: TransformedGraphData = {};

            (d?.[1] ?? []).forEach((entry) => {
                if (typeof entry.type === 'string')
                    newEntry[entry.type] = entry
                total += parseInt(entry.value.toString());

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
    originalData: BaseGraphData[],
    transformedData: TransformedGraphData[]) {
    switch (shape) {
        case 'stack': {
            const stackList = [...new Set(originalData.map(x => x.type))];
            const stackBar = d3Shape.stack<TransformedGraphData, string>().keys(stackList)
                .value((d, k) => d?.[k]?.value as number ?? 0);
            return stackBar(transformedData)
        }
        case 'pie': {
            const pie = d3Shape.pie<TransformedGraphData>().value(d => d._total ?? 0);
            return pie(transformedData)
        }

    }

}