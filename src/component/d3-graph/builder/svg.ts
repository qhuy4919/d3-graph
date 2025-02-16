import { BaseType, select } from "d3-selection";
import { D3GraphContainer, D3Selection } from "../model";

type SvgChildStructure = (
    selection: D3Selection<SVGSVGElement>,
    containerSize: D3GraphContainer,
) => void;

type BuildSvg = {
    container: BaseType,

    //container
    containerProps: D3GraphContainer

    childElement?: SvgChildStructure
}
export function buildSvg({
    container,
    containerProps,
    childElement
}: BuildSvg) {
    const {
        width,
        height,
        margin,
    } = containerProps
    select(container).selectAll('svg').remove();
    const svg = select(container).append('svg')
        .classed('d3-graph-svg', true)
        .attr("width", width)
        .attr("height", height) as D3Selection<SVGSVGElement>;

    childElement?.(svg, { width, height, margin });

    return svg as D3Selection<SVGGElement>;
};

export function buildGraphStructure(
    selection: D3Selection<SVGSVGElement>,
    containerSize: D3GraphContainer,
) {
    const { margin } = containerSize

    const groupListElement = selection.append('g')
        .classed('container-group', true)
        .attr('transform', `translate(${margin?.left + margin?.right},${margin?.top})`);
    groupListElement.append('g').classed('x-axis-group', true)
        .append('g').classed('x axis', true);

    groupListElement.selectAll('.x-axis-group')
        .append('g').classed('month-axis', true);

    groupListElement.append('g').classed('y-axis-group axis', true);
    groupListElement.append('g').classed('grid-lines-group', true);
    groupListElement.append('g').classed('chart-group', true);
    groupListElement.append('g').classed('y-axis-label', true);
    groupListElement.append('g').classed('metadata-group', true);
};


export function buildLegendStructure(
    selection: D3Selection<SVGSVGElement>,
    containerSize: D3GraphContainer,
) {
    const { margin, height } = containerSize;

    const container = selection.append('g')
        .classed('legend-container-group', true)
        .attr('transform', `translate(${margin?.left}, -${height / 2})`); // 16 is fontsize of legend
    container
        .append('g')
        .classed('legend-group', true);

}

export function buildTooltipStructure(
    selection: D3Selection<SVGSVGElement>,
    containerSize: D3GraphContainer,
) {
    const { margin } = containerSize;

    selection.append('g')
        .classed('tooltip-container-group select-disable', true)
        .attr('transform', `translate( ${margin?.left}, ${margin?.top})`);

    selection.append('g').classed('tooltip-group', true);

}