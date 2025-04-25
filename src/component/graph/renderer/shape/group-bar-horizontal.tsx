import React from 'react'
import {
    AnyBandScale,
    BaseBarGroupProps,
    Datum as D3Datum,
    AddSVGProps,
    BarGroupHorizontal,
    PickD3Scale,
    D3BaseGraph,
    DEFAULT_GRID_DASHARRAY,
} from '../../model';
import { groups as d3Groups } from 'd3-array';
import { getScaleBandwidth, mergeClass } from '../../util';
import { D3Group } from '../group';
import { D3Bar } from './bar';
import { useD3GraphSceneContext } from '../../context';
import { GraphOptionsManager } from '../../builder';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { D3Text } from '../text';
import { TooltipRenderer } from '../tooltip';
import { D3Line } from './line';

export type D3GroupBarHorizontal<
    Datum extends D3Datum,
    Y0Scale extends AnyBandScale = AnyBandScale,
    Y1Scale extends AnyBandScale = AnyBandScale,
> = BaseBarGroupProps<Datum> & {
    y0Scale: Y0Scale,
    y1Scale: Y1Scale,
    xScale: PickD3Scale<'linear', number>,
    colorScale: PickD3Scale<'ordinal', string>
    /** Override render function which is passed the computed BarGroups. */
    children?: (barGroups: BarGroupHorizontal[]) => React.ReactNode;
} & Pick<D3BaseGraph<Datum>, 'signalListener'>
export const D3GroupBarHorizontal = <
    Datum extends D3Datum,
    Y0Scale extends AnyBandScale = AnyBandScale,
    Y1Scale extends AnyBandScale = AnyBandScale,
>({
    data,
    className,
    top = 0,
    left = 0,
    y0Scale,
    y1Scale,
    xScale,
    colorScale,
    children,
    signalListener,
    ...rest
}: AddSVGProps<D3GroupBarHorizontal<Datum, Y0Scale, Y1Scale>, SVGRectElement>) => {
    const { schema, options } = useD3GraphSceneContext();
    const { graphSpace } = new GraphOptionsManager(options)
    const barHeight = getScaleBandwidth(y1Scale);
    const tooltipSpec = schema?.spec.getTooltip('graph');
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

    const barGroups: BarGroupHorizontal<Datum>[] = groupData.map((group, i) => {
        const [key, dataList] = group;
        return {
            index: i,
            y0: y0Scale(key) || 0,
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
                    height: barHeight,
                    x: xScale(amount) || 0,
                    y: y0Scale(period) || 0,
                    color: colorScale(type),
                    width: xScale(amount) || 0,
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
                        key={`d3-group-bar-${barGroup.y0}-${barGroup.index}`}
                        left={barGroup.y0}
                    >
                        {
                            barGroup.bars.map((bar) => {
                                const { x, y, width, height, color, value, key, data } = bar;
                                console.log("🚀 ~ barGroup.bars.map ~ x, y,:", x, y,)
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
                                            showTooltip({
                                                tooltipData: bar.data,
                                                tooltipTop: e?.clientY ?? 0,
                                                tooltipLeft: e?.clientX ?? 0,
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
                            from={{ x: xScale(tooltipData.amount), y: 0 }}
                            to={{ x: xScale(tooltipData.amount), y: graphSpace.shape.height }}
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
