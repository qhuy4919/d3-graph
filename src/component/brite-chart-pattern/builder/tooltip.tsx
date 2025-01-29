import { D3Selection } from "../model";

type DynamicTooltip = {
    selection: D3Selection<HTMLDivElement>,
}

export function drawTooltip({
    selection,
}: DynamicTooltip) {
    function drawTooltip(svg: D3Selection<HTMLDivElement>) {
        svg
            .style("opacity", 0)
            .style('display', "none")
        return svg;
    };

    function defaultOnMouseOver(key: string, d: unknown) {
        const entryData = d?.data?.[key];
        selection.html(
            "Date: " + entryData.name +
            "<br>" +
            "Value: " + entryData.value +
            "<br>" +
            "Type: " + entryData.type
        )

            .style("opacity", 1)
            .style('display', 'block')
    }

    function defaultOnMouseOut() {
        selection.style("opacity", 0)
            .style('display', 'none')
    }

    function defaultOnMouseMove(position: [number, number]) {
        selection.style("left", position[0] + 50 + "px")
            .style("top", position[1] + 50 + "px")
    }

    return Object.assign(
        drawTooltip(selection),
        {
            mouseEvent: {
                mouseover: (key: string, d: unknown) => {
                    try {
                        defaultOnMouseOver(key, d)
                    } catch {
                        throw new Error('Missing data key')
                    }
                },
                mouseout: () => {
                    defaultOnMouseOut()
                },
                mousemove: (position: [number, number]) => {
                    defaultOnMouseMove(position)
                }
            }
        }
    );

}