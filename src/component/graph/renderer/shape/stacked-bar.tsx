import React from 'react'
import {
    BaseBarGroupProps,
    Datum as D3Datum,
    AddSVGProps,
    PickD3Scale,
    D3BaseGraph,
    DEFAULT_GRID_DASHARRAY,
    BaseStackProps,
    BarStack,
    PositionScale,
    AnyBandScale,
} from '../../model'
import { getScaleBandwidth, mergeClass, stackedTransformData, stackOffset, stackOrder } from '../../util';
import { D3Group } from '../group';
import { D3Bar } from './bar';
import { stack as d3Stack } from 'd3-shape';
import { union as d3Union, groups as d3Groups } from 'd3-array'
import { D3Text } from '../text';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { useD3GraphSceneContext } from '../../context';
import { TooltipRenderer } from '../tooltip';
import { D3Line } from './line';
import { GraphOptionsManager } from '../../builder';
import { localPoint } from '@visx/event';

export type D3StackedBar<
    Datum extends D3Datum,
    XScale extends AnyBandScale = AnyBandScale,
    YScale extends PositionScale = PositionScale,
> = BaseBarGroupProps<Datum> & {
    /** Returns the value mapped to the x0 (group position) of a bar */
    xScale: XScale,
    yScale: YScale,
    colorScale: PickD3Scale<'ordinal', string>
    height: number,
    /** Override render function which is passed the computed BarGroups. */
    children?: (barGroups: BarStack<Datum>[]) => React.ReactNode,
}
    & Pick<D3BaseGraph<Datum>, 'signalListener'>
    & BaseStackProps<Datum>;

export const D3StackedBar = <
    Datum extends D3Datum,
    XScale extends AnyBandScale = AnyBandScale,
    YScale extends PositionScale = PositionScale,
>({
    data,
    order,
    offset,
    className,
    top = 0,
    left = 0,
    xScale,
    yScale,
    colorScale,
    signalListener,
    children,
    ...rest
}: AddSVGProps<D3StackedBar<Datum, XScale, YScale>, SVGRectElement>) => {
    const { schema, options } = useD3GraphSceneContext();
    const { graphSpace } = new GraphOptionsManager(options)
    const tooltipSpec = schema?.spec.getTooltip('graph');
    const barWidth = getScaleBandwidth(xScale);

    const stack = d3Stack<Datum>();
    const groupedStackedData = stackedTransformData(data)
    if (order) stack.order(stackOrder(order));
    if (offset) stack.offset(stackOffset(offset));
    stack.value((d, k) => d?.[k]?.amount ?? 0);
    stack.keys(d3Union(data.map(d => d.type)));
    const stacks = stack(groupedStackedData);

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


    const barStacks: BarStack<Datum>[] = stacks.map((barStacked, i) => {
        const { key: stackedKey } = barStacked;

        return {
            index: i,
            key: stackedKey,
            bars: barStacked.map((bar, j) => {
                const {
                    type,
                } = bar.data[stackedKey] ?? {};
                const barHeight = (yScale(bar[0]) || 0) - (yScale(bar[1]) || 0);
                const barY = yScale(bar[1]) ?? 0;
                const barX = xScale(bar.data['_dataKey']);
                return {
                    bar,
                    key: type,
                    index: j,
                    height: barHeight,
                    width: barWidth,
                    x: barX || 0,
                    y: barY || 0,
                    color: colorScale(type)
                }
            })
        }
    })

    if (children) return <>{children(barStacks)}</>;

    return (
        <D3Group
            top={top}
            left={left}
            className={mergeClass('d3-group-bar', className)}
        >
            {barStacks.map((barStack) => {
                return barStack.bars.map((stack) => {
                    const { key } = stack;
                    const { data } = stack.bar;
                    const stackedData = data[key];
                    const total = data['_total'];
                    const stackedName = data['_dataKey'];

                    return (
                        <React.Fragment key={`bar-stack-${barStack.index}-${stack.index}`}>
                            <D3Bar
                                {...rest}
                                x={stack.x}
                                y={stack.y}
                                height={stack.height}
                                width={stack.width}
                                fill={stack.color}
                                onClick={() => {
                                    barClick?.(`${data._dataKey}-${key}`, data[key])
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
                                        tooltipData: stackedData,
                                        tooltipTop: eventSvgCoords?.y ?? 0,
                                        tooltipLeft: eventSvgCoords?.x ?? 0,
                                    });

                                }}
                            />

                            <D3Text
                                key={`d3-bar-text-${barStack.index}-${total}`}
                                x={(xScale(stackedName) ?? 0) + stack.width / 2}
                                y={(yScale(total) ?? 0) - 10}
                                fill="grey"
                                fontWeight={'bold'}
                                textAnchor='middle'
                                fontSize={14}
                            >
                                {total}
                            </D3Text>

                        </React.Fragment>
                    )
                })
            },
            )}

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