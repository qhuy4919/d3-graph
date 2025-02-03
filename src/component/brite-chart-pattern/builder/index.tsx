import { useEffect, useRef } from "react";
import { pointer, select } from "d3-selection";
import { dispatch } from 'd3-dispatch';
import { validateContainer } from "../util";
import { ChartShape, D3BaseGraph } from "../model";
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

const interactiveElement = (shape: ChartShape) => {
    switch (shape) {
        case 'stack': return 'bar'
        case 'group': return 'bar'
        case 'pie': return 'arc'
        default: return 'bar'
    }
}

export const D3GraphBuilder = <
    ChartData extends Record<string, any>
>({
    chartKey,
    containerSize,
    data,
    spec
}: D3BaseGraph<ChartData>) => {
    const { height = 500, width = 1000, margin: customMargin } = containerSize;
    const {
        shape
    } = spec
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

    const dispatcher = dispatch(
        'chartMouseOver',
        'chartMouseOut',
        'customMouseMove',
        'customDataEntryClick',
        'customTouchMove'
    );

    const {
        colorScale,
        normalizeData,
        legendList,
        xScale,
        x2Scale,
        yScale
    } = useD3Dashboard<ChartData>({
        data,
        chartHeight,
        chartWidth,
        ...spec,
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
            dispatcher,
            xScale,
            x2Scale,
            yScale,
            colorScale,
            chartHeight,
            chartWidth,
            margin
        });

        drawLegend({
            selection: legendSvg,
            legendList,
            colorScale,
        });

        buildMouseEvent({
            selection: graphSvg,
            selectionElement: interactiveElement(shape),
            onMouseOver: (e, d, key) => {
                tooltipElement.mouseEvent.mouseover(key, d)
                dispatcher.call('chartMouseOver', e, d, pointer(e));
            },
            onMouseOut: () => {
                tooltipElement.mouseEvent.mouseout();
                dispatcher.call('chartMouseOut');
            },
            onMouseMove: (e) => {
                const position = pointer(e);
                tooltipElement.mouseEvent.mousemove(position);
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