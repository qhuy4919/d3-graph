import { useEffect, useRef } from "react";
import { pointer, select } from "d3-selection";
import * as d3Dispatcher from 'd3-dispatch';
import { validateContainer } from "../util";
import { D3BaseGraph } from "../model";
import { colorSchema } from "../color";
import { drawAxis, drawGridLine } from "./axis";
import { drawStackBar } from "./graph/bar-graph";
import {
    buildGraphStructure,
    buildLegendStructure,
    buildSvg,
} from "./svg";
import { buildMouseEvent } from "./event";
import { drawLegend } from "./legend";
import styled from "styled-components";
import { drawTooltip } from "./tooltip";
import { useD3Dashboard } from "./hook";
import { drawGraph } from "./graph";

const StyledGraphContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
`;

const StyledTooltipContainer = styled.div`
    position: absolute;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    pointer-events: none;
    color: black;
    max-width: 150px;
    font-size: 14px;
`;


const PERIOD_FIELD = 'date'
const AMOUNT_FIELD = 'value';
const TYPE_FIELD = 'stack';

export const GraphBuilder = <
    ChartData extends Record<string, any>
>({
    chartKey,
    containerSize,
    data,
    shape,
}: D3BaseGraph<ChartData>) => {
    const { height = 500, width = 1000, margin: customMargin } = containerSize;
    const margin = {
        top: customMargin?.top ?? 10,
        right: customMargin?.right ?? 30,
        bottom: customMargin?.bottom ?? 20,
        left: customMargin?.left ?? 30
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const graphRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const stackList: string[] = [...new Set(data.map(d => d[TYPE_FIELD]))];

    const dispatcher = d3Dispatcher.dispatch(
        'customMouseOver',
        'customMouseOut',
        'customMouseMove',
        'customClick'
    );

    const dataSchema = {
        name: PERIOD_FIELD,
        type: TYPE_FIELD,
        value: AMOUNT_FIELD
    };

    const {
        colorScale,
        normalizeData,
        xScale,
        yScale
    } = useD3Dashboard<ChartData>({
        data,
        dataSchema,
        colorSchema,
        chartHeight,
        chartWidth
    });

    function buildGraph() {
        const graphSvg = buildSvg({
            container: graphRef.current,
            containerProps: {
                width: width,
                height: height,
                margin: margin,
                key: chartKey
            },
            childElement: buildGraphStructure
        });

        const legendSvg = buildSvg({
            container: legendRef.current,
            containerProps: {
                width: width,
                height: 60,
                margin: margin,
                key: 'graph-legend'
            },
            childElement: buildLegendStructure
        });

        const tooltipElement = drawTooltip({
            selection: select(tooltipRef.current),
        })

        drawGraph({
            shape,
            graphSvg,
            data: normalizeData,
            xScale,
            yScale,
            colorScale,
            chartHeight,
            chartWidth,
            margin
        });

        drawLegend({
            selection: legendSvg,
            legendList: stackList,
            colorScale,
        });

        buildMouseEvent({
            selection: graphSvg,
            selectionElement: 'bar',
            onMouseOver: (e, d, key) => {
                tooltipElement.mouseEvent.mouseover(key, d)
                dispatcher.call('customMouseOver', e, d);
            },
            onMouseOut: (e, d) => {
                tooltipElement.mouseEvent.mouseout();
                dispatcher.call('customMouseOut', e, d);
            },
            onMouseMove: (e, d) => {
                const position = pointer(e);
                tooltipElement.mouseEvent.mousemove(position);
                dispatcher.call('customMouseMove', e, d);
            }
        })
    }

    useEffect(() => {
        const container = select(graphRef.current);
        validateContainer(container);
        container.datum(data).call(buildGraph)

    }, []);


    return <StyledGraphContainer ref={graphRef} className='graph-container'>
        <StyledTooltipContainer ref={tooltipRef} className='tooltip-container'>
        </StyledTooltipContainer>
        <div ref={legendRef} className='legend-container'>
        </div>
    </StyledGraphContainer>
}