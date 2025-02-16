import { select } from "d3-selection"
import { D3MouseEvent } from "../model"


export function buildMouseEvent<DataShape>({
    selection,
    selectionElement,
    dispatcher,
}: D3MouseEvent<DataShape>) {
    const graphSelection = selection.selectAll<HTMLElement, DataShape>(`.${selectionElement}`)
        .on('mouseover', function (e, d) {
            dispatcher.call('chartMouseOver', e, d);
            select(this)
                .attr('opacity', '0.75')
        })
        .on('mouseout', function (e, d) {
            dispatcher.call('chartMouseOut', e, d);
            select(this)
                .attr('opacity', '1')
        })
        .on('mousemove', function (e, d) {
            dispatcher.call('chartMouseMove', e, d);
        })
        .on('click', function (e, d) {
            dispatcher.call('chartClick', e, d);
        })

    return graphSelection;
};

