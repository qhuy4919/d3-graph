import { BaseGraphData, D3Selection, TransformedGraphData } from '../../model'
import { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';
import { Series } from 'd3-shape'
import { buildDataShape, transformData } from '../data';

type DrawStackBar = {
    selection: D3Selection<SVGGElement>;
    originalData: BaseGraphData[]

    colorScale: ScaleOrdinal<string, string>,
    xScale: ScaleBand<string>,
    x2Scale: ScaleBand<string>
    yScale: ScaleLinear<number, number>,
}

export const drawStackBar = ({
    selection,
    originalData,
    colorScale,
    xScale,
    yScale,

}: DrawStackBar) => {
    const series = selection.select('.chart-group').selectAll('.layer');
    const transformedData = transformData(originalData, 'period');
    const layers = buildDataShape('stack', originalData, transformedData) as Series<TransformedGraphData, string>[];
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
        .data(d => d)

    barJoin
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('x', (d) => xScale(d.data.dataKey ?? '') ?? 0)
        .attr('y', (d) => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => yScale(d[0]) - yScale(d[1]));

    return barJoin;
};

type DrawGroupBar = {

} & DrawStackBar
export const drawGroupBar = ({
    selection,
    originalData,
    colorScale,
    xScale,
    x2Scale,
    yScale,
}: DrawGroupBar) => {
    const series = selection.select('.chart-group').selectAll('.group');
    const transformedData = transformData(originalData, 'period');
    const data = buildDataShape('group', originalData, transformedData) as TransformedGraphData[];
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
        .selectAll('.bar')
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
        .attr('fill', (d) => colorScale(d.type));

    return layerElements;
}
