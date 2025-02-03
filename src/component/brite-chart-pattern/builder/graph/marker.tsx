import { select } from "d3-selection";
import { ChartSize, D3Selection, DynamicGraphProps } from "../../model";

export function highlightMarker(
    selection: D3Selection<SVGGElement>,
    [x, y]: [number, number],
    color?: string
) {
    selection
        .attr('transform', `translate(${x},${y})`);
    selection
        .selectAll('.horizontal-graph-marker')
        .attr('stroke', color ?? 'transparent')




}

type GraphMarker = {
} & ChartSize & Pick<DynamicGraphProps, 'graphSvg'>


export function drawMarker({
    graphSvg,
    chartHeight,
    chartWidth
}: GraphMarker) {

    const graphMarkerContainer = graphSvg.select('.metadata-group')
        .append('g')
        .attr('class', 'hover-marker graph-marker-container')
        .attr('transform', 'translate(9999, 0)')


    graphMarkerContainer.selectAll('path')
        .data([{
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        }])
        .enter()
        .append('line')
        .classed('vertical-graph-marker', true)
        .attr('x1', 0)
        .attr('y1', chartHeight)
        .attr('x2', 0)
        .attr('y2', 0)
        .style('stroke-dasharray', ('3, 3'))
        .attr('stroke-width', '1px');

    graphMarkerContainer.selectAll('path')
        .data([{
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        }])
        .enter()
        .append('line')
        .classed('horizontal-graph-marker', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', chartWidth)
        .attr('y2', 0)
        .attr('stroke', 'red')
        .style('stroke-dasharray', ('4, 6'))
        .attr('stroke-width', '1px');

    select('.bar').on('customMouseOver', () => {
        console.log('hic')
    })

    return graphMarkerContainer as D3Selection<SVGGElement>
};