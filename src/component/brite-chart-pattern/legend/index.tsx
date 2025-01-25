import { ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { Selection, BaseType, select } from 'd3-selection';
import { useEffect, useRef } from 'react';
import { D3GraphContainer, DataPrimaryField, Datum } from '../model';
import colorHelper from '../color';
import { getLineElementMargin, getTextWidth } from '../util';
export type D3Legend = {
    data: Datum[],
    textSize?: number,
    textLetterSpacing?: number,
    markerSize?: number,
    marginRaito?: number,
    numberLetterSpacing?: number,
    numberFormat?: string,

    isHorizontal?: boolean

    //color
    colorScale: ScaleOrdinal<string, unknown, never>
    colorSchema?: string[],

    //data format
    dataSchema: DataPrimaryField

} & Partial<D3GraphContainer>;


export const D3Legend = ({
    data,
    width = 1000,
    height = 150,
    textSize = 12,
    textLetterSpacing = 0.5,
    markerSize = 16,
    marginRaito = 1.5,
    numberLetterSpacing = 0.8,


    dataSchema,
    //
    colorScale

}: D3Legend) => {
    const margin = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    };
    const markerYOffset = - (textSize - 2) / 2;

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const legendRef = useRef<HTMLDivElement>(null);


    function reduceData(data: Datum[]) {
        const validateStackField = Object.keys(data[0]).includes(dataSchema.stackLabel);
        if (validateStackField) {
            return Array.from(new Set(data.map(x => x[dataSchema.stackLabel])))
        }
        return [];
    }
    function build(_selection: Selection<HTMLDivElement | null, Datum[], null, undefined>) {
        _selection.each(function (data) {
            const stackList = reduceData(data);
            const legendColorMap = buildColorScheme();
            drawHorizontalLegend({
                legendColorMap,
                stackList,
                svg: buildSvg(this),
            });

        })
    }

    function createLegend(element: HTMLDivElement | null, data: Datum[]) {
        const legendContainer = select(element);
        legendContainer.datum(data).call(build)
    }

    function buildLegendGroup(svg?: Selection<SVGSVGElement, unknown, null, undefined>) {
        const interSvg = svg;
        if (interSvg) {
            const container = interSvg.append('g')
                .classed('legend-container-group', true)
                .attr('transform', `translate(${margin.left},${margin.top})`);

            container
                .append('g')
                .classed('legend-group', true);

            return container;
        };
        return interSvg;
    }
    function buildSvg(container: BaseType) {
        let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined = undefined;
        if (!svg) {
            svg = select(container)
                .append('svg')
                .classed('d3-chart-legend', true)
        }
        svg
            ?.attr('width', width)
            ?.attr('height', height)

        return buildLegendGroup(svg);

    }

    function drawHorizontalLegend({
        svg,
        legendColorMap,
        stackList
    }: {
        svg?: Selection<SVGGElement, unknown, null, undefined>,
        legendColorMap: Record<string, string>,
        stackList: string[]
    }) {
        let xOffset = markerSize;
        if (svg) {
            svg.select('.legend-group')
                .selectAll('g')
                .remove();

            // We want a single line
            svg.select('.legend-group')
                .append('g')
                .classed('legend-line', true);

            // And one entry per data item
            const entries = svg.select('.legend-line')
                .selectAll('g.legend-entry')
                .data(stackList ?? []);

            // // Enter
            entries.enter()
                .append('g')
                .classed('legend-entry', true)
                .attr('data-item', d => d)
                .attr('transform', function (name) {
                    const horizontalOffset = xOffset,
                        lineHeight = chartHeight / 2,
                        verticalOffset = lineHeight,
                        labelWidth = getTextWidth(name, textSize);

                    xOffset += markerSize + 2 * getLineElementMargin(marginRaito, markerSize) + labelWidth;
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

    }



    useEffect(() => {
        if (data && legendRef.current) {
            createLegend(legendRef.current, data);
        };
    }, [])


    return <div ref={legendRef} className='legend-container'></div>
}