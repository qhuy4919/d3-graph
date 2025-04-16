import { useEffect, useRef } from "react"
import { GraphOptionsManager } from "../builder"
import { useD3GraphSceneContext } from "../context"
import { AnyD3Scale, CommonGridProps, DEFAULT_GRID_STROKE, DEFAULT_GRID_STROKE_WIDTH } from "../model"
import { getScaleTicks, mergeClass } from "../util"
import { D3Group } from "./group"
import { select } from "d3-selection"
import { ScaleRenderer } from "./scale"

export type D3GridRow = CommonGridProps
export const D3GridRow = ({
    scale,
    className,
    stroke = DEFAULT_GRID_STROKE,
    strokeWidth = DEFAULT_GRID_STROKE_WIDTH,
    opacity = 0.3,
}: D3GridRow) => {
    const { options, schema } = useD3GraphSceneContext();
    const gridRef = useRef<SVGGElement>(null);
    const { graphSpace } = new GraphOptionsManager(options);
    const {
        shape
    } = graphSpace

    const scaleSpec = schema?.spec.getScale(scale);
    const ticks = scaleSpec?.ticks
    const gridScale = ScaleRenderer(scaleSpec) as AnyD3Scale;
    const tickData = getScaleTicks(gridScale, ticks)

    useEffect(() => {
        if (gridRef) {
            // select(gridRef.current)
            //     .selectAll('line.grid-row-line')
            //     .data(tickData)
            //     .enter()
            //     .append('line')
            //     .attr('class', 'grid-row-line')
            //     .attr('x1', 0)
            //     .attr('x2', shape?.width ?? 0)
            //     .attr('y1', (d) => gridScale(d))
            //     .attr('y2', (d) => gridScale(d))
            //     .attr('stroke', stroke)
            //     .style('opacity', opacity)
            //     .attr('stroke-width', strokeWidth);

            select(gridRef.current)
                .selectAll('line.grid-col-line')
                .data(tickData)
                .enter()
                .append('line')
                .attr('class', 'grid-col-line')
                .attr('y1', 0)
                .attr('y2', shape?.height ?? 0)
                .attr('x1', (d) => gridScale(d))
                .attr('x2', (d) => gridScale(d))
                .attr('stroke', stroke)
                .style('opacity', opacity)
                .attr('stroke-width', strokeWidth);

        }
    }, [gridRef]);

    return <D3Group
        innerRef={gridRef}
        className={mergeClass('d3-grid-row', className)}

    >

    </D3Group>
}