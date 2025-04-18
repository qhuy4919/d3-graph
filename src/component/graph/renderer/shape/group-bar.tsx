import React from 'react'
import {
    AnyBandScale,
    BaseBarGroupProps,
    Datum as D3Datum,
    BarGroup,
    AddSVGProps,
    PickD3Scale,
} from '../../model'
import { getScaleBandwidth, mergeClass } from '../../util';
import { D3Group } from '../group';
import { D3Bar } from './bar';
import { groups as d3Groups } from 'd3-array';
import { D3text } from '../text';

export type D3GroupBar<
    Datum extends D3Datum,
    X0Scale extends AnyBandScale = AnyBandScale,
    X1Scale extends AnyBandScale = AnyBandScale,
> = BaseBarGroupProps<Datum> & {
    /** Returns the value mapped to the x0 (group position) of a bar */
    x0Scale: X0Scale,
    x1Scale: X1Scale,
    yScale: PickD3Scale<'linear', number>,
    colorScale: PickD3Scale<'ordinal', string>
    height: number,
    /** Override render function which is passed the computed BarGroups. */
    children?: (barGroups: BarGroup[]) => React.ReactNode;
}
export const D3GroupBar = <
    Datum extends D3Datum,
    X0Scale extends AnyBandScale = AnyBandScale,
    X1Scale extends AnyBandScale = AnyBandScale,
>({
    data,
    className,
    top = 0,
    left = 0,
    height,
    x0Scale,
    x1Scale,
    yScale,
    colorScale,
    children,
    ...rest
}: AddSVGProps<D3GroupBar<Datum, X0Scale, X1Scale>, SVGRectElement>) => {
    const barWidth = getScaleBandwidth(x1Scale);
    const groupData = d3Groups(data, d => d['period']);

    const barGroups: BarGroup[] = groupData.map((group, i) => {
        const [key, dataList] = group;

        return {
            index: i,
            x0: x0Scale(key) || 0,
            bars: dataList.map((data, j) => {
                const {
                    amount,
                    period,
                    type,
                } = data;
                return {
                    index: j,
                    key: `${period}-${type}`,
                    value: amount,
                    width: barWidth,
                    x: x1Scale(type) || 0,
                    y: yScale(amount) || 0,
                    color: colorScale(type),
                    height: height - yScale(amount),
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
                        key={`d3-group-bar-${barGroup.x0}--${barGroup.index}`}
                        left={barGroup.x0}
                    >
                        {
                            barGroup.bars.map((bar) => {
                                const { x, y, width, height, color, value } = bar;
                                return <>
                                    <D3Bar
                                        {...rest}
                                        key={`d3-bar-${barGroup.index}-${bar.index}-${bar.key}`}
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={color}
                                    />
                                    <D3text
                                        x={x + width / 2}
                                        y={y - 10}
                                        fill="grey"
                                        fontWeight={'bold'}
                                        textAnchor='middle'
                                        fontSize={14}
                                    >
                                        {value}
                                    </D3text>
                                </>
                            })
                        }
                    </D3Group>
                ))
            }
        </D3Group>
    )
}
