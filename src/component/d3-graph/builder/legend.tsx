import { getLineElementMargin, getTextWidth } from "../util"
import { D3LegendShape, D3Selection, DynamicLegendProps, TransformedGraphData } from "../model";
import { BaseType } from "d3-selection";

export function drawLegend({
    selection,
    data,
    colorScale,
    fontSize = 12,
    textLetterSpacing = 0.5,
    markerSize = 12,
    marginRatio = 1.5,
    legendLabel = 'Legend',
    chartHeight,
    chartWidth,
}: DynamicLegendProps) {
    const lineHeight = chartHeight;
    let xOffset = 0;
    let yOffset = lineHeight;
    let currentLine = 1;
    const markerYOffset = - (fontSize - 2) / 2;
    const legendLabelList = [
        ...new Set(
            data.map(d => d.type)
        )
    ];

    function transformLabel(name: string, isLabel?: boolean) {
        const labelWidth = isLabel
            ? getTextWidth(name, fontSize) + markerSize
            : markerSize + getLineElementMargin(marginRatio, markerSize) + getTextWidth(name, fontSize);
        const isNewLine = Math.ceil((xOffset + labelWidth) / chartWidth * currentLine) > currentLine;
        let horizontalOffset = xOffset;
        let verticalOffset = yOffset;

        if (isNewLine) {
            currentLine += 1;
            xOffset = markerSize + getTextWidth(legendLabel, fontSize);
            yOffset += markerSize * 2;
            horizontalOffset = xOffset;
            verticalOffset = yOffset
        }

        xOffset += labelWidth;

        return `translate(${horizontalOffset},${verticalOffset})`
    }

    function buildLegendMarker(selection: D3Selection<BaseType, string, TransformedGraphData>) {
        return selection.enter()
            .append('g')
            .classed('legend-entry', true)
            .attr('data-item', d => d)
            .attr('transform', function (name) {
                return transformLabel(name);
            })
            // .append('circle')
            // .classed('legend-circle', true)
            // .attr('cx', markerSize / 2)
            // .attr('cy', markerYOffset)
            // .attr('r', markerSize / 2)
            // .style('fill', (d) => colorScale(d))
            // .style('stroke-width', 1);
            .append('rect')
            .attr('x', 0)
            .attr('y', -markerSize)
            .attr('width', markerSize)
            .attr('height', markerSize)
            .style('fill', (d) => colorScale(d))
            .style('stroke-width', 1);
    }

    function drawHorizontalLegend(svg: D3Selection<SVGGElement>) {
        svg.select('.legend-group')
            .selectAll('g')
            .remove();
        svg.select('.legend-group')
            .append('g')
            .classed('legend-line', true);

        svg.select('.legend-group')
            .append('g')
            .classed('legend-label', true)

        const entries = svg.select('.legend-line')
            .selectAll('g.legend-entry')
            .data(legendLabelList ?? []);

        svg.select('.legend-label')
            .append('text')
            .text(`${legendLabel}:`)
            .attr('transform', function () {
                return transformLabel(legendLabel, true);
            })
            .style('font-size', `${fontSize}px`)
            .style('color', 'white')
            .style('font-weight', 'bold')

        buildLegendMarker(entries);

        svg.select('.legend-group')
            .selectAll('g.legend-entry')
            .append('text')
            .classed('legend-entry-name', true)
            .text(d => d as string)
            .attr('x', 1.5 * markerSize)
            .style('font-size', `${fontSize}px`)
            .style('letter-spacing', `${textLetterSpacing}px`);

    }


    drawHorizontalLegend(selection);

}