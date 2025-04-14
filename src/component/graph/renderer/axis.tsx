import { useEffect, useRef } from "react"
import { GraphOptionsManager } from "../builder"
import { AxisScale, ChartOptions } from "../model"
import { D3AxisSpec } from "../spec"
import { mergeClass } from "../util"
import { D3Group } from "./group"
import { select } from "d3-selection"
import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis"
import { useD3GraphSceneContext } from "../context"
import { ScaleRenderer } from "./scale"

export type AxisRenderer = {
    graphOptions: ChartOptions
    spec: D3AxisSpec
}
export const AxisRenderer = ({
    graphOptions,
    spec,
}: AxisRenderer) => {
    const { builder } = useD3GraphSceneContext();

    const {
        width = 0,
        height = 0
    } = graphOptions;
    const {
        className,
    } = spec;

    const axisRef = useRef<SVGGElement>(null);

    const axisBackbone = ({
        orient,
        scale,
        ticks,
        tickPadding,
    }: D3AxisSpec) => {
        let axis;
        switch (orient) {
            case 'bottom':
                axis = axisBottom;
                break;
            case 'top':
                axis = axisTop;
                break;
            case 'left':
                axis = axisLeft;
                break;
            case 'right':
                axis = axisRight
                break;
            default:
                throw new Error('Invalid axis orientation')
        }
        const scaleName = scale;
        const axisScale = ScaleRenderer(builder?.spec.getScale(scaleName)) as AxisScale;
        if (!axisScale) throw new Error('axis scale error!');

        return axis(axisScale)
            .ticks(ticks)
            .tickPadding(tickPadding)
    };


    useEffect(() => {
        if (axisRef) {
            select(axisRef.current)
                .call(d => axisBackbone(spec)(d))

        }
    }, [axisRef])

    const { paddingTop, paddingLeft } = new GraphOptionsManager(graphOptions);
    return <D3Group
        innerRef={axisRef}
        className={mergeClass('d3-axis', className)}
        transform={`translate(${paddingLeft}, ${paddingTop})`}
        height={height}
        width={width}
    >
    </D3Group>
}