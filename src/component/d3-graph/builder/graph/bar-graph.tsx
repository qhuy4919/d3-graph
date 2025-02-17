import { D3BaseGraphData, D3Selection, TransformedGraphData } from '../../model'
import { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';
import { stack } from 'd3-shape';
import { transformData } from '../data';

type DrawStackedBar = {
    selection: D3Selection<SVGGElement>;
    originalData: D3BaseGraphData[]

    colorScale: ScaleOrdinal<string, string>,
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>,
}

export const drawStackBar = ({
    selection,
    originalData,
    colorScale,
    xScale,
    yScale,

}: DrawStackedBar) => {
    const series = selection.select('.chart-group').selectAll('.layer');
    const transformedData = transformData(originalData, 'period');
    const stackList = [...new Set(originalData.map(x => x.type))];
    const stackBar = stack<TransformedGraphData, string>().keys(stackList)
        .value((d, k) => d?.[k]?.amount ?? 0);
    const layers = stackBar(transformedData);

    const periodWithStackedAmount = transformedData.map(x => {
        return {
            key: x.dataKey,
            _total: x._total
        };
    });

    if (!layers) throw new Error('Build layers failed');

    const layerElements = series
        .data(layers)
        .join(
            function (enter) {
                return enter
                    .append('g')
                    .attr('fill', (d) => colorScale(d.key))
                    .classed('layer', true);
            },
        );
    const barJoin = layerElements
        .selectAll('.bar')
        .data(d => d);
    const barLabel = selection.select('.chart-group')
        .selectAll('.bar')
        .data(periodWithStackedAmount)

    barLabel
        .enter()
        .append("text")
        .text(function (d) {
            return (d._total ?? 0).toFixed();
        })
        .style("text-anchor", "middle")
        .style('font-weight', 'bold')
        .classed('total-amount', true)
        .attr('x', (d) => (xScale(d.key ?? '') ?? 0) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(d._total ?? 0) - 9) // haft of font size of label
        .attr("font-size", xScale.bandwidth() / 4)
        .attr("fill", "grey");

    barJoin
        .join(
            function (enter) {
                return enter
                    .append('rect')
                    .classed('bar', true)
                    .attr('x', (d) => xScale(d.data.dataKey ?? '') ?? 0)
                    .attr('y', (d) => yScale(d[1]))
                    .attr('width', xScale.bandwidth())
                    .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
            },

        )
};


type DrawVerticalStackedBar = {
    yScale: ScaleBand<string>,
    xScale: ScaleLinear<number, number>,
} & Omit<DrawStackedBar, 'xScale' | 'yScale'>
export const drawVerticalStackBar = ({
    selection,
    originalData,
    colorScale,
    xScale,
    yScale,

}: DrawVerticalStackedBar) => {
    const series = selection.select('.chart-group').selectAll('.layer');
    const transformedData = transformData(originalData, 'period');
    const stackList = [...new Set(originalData.map(x => x.type))];
    const stackBar = stack<TransformedGraphData, string>().keys(stackList)
        .value((d, k) => d?.[k]?.amount ?? 0);
    const layers = stackBar(transformedData);

    const periodWithStackedAmount = transformedData.map(x => {
        return {
            key: x.dataKey,
            _total: x._total
        };
    });


    if (!layers) throw new Error('Build layers failed');

    const layerElements = series
        .data(layers)
        .join(
            function (enter) {
                return enter
                    .append('g')
                    .attr('fill', (d) => colorScale(d.key))
                    .classed('layer', true);
            },
        );
    const barJoin = layerElements
        .selectAll('.bar')
        .data(d => d);
    const barLabel = selection.select('.chart-group')
        .selectAll('.bar')
        .data(periodWithStackedAmount)

    barLabel
        .enter()
        .append("text")
        .text(function (d) {
            return (d._total ?? 0).toFixed();
        })
        .style("text-anchor", "middle")
        .style('font-weight', 'bold')
        .classed('total-amount', true)
        .attr('x', (d) => xScale(d._total ?? 0) + 14) // font size of label
        .attr('y', (d) => (yScale(d.key ?? '') ?? 0) + yScale.bandwidth() / 2)
        .attr("font-size", "10")
        .attr("fill", "grey");

    barJoin
        .join(
            function (enter) {
                return enter
                    .append('rect')
                    .classed('bar', true)
                    .attr('x', (d) => xScale(d[0]))
                    .attr('y', (d) => yScale(d.data.dataKey ?? '') ?? 0)
                    .attr('width', (d) => xScale(d[1]) - xScale(d[0]))
                    .attr('height', yScale.bandwidth())
            },

        )
};

type DrawGroupBar = {
    selection: D3Selection<SVGGElement>;
    originalData: D3BaseGraphData[]

    colorScale: ScaleOrdinal<string, string>,
    xScale: ScaleBand<string>,
    x2Scale: ScaleBand<string>
    yScale: ScaleLinear<number, number>,
};
export const drawGroupBar = ({
    selection,
    originalData,
    colorScale,
    xScale,
    x2Scale,
    yScale,
}: DrawGroupBar) => {
    const series = selection.select('.chart-group').selectAll('.group');
    const data = transformData(originalData, 'period');
    if (!data) throw new Error('Build data failed');

    const layerElements = series
        .data(data)
        .join(
            function (enter) {
                return enter
                    .append('g')
                    .attr("transform", (d) => `translate(${xScale(d.dataKey ?? '')},0)`)
                    .classed('group', true);
            }
        )

    layerElements
        .selectAll('rect')
        .data(function (d) {
            return Object
                .entries(d)
                .map(entries => {
                    return entries[1]
                })
                .filter(x => typeof x === 'object')
        })
        .enter()
        .append("text")
        .text(function (d) {
            const text = (d.amount ?? 0);
            return text > 0 ? text.toFixed() : '';
        })
        .style("text-anchor", "middle")
        .style('font-weight', 'bold')
        .classed('total-amount', true)
        .attr('x', (d) => (x2Scale(d.type ?? '') ?? 0) + x2Scale.bandwidth() / 2)
        .attr('y', (d) => yScale(d.amount ?? 0) - 9) // haft of font size of label
        .attr("font-size", x2Scale.bandwidth())
        .attr("fill", "grey");


    layerElements
        .selectAll('rect')
        .data(function (d) {
            return Object
                .entries(d)
                .map(entries => entries[1])
                .filter(x => typeof x === 'object')
        })
        .enter()
        .append("rect")
        .classed('bar', true)
        .attr("x", d => x2Scale(d.type ?? '') ?? 0)
        .attr("y", d => yScale(d.amount))
        .attr("width", x2Scale.bandwidth())
        .attr("height", (d) => yScale(0) - yScale(d.amount))
        .attr('fill', (d) => colorScale(d.type))
}
