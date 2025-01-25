import { BaseGraphData, DataPrimaryField, TransformedGraphData } from "../model";
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';




export function reduceData<ChartData extends Record<string, any>>(data: ChartData[], dataSchema: DataPrimaryField) {
    const {
        nameLabel,
        stackLabel,
        valueLabel
    } = dataSchema
    return data.reduce((acc: BaseGraphData[], d: ChartData) => {
        return [
            ...acc,
            {
                value: parseInt(d[valueLabel]),
                type: d[stackLabel],
                name: d[nameLabel],
            }
        ]
    }, []);
};

export function transformData(data: BaseGraphData[]) {
    return d3Array.groups(data, d => d.name).reduce(
        (acc: TransformedGraphData[], d: [string, BaseGraphData[]]) => {
            let total = 0;
            const newEntry: TransformedGraphData = {
                dataKey: d[0],
                dataList: d3Array.map(d[1], (v: BaseGraphData) => v)
            };

            (d?.[1] ?? []).forEach((entry) => {
                if (typeof entry.type === 'string')
                    newEntry[entry.type] = entry.value
                total += entry.value;

            });

            newEntry['total'] = total;

            return [
                ...acc,
                newEntry
            ]
        }, []);
}

export function buildDataShape(transformedData: TransformedGraphData[], stackList: string[]) {
    const stackBar = d3Shape.stack<TransformedGraphData, string>().keys(stackList)
        .value((d, k) => d[k]);

    return stackBar(transformedData)
}