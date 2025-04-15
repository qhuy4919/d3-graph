import { D3GraphSceneBuilder, GraphOptionsManager } from "../../builder"
import { AxisBuilder } from "../../builder/axis"
import { ScaleBuilder } from "../../builder/scale"
import { D3Graph } from '../../graph';
import { D3BaseGraph, Datum } from "../../model";
import { D3Axis } from "../../renderer";
import { max as d3Max } from 'd3-array'

export const BarChartBuilder = <Data extends Datum>({
    data,
    options
}: D3BaseGraph<Data>) => {
    const chart = new D3GraphSceneBuilder();
    const { graphSpace } = new GraphOptionsManager(options);
    const {
        shape: { width: graphWidth = 0, height: graphHeight = 0 }
    } = graphSpace;

    chart.axes(
        new AxisBuilder('amountScale', 'bottom')
            .transform(`translate(0, ${graphHeight})`)
            .className('axis-x'),
        new AxisBuilder('periodScale', 'left')
            .className('axis-y')
    )
        .scale(
            new ScaleBuilder('amountScale', 'linear')
                .domain([0, d3Max(data, d => d.amount) ?? 0])
                .rangeRound([0, graphWidth]),
            new ScaleBuilder('periodScale', 'band')
                .domain(data.map(d => d?.period))
                .rangeRound([0, graphHeight])
        ).build();

    return chart;
}

export const D3BarChart = <Data extends Datum>(props: D3BaseGraph<Data>) => {
    const chart = BarChartBuilder(props)
    return <D3Graph
        {...props}
        builder={chart}
    >
        <D3Axis />
    </D3Graph>
}