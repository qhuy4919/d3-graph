import React from 'react';
import { AddSVGProps } from '../../model';
import { mergeClass } from '../../util';

interface Point {
    x?: number;
    y?: number;
}

export type D3Line = {
    /** className to apply to line element. */
    className?: string;
    /** reference to line element. */
    innerRef?: React.Ref<SVGLineElement>;
    /** fill color applied to line element. */
    fill?: string;
    /** Starting x,y point of the line. */
    from?: Point;
    /** Ending x,y point of the line. */
    to?: Point;
};

export function D3Line({
    from = { x: 0, y: 0 },
    to = { x: 1, y: 1 },
    fill = 'transparent',
    className,
    innerRef,
    ...restProps
}: AddSVGProps<D3Line, SVGLineElement>) {
    const isRectilinear = from.x === to.x || from.y === to.y;
    return (
        <line
            ref={innerRef}
            className={mergeClass('d3-line', className)}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            fill={fill}
            shapeRendering={isRectilinear ? 'crispEdges' : 'auto'}
            {...restProps}
        />
    );
}
