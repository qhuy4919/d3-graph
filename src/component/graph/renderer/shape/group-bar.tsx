import React from 'react'
import {
    Accessor,
    AnyBandScale,
    BaseBarGroupProps,
    Datum as D3Datum,
    D3Scale,
    ScaleInput,
    BarGroup,
    AddSVGProps,
} from '../../model'
import { getScaleBandwidth, mergeClass } from '../../util';
import { D3Group } from '../group';
import { D3Bar } from './bar';

export type D3GroupBar<
    Datum extends D3Datum,
    Key extends string | number = string,
    X0Scale extends AnyBandScale = AnyBandScale,
    X1Scale extends AnyBandScale = AnyBandScale,
    YScale extends D3Scale<number> = D3Scale<number>
> = BaseBarGroupProps<Datum, Key> & {
    /** Returns the value mapped to the x0 (group position) of a bar */
    x0: Accessor<Datum, ScaleInput<X0Scale>>
    x0Scale: X0Scale,
    x1Scale: X1Scale,
    yScale: YScale,
    height: number,
    /** Override render function which is passed the computed BarGroups. */
    children?: (barGroups: BarGroup<Key>[]) => React.ReactNode;
}
export const D3GroupBar = <
    Datum extends D3Datum,
    Key extends string | number = string,
    X0Scale extends AnyBandScale = AnyBandScale,
    X1Scale extends AnyBandScale = AnyBandScale
>({
    data,
    className,
    top = 0,
    left = 0,
    height,
    x0Scale,
    x1Scale,
    yScale,
    keys,
    x0,
    color,
    children,
    ...rest
}: AddSVGProps<D3GroupBar<Datum, Key, X0Scale, X1Scale>, SVGRectElement>) => {
    const barWidth = getScaleBandwidth(x1Scale);

    const barGroups: BarGroup<Key>[] = data.map((group, i) => {
        return {
            index: i,
            x0: x0Scale(x0(group)) || 0,
            bars: keys.map((key, j) => {
                const value = group[key];
                return {
                    index: j,
                    key,
                    value,
                    width: barWidth,
                    x: x1Scale(key) || 0,
                    y: yScale(value) || 0,
                    color: color(key, j),
                    height: height - (yScale(value) || 0),
                };

            })
        }
    })

    if (children) return <>{children(barGroups)}</>;

    return (
        <D3Group
            top={top}
            left={left}
            className={mergeClass('d3-group-bar', className)}
        >
            {
                barGroups.map(barGroup => (
                    <D3Group
                        key={`d3-group-bar-${barGroup.x0}`}
                        left={barGroup.x0}
                    >
                        {
                            barGroup.bars.map((bar) => {
                                const { x, y, width, height, color } = bar;
                                return <D3Bar
                                    key={`d3-bar-${barGroup.index}-${bar.index}-${bar.key}`}
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    fill={color}
                                    {...rest}
                                />
                            })
                        }
                    </D3Group>
                ))
            }
        </D3Group>
    )
}
