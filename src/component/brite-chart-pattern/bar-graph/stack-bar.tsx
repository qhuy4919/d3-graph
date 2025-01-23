import data from './data.json';
import { useEffect, useRef } from 'react';
import { stackBarBuilder } from './builder';
import { Datum } from '../model';
import { D3Legend } from '../legend';
import { D3Tooltip } from '../tooltip';

export type D3GraphProps = {
    data?: Datum[],
    chartName: string,
    aspectRatio?: number,
    betweenBarsPadding?: number,
    colorSchema?: string[],
    exportChart?: () => void,
    grid?: string,
    hasPercentage?: boolean,
    hasReversedStacks?: boolean,
    height?: number,
    isAnimated?: boolean,
    isHorizontal?: boolean,
    loadingState?: boolean,
    locale?: string,
    margin?: boolean,
    nameLabel?: string,
    nameLabelFormat?: string,
    percentageAxisToMaxRatio?: number,
    shouldShowLoadingState?: boolean,
    stackLabel?: string,
    tooltipThreshold?: number,
    valueLabel?: string,
    valueLabelFormat?: string,
    width?: number,
    xTicks?: number,
    yAxisLabel?: string,
    yAxisLabelOffset?: number,
    yTicks?: number,
    customMouseOver?: () => void,
    customMouseMove?: () => void,
    customMouseOut?: () => void,
    chart?: unknown,
    createTooltip?: unknown,
}
export const BarChart = ({
    chartName
}: D3GraphProps) => {
    const rootNode = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<any>(null);
    const stackBar = stackBarBuilder();

    const createChart = (): void => {
        chartInstance.current = stackBar.create(
            rootNode.current,
            data,
            {}
        )
    }

    const updateChart = (): void => {
        if (rootNode.current && chartInstance.current) {
            stackBar.update(
                rootNode.current,
                data,
                {},
                chartInstance.current
            );

            console.log(stackBar.update(
                rootNode.current,
                data,
                {},
                chartInstance.current
            ));
        }
    }

    useEffect(() => {
        if (data) {
            createChart();
        }

        return () => {
            stackBar.destroy();
        }
    }, []);


    useEffect(() => {
        if (!chartInstance.current) {
            createChart();
        }
        else {
            updateChart();
        }

        return () => {
            stackBar.destroy();
        }
    }, [data])


    useEffect(() => {
        // const groupBarBuilder = new stackedBarSpec(1000);
        // const testDataSet = data;
        // if (testDataSet) {
        //     container.append('p')
        //         .text('huhuhuhu')
        // }

        // container.datum(testDataSet).call(groupBarBuilder.build);

    })

    return <>
        <div ref={rootNode}
            className={`group-bar-chart ${chartName}`}
        >
        </div>
        <D3Legend
            data={data}
            dataSchema={{
                nameLabel: 'name',
                stackLabel: 'stack',
                valueLabel: 'value',
            }}
        />
        <D3Tooltip
            data={data}
            dataSchema={{
                nameLabel: 'name',
                stackLabel: 'stack',
                valueLabel: 'value',
            }}

        />
    </>
}