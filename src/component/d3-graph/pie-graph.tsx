import { D3BuilderReturn, D3GraphBuilder, D3Selection, TransformedGraphData, } from "./model";
import { buildPieScale } from "./builder/scale";
import { reduceData } from "./builder/data";
import { drawPie } from "./builder/graph/pie-graph";
import { buildMouseEvent } from "./builder/event";
import { interactiveElement } from "./util";
import { PieArcDatum } from "d3-shape";

export const pieGraphBuilder = <T extends Record<string, any>[]
>({
    dispatcher,
    graphSelection,
    signalListener,
    tooltipEvent,
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

    const colorSchema = [...new Set(normalizeData.map(x => x.color))];
    function getPieData(rawData: PieArcDatum<TransformedGraphData>) {
        const key = rawData.data.dataKey;
        return rawData.data[key]
    }

    const {
        colorScale,
    } = buildPieScale({
        data: normalizeData,
        chartHeight,
        chartWidth,
        margin,
        colorSchema,
    });

    const {
        handleArcHover
    } = drawPie({
        selection: graphSelection,
        originalData: normalizeData,
        colorScale,
        ...chartSize,
    });

    buildMouseEvent<PieArcDatum<TransformedGraphData>>({
        selection: graphSelection,
        selectionElement: interactiveElement('pie'),
        dispatcher,
    });

    dispatcher.on('chartMouseOver', function (d) {
        handleArcHover(this, d, true);
        tooltipEvent?.onMouseOver?.(this, getPieData(d));
    })
    dispatcher.on('chartMouseOut', function (d) {
        handleArcHover(this, d, false)
        tooltipEvent?.onMouseOut?.(this);
    })
    dispatcher.on('chartMouseMove', function () {
        tooltipEvent?.onMouseMove?.(this);
    })
    dispatcher.on('chartClick', (d) => {
        signalListener?.pieClick('barClick', {
            value: {
                data: getPieData(d)
            }
        });

    })

    return {
        graphSelection,
        shape: 'pie',
        colorScale,
        normalizeData
    }
}