import { ScaleOrdinal } from "d3-scale"
import { D3Selection } from "../model"
import { getLineElementMargin, getTextWidth } from "../util"

type DynamicLegendProps = {
    selection: D3Selection<SVGGElement>,
    legendList: string[],
    //color
    colorScale: ScaleOrdinal<string, string>,
    colorSchema?: string[],
    //styling
    textSize?: number,
    textLetterSpacing?: number,
    markerSize?: number,
    marginRatio?: number,
    numberLetterSpacing?: number,
    numberFormat?: string,
}
export function buildLegend({
    selection,
    legendList,
    textSize = 12,
    textLetterSpacing = 0.5,
    markerSize = 16,
    marginRatio = 1.5,

    colorScale,
}: DynamicLegendProps) {
    let xOffset = markerSize;
    const markerYOffset = - (textSize - 2) / 2;

    function drawHorizontalLegend(svg: D3Selection<SVGGElement>) {
        svg.select('.legend-group')
            .selectAll('g')
            .remove();
        svg.select('.legend-group')
            .append('g')
            .classed('legend-line', true);

        const entries = svg.select('.legend-line')
            .selectAll('g.legend-entry')
            .data(legendList ?? []);

        entries.enter()
            .append('g')
            .classed('legend-entry', true)
            .attr('data-item', d => d)
            .attr('transform', function (name) {
                const horizontalOffset = xOffset,
                    lineHeight = 100 / 2,
                    verticalOffset = lineHeight,
                    labelWidth = getTextWidth(name, textSize);

                xOffset += markerSize + 2 * getLineElementMargin(marginRatio, markerSize) + labelWidth;
                return `translate(${horizontalOffset},${verticalOffset})`;
            })
            .append('circle')
            .classed('legend-circle', true)
            .attr('cx', markerSize / 2)
            .attr('cy', markerYOffset)
            .attr('r', markerSize / 2)
            .style('fill', (d) => colorScale(d))
            .style('stroke-width', 1);

        svg.select('.legend-group')
            .selectAll('g.legend-entry')
            .append('text')
            .classed('legend-entry-name', true)
            .text(d => d as string)
            .attr('x', 1.5 * markerSize)
            .style('font-size', `${textSize}px`)
            .style('letter-spacing', `${textLetterSpacing}px`);
    }


    drawHorizontalLegend(selection);

}