import { AxisScale as D3AxisScale } from 'd3-axis';

export const DEFAULT_AXIS_COLOR = '#777';
export const DEFAULT_AXIS_STROKE = 1
export const DEFAULT_AXIS_TICK_SIZE = 5
export const DEFAULT_AXIS_TICK_AMOUNT = 10;
export const DEFAULT_AXIS_FONT_SIZE = 10;
export const DEFAULT_AXIS_TICK_PADDING = 10;
export const DEFAULT_AXIS_FONT = '"Roboto Condensed", Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
export const DEFAULT_AXIS_TICK_OFFSET_VALUE = 0;
export const DEFAULT_AXIS_LABEL_PADDING = 1
export const DEFAULT_AXIS_LABEL_FONT_SIZE = '16px';
export const DEFAULT_AXIS_LABEL_FILL = 'white';
export const DEFAULT_AXIS_LABEL_FONT_FAMILY = DEFAULT_AXIS_FONT

export type AxisOrientation = 'right' | 'left' | 'bottom' | 'top';
export interface AxisSpec {
    orient: AxisOrientation,
    scale: string,
    domain?: boolean,
    className?: string
    //tick
    tickColor?: string
    tickCount?: number
    tickOffset?: number
    tickWidth?: number,
    //label
    labelFontSize?: React.CSSProperties['fontSize']
    //title
    title?: string,
    titleStyle?: React.CSSProperties,
    //tweak
    transform?: string
}
// axis scale
export type AxisScaleOutput = number | string;
export type AxisScale = D3AxisScale<AxisScaleOutput>;

export const defaultAxisLabelStyle: React.CSSProperties = {
    'fontSize': DEFAULT_AXIS_LABEL_FONT_SIZE,
    'fill': DEFAULT_AXIS_LABEL_FILL,
    'fontFamily': DEFAULT_AXIS_LABEL_FONT_FAMILY
}