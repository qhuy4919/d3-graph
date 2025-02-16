import { drawAxis } from "./builder/axis";
import { drawGroupBar } from "./builder/graph/bar-graph";
import { drawMarker, highlightMarker } from "./builder/graph/marker";
import { D3BaseGraphData, D3BuilderReturn, D3GraphBuilder } from "./model";
import { buildGroupScale } from "./builder/scale";
import { reduceData } from "./builder/data";
import { buildMouseEvent } from "./builder/event";
import { interactiveElement } from "./util";

export const groupBarGraphBuilder = <T extends Record<string, any>[]
>({
    dispatcher,
    graphSelection,
    signalListener,
    tooltipEvent,
    //
    axis,
    //
    chartHeight,
    chartWidth,
    margin,
    //
    data
}: D3GraphBuilder<T>): D3BuilderReturn => {
    const chartSize = {
        chartHeight,
        chartWidth,
        margin,
    }
    const normalizeData = reduceData(data, {
        amount: 'amount',
        type: 'type',
        period: 'period',
        subColor: 'subColor',
        color: 'bgcolor',
    });

    const colorSchema = [...new Set(normalizeData.map(x => x.color))]

    const {
        colorScale,
        xScale,
        yScale,
        x2Scale,
    } = buildGroupScale({
        data: normalizeData,
        chartHeight,
        chartWidth,
        margin,
        colorSchema,
    });


    drawAxis<string, number>({
        selection: graphSelection,
        grid: 'horizontal',
        data: normalizeData,
        x: {
            orientation: 'bottom',
            scale: xScale,
            axisLabelOffset: -10,
            ticks: 5,
            ...axis?.x,
        },
        y: {
            orientation: 'left',
            scale: yScale,
            axisLabelOffset: 10,
            ticks: 5,
            ...axis?.y,
        },
        ...chartSize,
    })
    drawGroupBar({
        selection: graphSelection,
        originalData: normalizeData,
        colorScale,
        xScale,
        yScale,
        x2Scale,
    });
    const markerSelection = drawMarker({
        graphSvg: graphSelection,
        ...chartSize,
    })

    buildMouseEvent<D3BaseGraphData>({
        selection: graphSelection,
        selectionElement: interactiveElement('group'),
        dispatcher,
    })

    dispatcher.on('chartMouseOver', function (d: D3BaseGraphData) {
        const normalizeY = yScale(d?.amount)
        const color = colorScale(d.type)
        highlightMarker(markerSelection, [0, normalizeY], color);
        tooltipEvent?.onMouseOver?.(this, d)
    })
    dispatcher.on('chartMouseMove', function () {
        tooltipEvent?.onMouseMove?.(this);
    })
    dispatcher.on('chartMouseOut', () => {
        highlightMarker(markerSelection, [99999, 99999]);
        tooltipEvent?.onMouseOut?.(this);
    })
    dispatcher.on('chartClick', function (d) {
        signalListener?.barClick('barClick', {
            value: d
        });

    })

    return {
        graphSelection,
        colorScale,
        shape: 'group',
        normalizeData
    }
}