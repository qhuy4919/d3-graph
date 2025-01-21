import { useEffect, useRef } from "react"
import { D3GraphContainer, DataPrimaryField, Datum } from "../model"
import { BaseType, select, Selection } from 'd3-selection';

export type D3Tooltip = {
    data: Datum[],
    dataSchema: DataPrimaryField


} & Partial<D3GraphContainer>;

export const D3Tooltip = ({
    data,
    dataSchema,
    width = 400,
    margin = { top: 5, right: 5, bottom: 5, left: 5 },


}: D3Tooltip) => {
    const rootNode = useRef<HTMLDivElement>(null);

    function buildSvg(container: BaseType) {
        let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined = undefined;
        if (!svg) {
            svg = select(container)
                .append('svg')
                .classed('chart-tooltip-svg', true)
        }

        svg
            .attr('width', width)
            .attr('height', 500)
    };

    function updateTooltip(data: Datum, xPosition: number, yPosition: number) {
        console.log('data: Datum, xPosition: number, yPosition: number',
            data, xPosition, yPosition
        )
    }

    // function getTooltipPosition([mouseX, mouseY]: [number, number]) {

    // }

    function build(_selection: Selection<HTMLDivElement | null, Datum[], null, undefined>) {
        _selection.each(function (data) {
            console.log(data);
            buildSvg(this)
        })
    }

    useEffect(() => {
        if (data) {
            build(select(rootNode.current))
        }
    }, [])

    return <div ref={rootNode} className='chart-tooltip'>

    </div>
}