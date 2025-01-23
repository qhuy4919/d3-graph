import { useEffect, useRef } from "react";
import { BaseType, select } from "d3-selection";
import * as d3Array from 'd3-array';
import { validateContainer } from "../util";
import { D3BaseGraph, D3Selection } from "../model";

const PERIOD_FIELD = 'date'
const AMOUNT_FIELD = 'value';
const TYPE_FIELD = 'stack';

type BaseGraphData = {
    value: number,
    type: string,
    name: string,
    total?: number,
    dataKey: string,
    dataList: BaseGraphData[],
}

export const GraphBuilder = <
    ChartData extends Record<string, any>
>({
    containerSize,
    data
}: D3BaseGraph<ChartData>) => {
    const { height = 500, width = 1000 } = containerSize;
    const graphRef = useRef<HTMLDivElement>(null);

    function reduceData(data: ChartData[]) {
        return data.reduce((acc: BaseGraphData[], d: ChartData) => {
            return [
                ...acc,
                {
                    value: parseInt(d[AMOUNT_FIELD]),
                    type: d[TYPE_FIELD],
                    name: d[PERIOD_FIELD],
                }
            ]
        }, []);
    };

    function transformedData(data: BaseGraphData[]) {
        return d3Array.groups(data, d => d.name).reduce(
            (acc: BaseGraphData[], d: [string, BaseGraphData[]]) => {
                const newEntry: BaseGraphData = {
                    dataKey: d[0],
                    dataList: d3Array.map(d[1], (v: BaseGraphData) => v.value)
                };

                (d?.[1] ?? []).forEach((entry) => {
                    newEntry[entry.type] = entry.value

                });

                return [
                    ...acc,
                    newEntry
                ]
            }, []);
    }

    function buildDataShape() {

    }

    function buildSvg(container: BaseType) {
        const svg = select(container)
            .append('svg')
            .classed('d3-graph', true)


        svg.attr('width', width)
        svg.attr('height', height)

    };

    function buildGraph(selection: D3Selection<HTMLDivElement, ChartData>) {
        selection.each((data) => {
            const _data = transformedData(reduceData(data));
            console.log('_data', _data)
        })
    }

    useEffect(() => {
        const container = select(graphRef.current);
        validateContainer(container);
        container.datum(data).call(buildGraph)

    }, []);


    return <div ref={graphRef} className='graph-container'></div>;
}