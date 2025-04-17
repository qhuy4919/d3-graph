import { D3GraphSceneBuilder, GraphOptionsManager, GridBuilder } from "../../builder"
import { AxisBuilder } from "../../builder/axis"
import { ScaleBuilder } from "../../builder/scale"
import { D3Graph } from '../../graph';
import { D3BaseGraph, Datum, PickD3Scale } from "../../model";
import { D3Axis, D3Grid, D3GroupBar } from "../../renderer";
import { max as d3Max } from 'd3-array'
import { ScaleRenderer } from "../../renderer/scale";
import { getScaleBandwidth } from "../../util";
import { D3ScaleSpec } from "../../spec";

export const BarChartBuilder = <Data extends Datum>({
    data,
    options
}: D3BaseGraph<Data>) => {
    const chart = new D3GraphSceneBuilder();
    const { graphSpace } = new GraphOptionsManager(options);
    const {
        shape: { width: graphWidth = 0, height: graphHeight = 0 }
    } = graphSpace;


    const amountScale = new ScaleBuilder('amountScale', 'linear')
        .domain([0, d3Max(data, d => d.amount) ?? 0])
        .rangeRound([0, graphWidth])
        .ticks(5);

    const periodScale = new ScaleBuilder('periodScale', 'band')
        .domain(data.map(d => d?.period))
        .rangeRound([0, graphHeight])
        .ticks(data.length);

    const typeScale = new ScaleBuilder('typeScale', 'band')
        .domain(data.map(d => d?.type))
        .ticks(data.length);

    const colorScale = new ScaleBuilder('typeScale', 'band')
        .domain(data.map(d => d?.type))
        .range(data.map(d => d.color))

    chart
        .axes(
            new AxisBuilder('amountScale', 'bottom')
                .transform(`translate(0, ${graphHeight})`)
                .className('axis-x'),
            new AxisBuilder('periodScale', 'left')
                .className('axis-y')
        )
        .scale(
            amountScale,
            periodScale,
            typeScale,
            colorScale
        )
        .grid(
            new GridBuilder('amountScale', 'col'),
            new GridBuilder('periodScale', 'row')
        )

    return chart;
}

export const D3BarChart = <Data extends Datum>(props: D3BaseGraph<Data>) => {
    const chart = BarChartBuilder(props);
    const {
        data,
        options,
        builder,
    } = props;
    const {
        graphSpace: {
            shape,
        }
    } = new GraphOptionsManager(options);

    function getScale<T extends D3ScaleSpec['type']>(name: string) {
        return ScaleRenderer<T>(builder?.spec.getScale(name));
    }

    const periodScale = getScale<'band'>('periodScale');
    const amountScale = getScale<'linear'>('amountScale');
    const typeScale = getScale<'band'>('typeScale');
    const colorScale = getScale<'ordinal'>('colorScale');

    if (
        !periodScale ||
        !amountScale ||
        !typeScale ||
        !colorScale
    )
        throw new Error('Something wrong with scale');

    typeScale.rangeRound([0, getScaleBandwidth(periodScale)])



    return <D3Graph
        {...props}
        builder={chart}
    >
        <D3Axis />
        <D3Grid />
        <D3GroupBar<
            Datum,
            string,
            PickD3Scale<'band'>,
            PickD3Scale<'band'>
        >
            data={data}
            width={shape.width}
            height={shape.height}
            x0={(d: Datum) => d.period}
            x0Scale={periodScale}
            x1Scale={typeScale}
            yScale={amountScale}
            color={colorScale}
        />
    </D3Graph>
}