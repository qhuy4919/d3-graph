import { D3BaseGraphData, D3EventListeners, D3Selection } from "../model";

type DynamicTooltip<T> = {
    selection: D3Selection<HTMLDivElement, D3BaseGraphData>,
    defaultTooltip: (d?: T) => string
}

export function drawTooltip<T extends Record<string, unknown>>({
    selection,
    defaultTooltip,
}: DynamicTooltip<T>): D3EventListeners<T> {
    selection
        .style("opacity", 0)
        .style('display', "none");


    function defaultOnMouseOver(
        e: any,
        d?: T,
        customTooltip?: (d?: T) => string
    ) {
        const tooltip = customTooltip?.(d) ?? defaultTooltip(d);
        selection.html(`${tooltip}`)
            .style("opacity", 0.9)
            .style('display', 'block')
            .style('visibility', 'visible')
    }

    function defaultOnMouseOut() {
        selection
            .style("opacity", 0)
            .style('visibility', 'hidden')

    }

    function defaultOnMouseMove(e: any) {
        selection.style("left", e?.offsetX + 10 + "px")
            .style("top", e?.offsetY + 10 + "px")
    }


    return {
        onMouseOver: (e, d, customProps) => {
            defaultOnMouseOver(e, d, customProps?.customTooltip)

        },
        onMouseOut: () => {
            console.log('12313');
            defaultOnMouseOut()
        },
        onMouseMove: (e) => {
            defaultOnMouseMove(e)
        }
    }

}


