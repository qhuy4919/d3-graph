import { drawAxis } from "./builder/axis";
import { drawStackBar, drawVerticalStackBar } from "./builder/graph/bar-graph";
import { drawMarker, highlightMarker } from "./builder/graph/marker";
import { buildStackedScale } from "./builder/scale";
import { reduceData } from "./builder/data";
import { buildMouseEvent } from "./builder/event";
import { interactiveElement } from "./util";
import { select } from "d3-selection";
import { SeriesPoint } from "d3-shape";
import {
    D3BuilderReturn,
    D3GraphBuilder,
    D3ScaleBand,
    D3ScaleLinear,
    TransformedGraphData
} from "./model";

type D3SpecialStackedGraph = {
    isHorizontal: boolean,
}
export const stackedGraphBuilder = <XScale, YScale>(
    props: D3GraphBuilder<T> & D3SpecialStackedGraph
) => {
    const {
        chartHeight,
        chartWidth,
        margin,
        //
        isHorizontal,
        //
        data } = props;

    const normalizeData = reduceData(data, {
        amount: 'amount',
        type: 'type',
        period: 'period',
        subColor: 'subColor',
        color: 'bgcolor',
    });

    const colorSchema = [...new Set(normalizeData.map(x => x.color))];

    const {
        colorScale,
        xScale,
        yScale
    } = buildStackedScale({
        data: normalizeData,
        chartHeight,
        chartWidth,
        margin,
        colorSchema,
        isHorizontal,
    });

    function transformStackedData(data: SeriesPoint<TransformedGraphData>, type: string) {
        return data?.data?.[type]
    }

    return {
        data: {
            normalizeData,
            handleTransformedData: transformStackedData
        },
        scale: {
            xScale: xScale as XScale,
            yScale: yScale as YScale,
            colorScale,
        }
    }
}

export const horizontalStackedGraphBuilder = <T extends Record<string, any>[]
>(props: D3GraphBuilder<T>): D3BuilderReturn => {
    const {
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
    } = props;

    const chartSize = {
        chartHeight,
        chartWidth,
        margin,
    }

    const {
        data: {
            handleTransformedData,
            normalizeData,
        },
        scale: {
            xScale,
            yScale,
            colorScale,
        }
    } = stackedGraphBuilder<D3ScaleBand, D3ScaleLinear>({
        ...props,
        isHorizontal: true,
    });

    drawAxis<string, number>({
        data: normalizeData,
        selection: graphSelection,
        x: {
            orientation: 'bottom',
            scale: xScale,
            axisLabelOffset: -10,
            ticks: 5,
            ...axis?.x
        },
        y: {
            orientation: 'left',
            scale: yScale,
            axisLabelOffset: 10,
            ticks: 5,
            ...axis?.y
        },
        ...chartSize,
    })
    drawStackBar({
        selection: graphSelection,
        originalData: normalizeData,
        colorScale,
        xScale,
        yScale,
    });

    buildMouseEvent<SeriesPoint<TransformedGraphData>>({
        selection: graphSelection,
        selectionElement: interactiveElement('stacked'),
        dispatcher,
    });

    const markerSelection = drawMarker({
        graphSvg: graphSelection,
        ...chartSize
    })

    dispatcher.on('chartMouseOver', function (d: SeriesPoint<TransformedGraphData>) {
        //this không có type nên tạm thời cứ để như vậy
        const type = select(this.target.parentNode).datum().key
        const normalizeY = yScale(d[1])
        // const normalizeX = (xScale(d.data.dataKey) ?? 0) + xScale.bandwidth() / 2;
        const color = colorScale(type)
        highlightMarker(markerSelection, [0, normalizeY], color);
        const tooltipData = handleTransformedData(d, type);
        tooltipEvent?.onMouseOver?.(this, tooltipData)
    })
    dispatcher.on('chartMouseMove', function () {
        tooltipEvent?.onMouseMove?.(this);
    })
    dispatcher.on('chartMouseOut', () => {
        highlightMarker(markerSelection, [99999, 99999]);
        tooltipEvent?.onMouseOut?.(this);
    })
    dispatcher.on('chartClick', function (d) {
        const type = select(this.target.parentNode).datum().key
        const data = handleTransformedData(d, type);

        signalListener?.barClick('barClick', {
            value: data
        });

    })

    return {
        graphSelection,
        shape: 'stacked',
        colorScale,
        normalizeData
    }
}

export function verticalStackedGraphBuilder(props: D3GraphBuilder<T>): D3BuilderReturn {
    const {
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
    } = props;

    const chartSize = {
        chartHeight,
        chartWidth,
        margin,
    }

    const {
        data: {
            handleTransformedData,
            normalizeData,
        },
        scale: {
            xScale,
            yScale,
            colorScale,
        }
    } = stackedGraphBuilder<D3ScaleLinear, D3ScaleBand>({
        ...props,
        isHorizontal: false,
    });

    drawAxis<number, string>({
        data: normalizeData,
        selection: graphSelection,
        x: {
            orientation: 'bottom',
            scale: xScale,
            axisLabelOffset: -10,
            ticks: 5,
            ...axis?.x
        },
        y: {
            orientation: 'left',
            scale: yScale,
            axisLabelOffset: 10,
            ticks: 5,
            ...axis?.y
        },
        isHorizontal: false,
        ...chartSize,
    });

    drawVerticalStackBar({
        selection: graphSelection,
        originalData: normalizeData,
        colorScale,
        xScale,
        yScale,
    });

    buildMouseEvent<SeriesPoint<TransformedGraphData>>({
        selection: graphSelection,
        selectionElement: interactiveElement('stacked'),
        dispatcher,
    });

    // const markerSelection = drawMarker({
    //     graphSvg: graphSelection,
    //     ...chartSize
    // })

    dispatcher.on('chartMouseOver', function (d: SeriesPoint<TransformedGraphData>) {
        //this không có type nên tạm thời cứ để như vậy
        const type = select(this.target.parentNode).datum().key
        const normalizeX = (yScale(d.data.dataKey) ?? 0) + yScale.bandwidth() / 2;
        const color = colorScale(type)
        // highlightMarker(markerSelection, [0, normalizeX], color);
        const tooltipData = handleTransformedData(d, type);
        tooltipEvent?.onMouseOver?.(this, tooltipData)
    })
    dispatcher.on('chartMouseMove', function () {
        tooltipEvent?.onMouseMove?.(this);
    })
    dispatcher.on('chartMouseOut', () => {
        // highlightMarker(markerSelection, [99999, 99999]);
        tooltipEvent?.onMouseOut?.(this);
    })
    dispatcher.on('chartClick', function (d) {
        const type = select(this.target.parentNode).datum().key
        const data = handleTransformedData(d, type);

        signalListener?.barClick('barClick', {
            value: data
        });

    })

    return {
        graphSelection,
        shape: 'stacked',
        colorScale,
        normalizeData
    }
}