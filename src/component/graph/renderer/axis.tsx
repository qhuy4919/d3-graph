import { useEffect, useRef } from "react"
import { AxisScale } from "../model"
import { D3AxisSpec } from "../spec"
import { mergeClass } from "../util"
import { D3Group } from "./group"
import { select } from "d3-selection"
import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis"
import { useD3GraphSceneContext } from "../context"
import { ScaleRenderer } from "./scale"

export type AxisRenderer = {
    spec: D3AxisSpec
}
export const AxisRenderer = ({
    spec
}: AxisRenderer) => {
    const { schema, options } = useD3GraphSceneContext();

    const {
        width = 0,
        height = 0
    } = options;

    const {
        className,
        transform,
    } = spec

    const axisRef = useRef<SVGGElement>(null);

    const axisBackbone = ({
        orient,
        scale,
        ticks = 5,
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
        const axisScale = ScaleRenderer(schema?.spec.getScale(scaleName)) as AxisScale;
        if (!axisScale) throw new Error('axis scale error!');

        return axis(axisScale)
            .ticks(ticks)
            .tickPadding(tickPadding)
    };


    useEffect(() => {
        if (axisRef) {
            select(axisRef.current)
                .call(d => axisBackbone(spec)(d))
                .attr('transform', transform)
        }
    }, [axisRef])

    return <D3Group
        innerRef={axisRef}
        className={mergeClass('d3-axis', className)}
        height={height}
        width={width}
    >
    </D3Group>
}

export const D3Axis = () => {
    const { schema } = useD3GraphSceneContext();
    if (!schema) return <>Non Graph Available</>
    const axisSpecList = schema.spec.axes;
    return axisSpecList.map((spec, i) => {
        //Cannot spread instance of class
        //  therfore have to pass it into props
        return <AxisRenderer
            key={`d3-axis-${i}`}
            spec={spec}
        />
    })
}