import { PieArcDatum, arc } from "d3-shape";
import { BaseGraphData, ChartSize, D3Selection, TransformedGraphData } from "../../model";
import { buildDataShape, transformData } from "../data";
import { ScaleOrdinal } from "d3-scale";
import { sum } from 'd3-array';

type DrawPie = {
    selection: D3Selection<SVGGElement>;
    originalData: BaseGraphData[],
    colorScale: ScaleOrdinal<string, string>,
} & ChartSize;

export function drawPie({
    originalData,
    selection,
    colorScale,
    chartHeight,
    chartWidth,
}: DrawPie) {
    console.log("🚀 ~ originalData:", originalData)
    const transformedData = transformData(originalData, 'type');
    const radius = Math.min(chartWidth, chartHeight) / 2;
    const PieContainer = selection.select('.chart-group')
        .append("g")
        .classed('pie-container', true)
        .attr("stroke", "white")
        .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);

    const labelContainer = selection.select('.chart-group')
        .append("g")
        .classed('label-container', true)
        .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);

    const total = sum(originalData.map(x => parseInt(x.value.toString())));
    const arcs = buildDataShape('pie', originalData, transformedData) as PieArcDatum<TransformedGraphData>[];
    const arcGenerator = arc<PieArcDatum<TransformedGraphData>>()
        .innerRadius(0)
        .outerRadius(radius);

    PieContainer
        .selectAll('.arc')
        .data(arcs)
        .join(
            function (enter) {
                return enter
                    .append('path')
                    .classed('arc', true)
                    .attr('d', arcGenerator)
                    .attr("fill", d => colorScale(d.data.dataKey ?? ''))
            }
        );

    labelContainer
        .selectAll('.arc')
        .data(arcs)
        .join(
            function (enter) {
                return enter
                    .append('text')
                    .style("text-anchor", "middle")
                    .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
                    .call(text => text.append("tspan")
                        .attr("font-weight", "bold")
                        .text(d => {
                            const amount = d.data._total ?? 0;
                            return `${Math.round(amount / total * 100)}%`
                        }))
            }
        )
}