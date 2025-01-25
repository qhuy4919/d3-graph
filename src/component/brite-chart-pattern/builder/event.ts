import { select } from "d3-selection"
import { D3Selection, TransformedGraphData } from "../model"

type MouseEventCallBack = (
    event: any,
    d: TransformedGraphData | unknown
) => void;

type MouseEvent = {
    selection: D3Selection<SVGGElement>,
    selectionElement: string
    //
    onMouseOver?: MouseEventCallBack,
    onMouseOut?: MouseEventCallBack,
    onClick?: MouseEventCallBack,
}
export function buildMouseEvent({
    selection,
    selectionElement = 'bar',
    //
    onMouseOver
}: MouseEvent) {
    selection.selectAll(`.${selectionElement}`)
        .on('mouseover', function (e, d) {
            onMouseOver?.(e, d);
            select(this)
                .attr('opacity', '0.75')
        })
        .on('mouseout', function (this) {
            select(this)
                .attr('opacity', '1')
        })
}