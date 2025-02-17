import { useEffect, useRef, useCallback } from "react";
import { select } from "d3-selection";
import { dispatch } from 'd3-dispatch';
import { getLegendHeight, validateContainer, withD3CustomizableTooltip } from "../util";
import { D3BaseGraph, D3BaseGraphData, DEFAULT_LEGEND_FONT_SIZE, DEFAULT_LEGEND_MARKER_SIZE } from "../model";
import {
    buildGraphStructure,
    buildLegendStructure,
    buildSvg,
} from "./svg";
import { drawLegend } from "./legend";
import styled from "styled-components";
import { drawTooltip } from "./tooltip";

const StyledTooltipContainer = styled.div`
    position: absolute;
    background-color: white;
    margin: var(--spacing-sm);
    border: var(--bd);
    border-radius: var(--br);
    pointer-events: none;
    color: black;
    min-width: 150px;
    font-size: var(--fs);
    box-sizing: border-box;
`;

export const D3GraphBuilder = <
    ChartData extends Record<string, unknown>,
>({
    containerSize,
    signalListener,
    data,
    spec
}: D3BaseGraph<ChartData>) => {
    const { width, height, margin } = containerSize;
    const {
        builder,
        className,
        tooltip,
        legend,
        ...restSpec
    } = spec;


    const graphRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const dispatcher = dispatch(
        'chartMouseOver',
        'chartMouseOut',
        'chartMouseMove',
        'chartClick'
    );


    const chartWidth = width - (margin.left + margin.right) * 2;
    const defaultLegendHeight = (margin.top + margin.bottom) / 2;
    const legendHeight = getLegendHeight(
        data,
        {

            defaultHeight: defaultLegendHeight,
            defaultWidth: chartWidth,
            fontSize: spec.legend?.fontSize ?? DEFAULT_LEGEND_FONT_SIZE,
            markerSize: spec.legend?.markerSize ?? DEFAULT_LEGEND_MARKER_SIZE,
            margin,
        }

    );
    const chartHeight = height - legendHeight - (margin.bottom + margin.top);


    const memoBuildGraph = useCallback(function () {
        // Chừa spacing 2 bên để Hiển thị axis label

        const chartSize = {
            chartWidth,
            chartHeight,
            margin
        }

        const graphSvg = buildSvg({
            container: graphRef.current,
            containerProps: {
                width: width,
                height: height - legendHeight,
                margin: margin,
            },
            childElement: buildGraphStructure
        });

        const legendSvg = buildSvg({
            container: legendRef.current,
            containerProps: {
                width: width,
                height: legendHeight,
                margin: margin,
            },
            childElement: buildLegendStructure
        });

        const tooltipEvent = drawTooltip<D3BaseGraphData>({
            selection: select(tooltipRef.current),
            defaultTooltip: (d) => {
                if (!d) return '';
                return withD3CustomizableTooltip<D3BaseGraphData>(
                    {
                        default: {
                            amount: 'Amount',
                            period: 'On',
                            type: 'Type',
                        },
                    },
                    {
                        default: {
                            amount: d?.amount.toString(),
                            period: d?.period,
                            type: d?.type,
                        },
                    },
                    {
                    }
                )(Object.keys(d))
            }
        });

        const {
            colorScale,
            normalizeData,
        } = builder({
            data,
            graphSelection: graphSvg,
            dispatcher,
            signalListener,
            tooltipEvent,
            ...chartSize,
            ...restSpec
        })

        drawLegend({
            selection: legendSvg,
            colorScale,
            data: normalizeData,
            chartWidth: width,
            chartHeight: legendHeight,
            margin,
            ...legend,
        });
    }, [builder, data, chartHeight, chartWidth])

    useEffect(() => {
        const container = select(graphRef.current);
        validateContainer(container);
        if (container && data && data.length > 0) {
            container.call(memoBuildGraph)
        };

        return () => {
            container.selectAll('svg').remove();
        }
    }, [data, builder, memoBuildGraph, graphRef, chartHeight, chartWidth]);

    return <>
        <div ref={graphRef} className='d3-graph'></div>
        <div ref={legendRef} className='d3-legend'></div>
        <StyledTooltipContainer ref={tooltipRef} className='d3-tooltip'>
        </StyledTooltipContainer>

    </>
}
