import React from 'react'
import {
    Accessor,
    AnyBandScale,
    BaseBarGroupProps,
    Datum as D3Datum,
    D3Scale,
    ScaleInput,
    AddSVGProps,
    BarGroupHorizontal,
    D3GroupKey,
    PickD3Scale,
} from '../../model'
import { getScaleBandwidth, mergeClass } from '../../util';
import { D3Group } from '../group';
import { D3Bar } from './bar';

export type D3GroupBarHorizontal<
    Datum extends D3Datum,
    Key extends D3GroupKey = D3GroupKey,
    Y0Scale extends AnyBandScale = AnyBandScale,
    Y1Scale extends AnyBandScale = AnyBandScale,
> = BaseBarGroupProps<Datum, Key> & {
    /** Returns the value (Datum[key]) mapped to the x of a bar */
    x?: (barValue: number) => number;
    /** Returns the value mapped to the y0 (group position) of a bar */
    y0: Accessor<Datum, ScaleInput<Y0Scale>>
    y0Scale: Y0Scale,
    y1Scale: Y1Scale,
    xScale: D3Scale<number>,
    colorScale: PickD3Scale<'ordinal', string>
    width: number,
    /** Override render function which is passed the computed BarGroups. */
    children?: (barGroups: BarGroupHorizontal<Key>[]) => React.ReactNode;
}
export const D3GroupBarHorizontal = <
    Datum extends D3Datum,
    Key extends D3GroupKey = D3GroupKey,
    Y0Scale extends AnyBandScale = AnyBandScale,
    Y1Scale extends AnyBandScale = AnyBandScale,
>({
    data,
    className,
    top = 0,
    left = 0,
    x,
    width,
    y0Scale,
    y1Scale,
    xScale,
    colorScale,
    keys,
    y0,
    children,
    ...rest
}: AddSVGProps<D3GroupBarHorizontal<Datum, Key, Y0Scale, Y1Scale>, SVGRectElement>) => {
    const harHeight = getScaleBandwidth(y1Scale);

    const barGroups: BarGroupHorizontal<Key>[] = data.map((group, i) => {
        return {
            index: i,
            y0: y0Scale(y0(group)) || 0,
            bars: keys.map((key, j) => {
                const value = group[key];
                return {
                    index: j,
                    key,
                    value,
                    height: harHeight,
                    x: x?.(value) || 0,
                    y: y1Scale(key) || 0,
                    color: colorScale(key),
                    width: xScale(value) || 0
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
                        key={`d3-group-bar-${barGroup.y0}`}
                        left={barGroup.y0}
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
