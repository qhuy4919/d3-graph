import React from 'react'
import {
    AnyBandScale,
    BaseBarGroupProps,
    Datum as D3Datum,
    BarGroup,
    AddSVGProps,
    PickD3Scale,
    DEFAULT_GRID_DASHARRAY,
} from '../../model'
import { getScaleBandwidth, mergeClass } from '../../util';
import { D3Group } from '../group';
import { D3Bar } from './bar';
import { groups as d3Groups } from 'd3-array';
import { D3Text } from '../text';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { useD3GraphSceneContext } from '../../context';
import { TooltipRenderer } from '../tooltip';
import { D3Line } from './line';
import { GraphOptionsManager } from '../../builder';
import { D3Graph } from '../../graph';

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
    children?: (barGroups: BarGroup[]) => React.ReactNode,
} & Pick<D3Graph<Datum>, 'signalListener'>;

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
    signalListener,
    children,
    ...rest
}: AddSVGProps<D3GroupBar<Datum, X0Scale, X1Scale>, SVGRectElement>) => {
    const { schema, options } = useD3GraphSceneContext();
    const { graphSpace } = new GraphOptionsManager(options)
    const tooltipSpec = schema?.spec.getTooltip('graph');
    const barWidth = getScaleBandwidth(x1Scale);
    const groupData = d3Groups(data, d => d['period']);
    const {
        barClick,
    } = signalListener ?? {};

    const {
        tooltipOpen,
        tooltipLeft,
        tooltipTop,
        tooltipData,
        hideTooltip,
        showTooltip
    } = useTooltip<Datum>();
    const {
        TooltipInPortal
    } = useTooltipInPortal({
        detectBounds: true
    });


    const barGroups: BarGroup<Datum>[] = groupData.map((group, i) => {
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
                    data: data,
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
                        key={`d3-group-bar-${barGroup.x0}-${barGroup.index}`}
                        left={barGroup.x0}
                    >
                        {
                            barGroup.bars.map((bar) => {
                                const { x, y, width, height, color, value, key, data } = bar;
                                return <React.Fragment
                                    key={`d3-bar-${barGroup.index}-${bar.index}-${bar.key}`}
                                >
                                    <D3Bar
                                        {...rest}
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={color}
                                        onClick={() => {
                                            barClick?.(key, data)
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '0.8';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                            hideTooltip();
                                        }}
                                        onMouseMove={(e) => {
                                            const eventSvgCoords = localPoint(e);
                                            showTooltip({
                                                tooltipData: bar.data,
                                                tooltipTop: eventSvgCoords?.y ?? 0,
                                                tooltipLeft: eventSvgCoords?.x ?? 0,
                                            });

                                        }}
                                    />
                                    <D3Text
                                        key={`d3-bar-text-${barGroup.index}-${bar.index}-${bar.key}`}
                                        x={x + width / 2}
                                        y={y - 10}
                                        fill="grey"
                                        fontWeight={'bold'}
                                        textAnchor='middle'
                                        fontSize={14}
                                    >
                                        {value}
                                    </D3Text>
                                </React.Fragment>
                            })
                        }
                    </D3Group>
                ))
            }
            {
                tooltipOpen && tooltipData && (
                    <TooltipInPortal
                        top={tooltipTop}
                        left={tooltipLeft}
                    >
                        <TooltipRenderer
                            data={tooltipData}
                            spec={tooltipSpec}
                        />
                    </TooltipInPortal>
                )
            }
            {
                tooltipOpen && tooltipData && (
                    <g>
                        <D3Line
                            from={{ x: 0, y: yScale(tooltipData.amount) }}
                            to={{ x: graphSpace.shape.width, y: yScale(tooltipData.amount) }}
                            stroke={colorScale(tooltipData.type)}
                            strokeWidth={1}
                            pointerEvents="none"
                            strokeDasharray={DEFAULT_GRID_DASHARRAY}
                        />
                    </g>
                )
            }
        </D3Group>
    )
}
