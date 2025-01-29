import { select } from "d3-selection"
import { D3Selection, TransformedGraphData } from "../model"

type MouseEventCallBack = (
    event: any,
    d: TransformedGraphData | unknown,
) => void;
type OnMouseOverEvent = (
    event: any,
    d: TransformedGraphData | unknown,
    key: string,
) => void

type MouseEvent = {
    selection: D3Selection<SVGGElement>,
    selectionElement: string
    //
    onMouseOver?: OnMouseOverEvent,
    onMouseOut?: MouseEventCallBack,
    onMouseMove?: MouseEventCallBack
    onClick?: MouseEventCallBack,
}
export function buildMouseEvent({
    selection,
    selectionElement = 'bar',
    //
    onMouseOver,
    onMouseOut,
    onMouseMove
}: MouseEvent) {
    selection.selectAll<HTMLElement, TransformedGraphData>(`.${selectionElement}`)
        .on('mouseover', function (e, d) {
            const parentNode = this.parentNode as Element;
            if (!parentNode) return;
            const key: string = select(parentNode).datum()?.key
            onMouseOver?.(e, d, key);
            select(this)
                .attr('opacity', '0.75')
        })
        .on('mouseout', function (e, d) {
            onMouseOut?.(e, d);
            select(this)
                .attr('opacity', '1')
        })
        .on('mousemove', function (e, d) {
            onMouseMove?.(e, d)
        })
}