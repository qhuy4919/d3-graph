import { Series } from 'd3-shape';
import { D3Selection, TransformedGraphData } from '../../model'
import { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';

type DrawStackBar = {
    selection: D3Selection<SVGGElement>;
    layers: Series<TransformedGraphData, string>[],
    colorScale: ScaleOrdinal<string, string>,
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>,
}

export const drawStackBar = ({
    selection,
    layers,

    colorScale,
    xScale,
    yScale,

}: DrawStackBar) => {
    const series = selection.select('.chart-group').selectAll('.layer')

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
        .attr('height', (d) => yScale(d[0]) - yScale(d[1]))


}
