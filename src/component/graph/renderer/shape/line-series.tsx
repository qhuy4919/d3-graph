import React from 'react';
import {
    AnyD3Scale,
    LinePathConfig,
    Datum as D3Datum,
    PickD3Scale,
} from '../../model';
import { group as d3Group } from 'd3-array';
import { D3LinePath } from './line-path';
import { D3Group } from '../group';
import { mergeClass } from '../../util';
import { curveBumpX } from 'd3-shape';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { TooltipRenderer } from '../tooltip';
import { useD3GraphSceneContext } from '../../context';


export type D3LineSeries<
    XScale extends AnyD3Scale,
    YScale extends AnyD3Scale,
    ColorScale extends PickD3Scale<'ordinal', string>,
    Datum extends D3Datum,
> = {
    /** Data for the Series. */
    data: Datum[];
    /* x scale */
    xScale: XScale;
    /* Y scale */
    yScale: YScale;
    /* Color Scale */
    colorScale: ColorScale
    /** Rendered component which is passed path props by D3LineSeries after processing. */
    PathComponent?: React.FC<Omit<React.SVGProps<SVGPathElement>, 'ref'>> | 'path';
    /** Sets the curve factory (from @visx/curve or d3-curve) for the line generator. Defaults to curveLinear. */
    curve?: LinePathConfig<Datum>['curve'];

    top?: number;
    left?: number;
    className?: string

};

export function D3LineSeries<
    XScale extends PickD3Scale<'time', number>,
    YScale extends PickD3Scale<'linear', number>,
    ColorScale extends PickD3Scale<'ordinal', string>,
    Datum extends D3Datum
>({
    data,
    xScale,
    yScale,
    colorScale,
    top,
    left,
    className,
    ...lineProps
}: D3LineSeries<XScale, YScale, ColorScale, Datum>) {
    const { schema } = useD3GraphSceneContext();
    const seriesData = d3Group(data, d => d.type);
    const groupKey = [...seriesData.keys()];
    const tooltipSpec = schema?.spec.getTooltip('graph');

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

    return <D3Group
        top={top}
        left={left}
        className={mergeClass('d3-line-graph', className)}
    >
        {
            groupKey.map((key, i) => {
                const groupData = seriesData.get(key) ?? [];
                return <>
                    <D3LinePath
                        key={`d3-line_${key}-${i}`}
                        {...lineProps}
                        curve={curveBumpX}
                        data={groupData}
                        x={d => xScale(new Date(d.period))}
                        y={d => yScale(d.amount)}
                        stroke={colorScale(key)}
                    >
                    </D3LinePath>
                    {
                        groupData.map((d, j) => (
                            <circle
                                key={i + j}
                                r={4}
                                cx={xScale(new Date(d.period))}
                                cy={yScale(d.amount)}
                                stroke={colorScale(key)}
                                fill={colorScale(key)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    hideTooltip();
                                }}
                                onMouseMove={(e) => {
                                    showTooltip({
                                        tooltipData: d,
                                        tooltipTop: e.clientY ?? 0,
                                        tooltipLeft: e.clientX ?? 0,
                                    });

                                }}
                            />
                        ))
                    }
                </>
            })
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
    </D3Group>
}

