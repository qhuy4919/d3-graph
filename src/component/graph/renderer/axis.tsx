import { useEffect, useRef } from "react"
import {
    AxisOrientation,
    AxisScale,
    D3Selection,
    Datum,
    DEFAULT_AXIS_LABEL_FONT_SIZE,
    DEFAULT_AXIS_TOOLTIP_KEY
} from "../model"
import { D3AxisSpec } from "../spec"
import {
    getScaleBandwidth,
    getTextWidth,
    mergeClass,
    stringifyStyling,
    truncateLabel
} from "../util"
import { D3Group } from "./group"
import { BaseType, select } from "d3-selection"
import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis"
import { useD3GraphSceneContext } from "../context"
import { ScaleRenderer } from "./scale"
import { GraphOptionsManager } from "../builder"
import { useTooltip, useTooltipInPortal } from "@visx/tooltip"
import { localPoint } from "@visx/event"
import { TooltipRenderer } from "./tooltip"

export type AxisRenderer = {
    spec: D3AxisSpec
}
export const AxisRenderer = ({
    spec
}: AxisRenderer) => {
    const { schema, options } = useD3GraphSceneContext();

    const {
        width = 0,
        height = 0,
    } = options;

    const {
        className,
        transform,
        orient,
        title,
        titleStyle,
        scale,
        labelFontSize = DEFAULT_AXIS_LABEL_FONT_SIZE,
        tickFormat,
    } = spec;

    const {
        fontSize: titleFontSize = DEFAULT_AXIS_LABEL_FONT_SIZE,
    } = titleStyle

    const axisRef = useRef<SVGGElement>(null);

    const axistooltipSpec = schema?.spec.getTooltip('axis');
    const scaleName = scale;
    const axisScale = ScaleRenderer(schema?.spec.getScale(scaleName)) as AxisScale;
    const axisLabelClassName = 'axis-label';

    const {
        paddingLeft,
        paddingBottom,
        paddingRight,
        paddingTop,
        graphSpace: {
            shape: {
                height: graphHeight,
                width: graphWidth
            }
        }
    } = new GraphOptionsManager(options);

    const {
        tooltipOpen,
        tooltipLeft,
        tooltipTop,
        tooltipData,
        hideTooltip,
        showTooltip
    } = useTooltip<Record<string, string>>();
    const {
        TooltipInPortal
    } = useTooltipInPortal({
        detectBounds: true
    });


    const {
        axisLabelSpacing,
        tickLabelSpacing,
    } = getSpacingRatio(orient);

    const labelWidth = getTextWidth(title, axisLabelSpacing, titleFontSize)


    const axisBackbone = ({
        orient,
        ticks = 5,
        tickPadding,
        tickFormat
    }: D3AxisSpec) => {
        let axis;
        switch (orient) {
            case 'bottom':
                axis = axisBottom;
                break;
            case 'top':
                axis = axisTop;
                break;
            case 'left':
                axis = axisLeft;
                break;
            case 'right':
                axis = axisRight
                break;
            default:
                throw new Error('Invalid axis orientation')
        }

        if (!axisScale) throw new Error('axis scale error!');

        return axis(axisScale)
            .ticks(ticks)
            .tickPadding(tickPadding)
            .tickFormat(tickFormat ?? null)
    };

    function getSpacingRatio(orient: AxisOrientation) {

        switch (orient) {
            case 'bottom':
                return {
                    axisLabelSpacing: paddingBottom / 2,
                    tickLabelSpacing: paddingBottom / 2,
                }
            case 'top':
                return {
                    axisLabelSpacing: paddingTop / 2,
                    tickLabelSpacing: paddingTop / 2,
                }
            case 'left':
                return {
                    axisLabelSpacing: paddingLeft / 2,
                    tickLabelSpacing: paddingLeft / 2,
                }
            case 'right':
                return {
                    axisLabelSpacing: paddingRight / 2,
                    tickLabelSpacing: paddingRight / 2,
                }
            default:
                throw new Error('Invalid axis orientation')
        }

    }

    function transformLabel(orient: AxisOrientation) {
        const fontSize = typeof titleFontSize === 'string'
            ? parseFloat(titleFontSize)
            : titleFontSize;

        switch (orient) {
            case 'bottom':
                return `translate(
                    ${graphWidth / 2}, 
                    ${axisLabelSpacing + fontSize})
                `
            case 'top':
                return `translate(
                    ${graphWidth / 2}, 
                    ${-graphHeight - fontSize})
                `
            case 'left':
                return `translate
                (${-axisLabelSpacing - fontSize}, 
                ${graphHeight / 2 - labelWidth}), 
                rotate(-90)
            `
            case 'right':
                return `translate
                (${axisLabelSpacing + fontSize}, 
                ${graphHeight / 2 - labelWidth}), 
                rotate(90)
            `
            default:
                throw new Error('Invalid axis orientation')
        }
    }

    function truncateText(selection: D3Selection<BaseType, unknown, BaseType, Datum>) {
        let bandWidth = 0;
        //Xử lý truncate đặc biệt với những scale không có band width
        if (axisScale.bandwidth?.()) {
            bandWidth = getScaleBandwidth(axisScale)
        }
        else {
            bandWidth = tickLabelSpacing
        }

        const fontSize = typeof labelFontSize === 'string'
            ? parseFloat(labelFontSize)
            : labelFontSize;

        truncateLabel(selection, bandWidth, fontSize);
    }


    useEffect(() => {
        if (axisRef) {
            const axisSelection = select<BaseType, Datum>(axisRef.current)
                .call(d => axisBackbone(spec)(d))
                .attr('transform', transform)

            axisSelection
                .append('text')
                .text(title)
                .classed(axisLabelClassName, true)
                .attr('transform', transformLabel(orient))
                .attr('style', stringifyStyling(titleStyle));

            axisSelection
                .selectAll('.tick text')
                .call(truncateText)
                .on('mouseenter', function (e) {
                    let label = select(this).datum() as string;
                    if (tickFormat) label = tickFormat?.(label, 0);
                    const eventSvgCoords = localPoint(e);
                    showTooltip({
                        tooltipData: { [DEFAULT_AXIS_TOOLTIP_KEY]: label.toString() },
                        tooltipTop: eventSvgCoords?.y ?? 0,
                        tooltipLeft: eventSvgCoords?.x ?? 0,
                    });
                })
                .on('mouseleave', function () {
                    hideTooltip()
                });

        }

        return () => {
            select<BaseType, Datum>(`.${axisLabelClassName}`).remove()

        }
    }, [axisRef, spec])

    return <D3Group
        innerRef={axisRef}
        className={mergeClass('d3-axis', className)}
        height={height}
        width={width}
    >
        {
            tooltipOpen && tooltipData && (
                <TooltipInPortal
                    top={tooltipTop}
                    left={tooltipLeft}
                >
                    <TooltipRenderer
                        data={tooltipData}
                        spec={axistooltipSpec}
                    />
                </TooltipInPortal>
            )
        }
    </D3Group>
}

export const D3Axis = () => {
    const { schema } = useD3GraphSceneContext();
    if (!schema) return <>Non Graph Available</>
    const axisSpecList = schema.spec.axes;
    return axisSpecList.map((spec, i) => {
        //Cannot spread instance of class
        //  therfore have to pass it into props
        return <AxisRenderer
            key={`d3-axis-${i}`}
            spec={spec}
        />
    })
}