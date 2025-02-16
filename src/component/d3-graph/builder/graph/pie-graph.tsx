import { PieArcDatum, arc, pie } from "d3-shape";
import { D3BaseGraphData, ChartSize, D3Selection, TransformedGraphData } from "../../model";
import { transformData } from "../data";
import { ScaleOrdinal } from "d3-scale";
import { sum } from 'd3-array';
import { select } from "d3-selection";
import { easeCubic } from 'd3';

type DrawPie = {
    selection: D3Selection<SVGGElement>;
    originalData: D3BaseGraphData[],
    colorScale: ScaleOrdinal<string, string>,
} & ChartSize;

export function drawPie({
    originalData,
    selection,
    colorScale,
    chartHeight,
    chartWidth,
    margin
}: DrawPie) {
    const transformedData = transformData(originalData, 'type');
    const total = sum(originalData.map(x => x.amount));
    const radiusOffset = 15;
    const radius =
        Math.min(chartWidth, chartHeight) / 2 +
        Math.min((margin.left + margin.right) / 2, (margin.top + margin.bottom) / 2)
        - radiusOffset;

    selection
        .append('text')
        .classed('pie-overview', true)
        .text(`Total: ${total}`)
        .attr('transform', `
            translate(
            ${chartWidth / 2 + margin.left},
            ${chartHeight + margin.bottom + margin.top}
            )`)
        .attr('font-size', '18px');

    const chartContainer = selection.select('.chart-group')
        .append("g")
        .classed('pie-container', true)
        .attr("stroke", "white")
        .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);

    const labelContainer = selection.select('.chart-group')
        .append("g")
        .classed('label-container', true)
        .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);

    const pieGenerator = pie<TransformedGraphData>().value(d => d._total ?? 0)
    const arcs = pieGenerator(transformedData);
    const defaultArc = arc<PieArcDatum<TransformedGraphData>>()
        .innerRadius(0)
        .outerRadius(radius);

    const hoveredArc = arc<PieArcDatum<TransformedGraphData>>()
        .innerRadius(0)
        .outerRadius(radius + radiusOffset);

    chartContainer
        .selectAll('.arc')
        .data(arcs)
        .join(
            function (enter) {
                return enter
                    .append('path')
                    .classed('arc', true)
                    .attr('d', defaultArc)
                    .attr('fill', d => colorScale(d.data.dataKey))

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
                    .attr("transform", d => `translate(${defaultArc.centroid(d)})`)
                    .call(text => text.append("tspan")
                        .attr("font-weight", "bold")
                        .text(d => {
                            const amount = d.data._total ?? 0;
                            const percentage = Math.round(amount / total * 100);
                            return percentage > 5 ? `${percentage}%` : ''
                        })
                    )
            }
        );

    function handleArcHover(e: any, d: PieArcDatum<TransformedGraphData>, isHovered: boolean) {
        select(e.target)
            .transition()
            .duration(200)
            .ease(easeCubic)
            .attr("d", isHovered ? hoveredArc(d) : defaultArc(d))
    }




    return {
        handleArcHover
    };
}