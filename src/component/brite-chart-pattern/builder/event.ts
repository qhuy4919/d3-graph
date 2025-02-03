import { select } from "d3-selection"
import { D3MouseEvent, TransformedGraphData } from "../model"


export function buildMouseEvent({
    selection,
    selectionElement,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onClick,
}: D3MouseEvent) {

    selection.selectAll<HTMLElement, TransformedGraphData>(`.${selectionElement}`)
        .on('mouseover', function (e, d) {
            const parentNode = this.parentNode as Element;

            if (!parentNode) return;
            const key: string = select(parentNode).datum()?.key;
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
        .on('click', function (e, d) {
            onClick?.(e, d);
        })
};

