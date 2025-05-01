import React from 'react';
import { Line as LineType } from 'd3-shape';
import { d3Line } from '../../builder';
import { mergeClass } from '../../util';
import {
    AddSVGProps,
    LinePathConfig,
    D3Datum,
} from '../../model';
import { D3Graph } from '../../graph';

export type D3LinePath<Datum extends D3Datum> = {
    /** Array of data for which to generate a line shape. */
    data?: Datum[];
    /** React RefObject passed to the path element. */
    innerRef?: React.Ref<SVGPathElement>;
    /** Override render function which is passed the configured path generator as input. */
    children?: (args: { path: LineType<Datum> }) => React.ReactNode;
    /** Fill color of the path element. */
    fill?: string;
    /** className applied to path element. */
    className?: string;
}
    & LinePathConfig<Datum>
    & Pick<D3Graph<Datum>, 'signalListener'>;

export function D3LinePath<Datum extends D3Datum>({
    children,
    data = [],
    x,
    y,
    fill = 'transparent',
    className,
    curve,
    innerRef,
    ...restProps
}: AddSVGProps<D3LinePath<Datum>, SVGPathElement>) {
    const path = d3Line<Datum>({ x, y, curve });

    if (children) return <>{children({ path })}</>;


    return (
        <path
            ref={innerRef}
            className={mergeClass('d3-line-path', className)}
            fill={fill}
            d={path(data) ?? ''}
            // without this a Datum surrounded by nulls will not be visible
            // https://github.com/d3/d3-shape#line_defined
            strokeLinecap="round"
            {...restProps}
        />
    );
}

