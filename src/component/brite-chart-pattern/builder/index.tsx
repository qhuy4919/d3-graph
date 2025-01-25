import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import * as d3Dispatcher from 'd3-dispatch';
import { validateContainer } from "../util";
import { D3BaseGraph, D3Selection } from "../model";
import { colorSchema } from "../color";
import { buildScale } from "./scale";
import { drawAxis, drawGridLine } from "./axis";
import { drawStackBar } from "./graph/bar-graph";
import { buildGraphStructure, buildLegendStructure, buildSvg } from "./svg";
import { buildMouseEvent } from "./event";
import { buildDataShape, reduceData, transformData } from "./data-transformation";
import { buildLegend } from "./legend";
import styled from "styled-components";

const StyledGraphContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
`;

const PERIOD_FIELD = 'date'
const AMOUNT_FIELD = 'value';
const TYPE_FIELD = 'stack';

export const GraphBuilder = <
    ChartData extends Record<string, any>
>({
    containerSize,
    data
}: D3BaseGraph<ChartData>) => {
    const { height = 500, width = 1000, margin: customMargin } = containerSize;
    const margin = {
        top: customMargin?.top ?? 40,
        right: customMargin?.right ?? 30,
        bottom: customMargin?.bottom ?? 60,
        left: customMargin?.left ?? 70
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const graphRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const stackList: string[] = [...new Set(data.map(d => d[TYPE_FIELD]))];

    const dispatcher = d3Dispatcher.dispatch(
        'customMouseOver',
        'customMouseOut',
        'customMouseMove',
        'customClick'
    );

    const dataSchema = {
        nameLabel: PERIOD_FIELD,
        stackLabel: TYPE_FIELD,
        valueLabel: AMOUNT_FIELD
    }



    function buildGraph(selection: D3Selection<HTMLDivElement, ChartData>) {
        selection.each((data) => {
            const graphSvg = buildSvg({
                container: graphRef.current,
                containerProps: {
                    width: width,
                    height: height,
                    margin: margin,
                    key: 'stack-chart'
                },
                childElement: buildGraphStructure
            });

            const legendSvg = buildSvg({
                container: legendRef.current,
                containerProps: {
                    width: width,
                    height: 100,
                    margin: margin,
                    key: 'graph-legend'
                },
                childElement: buildLegendStructure
            })

            const normalizeData = reduceData(data, dataSchema)
            const transformedData = transformData(normalizeData);
            const layers = buildDataShape(transformedData, stackList);
            const {
                colorScale,
                xScale,
                yScale
            } = buildScale({
                chartHeight,
                chartWidth,
                betweenBarsPadding: 0.1,
                colorSchema: colorSchema,
                transformedData: transformedData,
                originalData: normalizeData,
            });
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
                layers,
                selection: graphSvg,
                colorScale,
                xScale,
                yScale,
            });

            buildLegend({
                selection: legendSvg,
                legendList: stackList,
                colorScale,
            })

            buildMouseEvent({
                selection: graphSvg,
                selectionElement: 'bar',
                onMouseOver: (e, d) => {
                    dispatcher.call('customMouseOver', e, d);
                }
            })
        })
    }

    useEffect(() => {
        const container = select(graphRef.current);
        validateContainer(container);
        container.datum(data).call(buildGraph)

    }, []);


    return <StyledGraphContainer ref={graphRef} className='graph-container'>
        <div ref={legendRef} className='legend-container'></div>
    </StyledGraphContainer>
}