import {
    D3GraphSceneBuilder,
    GraphOptionsManager,
    GridBuilder,
    LegendBuilder,
    TooltipBuilder
} from "../../builder"
import {
    D3ScaleOutput,
    D3Datum,
    DEFAULT_AXIS_TOOLTIP_KEY,
    DEFAULT_LEGEND_TOOLTIP_KEY,
    defaultAxisTitleStyle,
    PickD3Scale,
    GraphPadding,
    defaultAxisLabelstyle
} from "../../model";
import { D3StackedBar } from "../../renderer";
import { max as d3Max } from 'd3-array'
import { ScaleRenderer } from "../../renderer/scale";
import { getScaleBandwidth, stackedTransformData } from "../../util";
import { D3ScaleSpec } from "../../spec";
import { AxisBuilder } from "../../builder/axis"
import { ScaleBuilder } from "../../builder/scale"
import { D3Graph } from '../../graph';

export const StackedBarGraphBuilder = <Data extends D3Datum>({
    data,
    options
}: D3Graph<Data>) => {
    const chart = new D3GraphSceneBuilder();
    const { graphSpace } = new GraphOptionsManager(options);
    const {
        shape: { width: graphWidth = 0, height: graphHeight = 0 }
    } = graphSpace;
    const groupedStackedData = stackedTransformData(data)
    const maxTick = d3Max(groupedStackedData, d => d._total);

    const amountScale = new ScaleBuilder('amountScale', 'linear')
        .domain([0, maxTick])
        .rangeRound([graphHeight, 0])
        .nice()

    const periodScale = new ScaleBuilder('periodScale', 'band')
        .domain(data.map(d => d?.period))
        .rangeRound([0, graphWidth])
        .padding(0.1);

    const typeScale = new ScaleBuilder('typeScale', 'band')
        .domain(data.map(d => d?.type));

    const colorScale = new ScaleBuilder('colorScale', 'ordinal')
        .domain([...new Set(data.map(d => d.type))])
        .range([...new Set(data.map(d => d.color))]);

    chart
        .axes(
            new AxisBuilder('amountScale', 'left')
                .className('axis-y')
                .title('Number of Members')
                .titleStyle(defaultAxisTitleStyle)
                .labelStyle(defaultAxisLabelstyle),
            new AxisBuilder('periodScale', 'bottom')
                .className('axis-x')
                .title('Health Plan')
                .titleStyle(defaultAxisTitleStyle)
                .labelStyle(defaultAxisLabelstyle),
        )
        .scale(
            amountScale,
            periodScale,
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
                    amount: (value) => <span>
                        {value.amount} ({(value.amount / value._total * 100).toFixed(2)}%)
                    </span>
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

export const D3StackedBarGraph = <Data extends D3Datum>(props: D3Graph<Data>) => {
    const {
        options: defaultOptions,
    } = props;

    const {
        width: containerWidth,
        height: containerHeight,
    } = defaultOptions;

    const normalizePadding: GraphPadding = {
        bottom: containerHeight * 0.2,
        left: containerWidth * 0.1,
        right: containerWidth * 0.05,
        top: containerHeight * 0.15,
    };

    const normalizeProps = {
        ...props,
        options: {
            ...defaultOptions,
            padding: normalizePadding,
        },
    };

    const {
        data,
        options,
        signalListener
    } = normalizeProps;

    const {
        graphSpace: {
            shape,
        },
    } = new GraphOptionsManager(options);



    const chart = StackedBarGraphBuilder(normalizeProps);

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

    typeScale.rangeRound([0, getScaleBandwidth(periodScale)]);


    return <D3Graph
        {...normalizeProps}
        builder={StackedBarGraphBuilder}

    >
        <D3StackedBar<
            D3Datum,
            PickD3Scale<'band'>,
            PickD3Scale<'linear', number>
        >
            data={data}
            width={shape.width}
            height={shape.height}
            xScale={periodScale}
            yScale={amountScale}
            colorScale={colorScale}
            signalListener={signalListener}
        />
    </D3Graph>

}

