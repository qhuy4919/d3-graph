import { BaseType, select } from "d3-selection";
import { ChartOptions, D3Selection } from "../model";
import { mergeClass } from "../util";

type SvgChildStructure = (
    selection: D3Selection<SVGSVGElement>,
    graphOptions: ChartOptions,
) => void;

type BuildSvg = {
    container: BaseType,
    svgKey: string,
    graphOptions: ChartOptions

    childElement?: SvgChildStructure
}
export function buildSvg({
    container,
    graphOptions,
    svgKey,
    childElement
}: BuildSvg) {
    const { width = 0, height = 0 } = graphOptions;
    select(container).selectAll('svg').remove();
    const svg = select(container).append('svg')
        .classed(mergeClass('d3-graph-svg', svgKey), true)
        .attr("width", width)
        .attr("height", height) as D3Selection<SVGSVGElement>;

    childElement?.(svg, graphOptions);

    return svg as D3Selection<SVGGElement>;
};

export function buildGraphStructure(
    selection: D3Selection<SVGSVGElement>,
    graphOptions: ChartOptions,
) {
    const { width = 0, height = 0, padding } = graphOptions;

    const groupListElement = selection.append('g')
        .classed('container-group', true)
        .attr('width', width)
        .attr('height', height)
        .attr('transform', `translate(${padding?.left + padding?.right},${padding?.top})`);
    groupListElement.append('g').classed('x-axis-group', true)
        .append('g').classed('x axis', true);
    groupListElement.selectAll('.x-axis-group')

    groupListElement.append('g').classed('y-axis-group', true)
        .append('g').classed('y axis', true);;
    groupListElement.append('g').classed('grid-lines-group', true);
    groupListElement.append('g').classed('chart-group', true);
    groupListElement.append('g').classed('metadata-group', true);
};


export function buildLegendStructure(
    selection: D3Selection<SVGSVGElement>,
) {

    const container = selection.append('g')
        .classed('legend-container-group', true)
    container
        .append('g')
        .classed('legend-group', true);

}
