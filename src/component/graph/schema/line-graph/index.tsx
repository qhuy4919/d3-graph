import {
    D3ScaleOutput,
    Datum,
    DEFAULT_AXIS_TOOLTIP_KEY,
    DEFAULT_LEGEND_TOOLTIP_KEY,
    defaultAxisLabelStyle
} from "../../model";
import {
    D3GraphSceneBuilder,
    GraphOptionsManager,
    GridBuilder,
    LegendBuilder,
    TooltipBuilder
} from "../../builder";
import { AxisBuilder } from "../../builder/axis";
import { ScaleBuilder } from "../../builder/scale";
import { D3Graph } from "../../graph";
import { max as d3Max } from 'd3-array'
import { ScaleRenderer } from "../../renderer/scale";
import { D3ScaleSpec } from "../../spec";
import moment from 'moment';
import { D3LineSeries } from "../../renderer";

export const LineGraphBuilder = <Data extends Datum>({
    data,
    options
}: D3Graph<Data>) => {
    const chart = new D3GraphSceneBuilder();
    const { graphSpace } = new GraphOptionsManager(options);
    const {
        shape: { width: graphWidth = 0, height: graphHeight = 0 }
    } = graphSpace;

    const periodScale = new ScaleBuilder('periodScale', 'time')
        .domain(data.map(d => d?.period))
        .range([0, graphWidth])
        .padding(0.1);
    const amountScale = new ScaleBuilder('amountScale', 'linear')
        .domain([0, (d3Max(data, d => d.amount) ?? 0)])
        .rangeRound([graphHeight, 0])
        .nice();
    const typeScale = new ScaleBuilder('typeScale', 'band')
        .domain(data.map(d => d.type));
    const colorScale = new ScaleBuilder('colorScale', 'ordinal')
        .domain([...new Set(data.map(d => d.type))])
        .range([...new Set(data.map(d => d.color))]);

    chart
        .axes(
            new AxisBuilder('amountScale', 'left')
                .className('axis-y')
                .title('Pulse')
                .titleStyle(defaultAxisLabelStyle),
            new AxisBuilder('periodScale', 'bottom')
                .className('axis-x')
                .tickFormat((d) => moment(d).format('MMM DD, YY'))
                .title('Time Period')
                .titleStyle(defaultAxisLabelStyle),
            new AxisBuilder('amountScale', 'right')
                .className('axis-y2')
                .title('Monkey')

        )
        .scale(
            periodScale,
            amountScale,
            typeScale,
            colorScale
        )
        .grid(
            new GridBuilder('amountScale', 'horizontal'),
            new GridBuilder('periodScale', 'vertical'),
        )
        .tooltip(
            new TooltipBuilder(
                'graph',
                {
                    type: 'Type',
                    amount: 'Amount',
                    period: 'On'
                },
                {
                    period: (d) => <>
                        {moment(d.period).format('MMM DD, YY')}
                    </>
                }
            ),
            new TooltipBuilder(
                'axis',
                {
                    [DEFAULT_AXIS_TOOLTIP_KEY]: '',

                },
                {
                }
            ),
            new TooltipBuilder(
                'legend',
                {
                    [DEFAULT_LEGEND_TOOLTIP_KEY]: '',
                },
                {
                }
            )
        )
        .legend(
            new LegendBuilder('rect', typeScale.spec, colorScale.spec)
                .style({
                    display: 'flex',
                    maxWidth: graphWidth,
                    flexWrap: 'wrap',
                    fontSize: '12px',
                })
                .shapeAttr({
                    shapeWidth: '12px',
                    shapeHeight: '12px',
                    shapeMargin: '0 10px',
                })
                .labelAttr({
                    style: {
                        display: 'flex',
                        alignItems: 'center'
                    }
                })
        )
    return chart;

}
export const D3LineGraph = <Data extends Datum>(props: D3Graph<Data>) => {
    const chart = LineGraphBuilder(props);
    const {
        data,
    } = props;


    function getScale<
        T extends D3ScaleSpec['type'],
        Output extends D3ScaleOutput
    >
        (name: string) {
        const spec = chart.spec.getScale(name);
        return ScaleRenderer<T, Output>(spec);
    }

    const periodScale = getScale<'time', number>('periodScale');
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

    return <D3Graph
        {...props}
        builder={chart}
    >
        <D3LineSeries
            data={data}
            xScale={periodScale}
            yScale={amountScale}
            colorScale={colorScale}
        />
    </D3Graph>
}