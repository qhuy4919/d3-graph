import { useEffect, useRef } from "react"
import { GraphOptionsManager } from "../builder"
import { useD3GraphSceneContext } from "../context"
import { AnyD3Scale } from "../model"
import { getScaleTicks, mergeClass } from "../util"
import { D3Group } from "./group"
import { select } from "d3-selection"
import { ScaleRenderer } from "./scale"
import { D3GridSpec } from "../spec"

export type GridRenderer = {
    spec: D3GridSpec
};
export const GridRenderer = ({
    spec
}: GridRenderer) => {
    const { options, schema } = useD3GraphSceneContext();
    const gridRef = useRef<SVGGElement>(null);
    const { graphSpace } = new GraphOptionsManager(options);
    const {
        shape
    } = graphSpace

    const {
        className,
        opacity,
        orient,
        scale,
        stroke,
        strokeDasharray,
        strokeWidth,
    } = spec

    const scaleSpec = schema?.spec.getScale(scale);
    const gridScale = ScaleRenderer(scaleSpec) as AnyD3Scale;
    const tickData = getScaleTicks(gridScale)

    useEffect(() => {
        if (gridRef.current) {
            if (orient === 'horizontal') {
                const gridElement = select(gridRef.current);
                gridElement.selectAll('*').remove();
                gridElement
                    .selectAll('line.grid-row-line')
                    .data(tickData)
                    .enter()
                    .append('line')
                    .attr('class', 'd3-grid grid-row-line')
                    .attr('x1', 0)
                    .attr('x2', shape?.width ?? 0)
                    .attr('y1', (d) => gridScale(d))
                    .attr('y2', (d) => gridScale(d))
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth)
                    .style('opacity', opacity)
                    .style('stroke-dasharray', strokeDasharray);

            }

            else if (orient === 'vertical') {
                const gridElement = select(gridRef.current);
                gridElement.selectAll('*').remove();
                gridElement
                    .selectAll('line.grid-col-line')
                    .data(tickData)
                    .enter()
                    .append('line')
                    .attr('class', 'd3-grid grid-col-line')
                    .attr('y1', 0)
                    .attr('y2', shape?.height ?? 0)
                    .attr('x1', (d) => gridScale(d))
                    .attr('x2', (d) => gridScale(d))
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth)
                    .style('opacity', opacity)
                    .style('stroke-dasharray', strokeDasharray);
            }

        }

    }, [
        gridRef,
        gridScale,
        opacity,
        orient,
        shape?.height,
        shape?.width,
        stroke,
        strokeDasharray,
        strokeWidth,
        tickData,
    ]);

    return <D3Group
        innerRef={gridRef}
        className={mergeClass(`d3-grid_${orient}`, className)}

    >
    </D3Group>
}

export const D3Grid = () => {
    const { schema } = useD3GraphSceneContext();
    if (!schema) return <>Non Graph Available</>
    const gridSpecList = schema.spec.grid;
    return gridSpecList.map((spec, i) => {
        return <GridRenderer
            key={`d3-axis-${i}`}
            spec={spec}
        />
    })
}