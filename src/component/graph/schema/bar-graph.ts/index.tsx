import { D3GraphSceneBuilder, GraphOptionsManager, GridBuilder, LegendBuilder } from "../../builder"
import { AxisBuilder } from "../../builder/axis"
import { ScaleBuilder } from "../../builder/scale"
import { D3Graph } from '../../graph';
import { D3BaseGraph, D3ScaleOutput, Datum, PickD3Scale } from "../../model";
import { D3GroupBar } from "../../renderer";
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
        .domain([0, (d3Max(data, d => d.amount) ?? 0)])
        .rangeRound([graphHeight, 0])
        .nice()

    const periodScale = new ScaleBuilder('periodScale', 'band')
        .domain(data.map(d => d?.period))
        .rangeRound([0, graphWidth])
        .padding(0.1);

    const typeScale = new ScaleBuilder('typeScale', 'band')
        .domain(data.map(d => d?.type));

    const colorScale = new ScaleBuilder('colorScale', 'ordinal')
        .domain(data.map(d => d?.type))
        .range(data.map(d => d.color))

    chart
        .axes(
            new AxisBuilder('amountScale', 'left')
                .className('axis-y'),
            new AxisBuilder('periodScale', 'bottom')
                .transform(`translate(0, ${graphHeight})`)
                .className('axis-x')
        )
        .scale(
            amountScale,
            periodScale,
            typeScale,
            colorScale
        )
        .grid(
            new GridBuilder('amountScale', 'row'),
            new GridBuilder('periodScale', 'col'),
        )
        .legend(
            new LegendBuilder('rect', typeScale.spec, colorScale.spec)
                .style({
                    display: 'flex',
                    maxWidth: graphWidth,
                    padding: '0 15px',
                    flexWrap: 'wrap',
                })
                .shapeAttr({
                    shapeWidth: '12px',
                    shapeHeight: '12px',
                    shapeMargin: '0 10px',
                })
                .labelAttr({
                    style: {
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center'
                    }
                })
        )

    return chart;
}

export const D3BarChart = <Data extends Datum>(props: D3BaseGraph<Data>) => {
    const chart = BarChartBuilder(props);
    const {
        data,
        options,
        signalListener
    } = props;
    const {
        graphSpace: {
            shape,
        },
    } = new GraphOptionsManager(options);

    function getScale<
        T extends D3ScaleSpec['type'],
        Output extends D3ScaleOutput
    >
        (name: string) {
        const spec = chart.spec.getScale(name);
        return ScaleRenderer<T, Output>(spec);
    }

    const periodScale = getScale<'band', string>('periodScale');
    const amountScale = getScale<'linear', number>('amountScale');
    const typeScale = getScale<'band', string>('typeScale');
    const colorScale = getScale<'ordinal', string>('colorScale');

    if (
        !periodScale ||
        !amountScale ||
        !typeScale ||
        !colorScale
    )
        throw new Error('Something wrong with scale list');

    typeScale.rangeRound([0, getScaleBandwidth(periodScale)])

    return <D3Graph
        {...props}
        builder={chart}
    >
        <D3GroupBar<
            Datum,
            PickD3Scale<'band'>,
            PickD3Scale<'band'>
        >
            data={data}
            width={shape.width}
            height={shape.height}
            x0Scale={periodScale}
            x1Scale={typeScale}
            yScale={amountScale}
            colorScale={colorScale}
            signalListener={signalListener}
        />
    </D3Graph>

}