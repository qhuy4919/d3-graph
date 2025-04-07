import { Axis } from 'd3-axis';
export const DEFAULT_AXIS_COLOR = '#777';
export const DEFAULT_AXIS_STROKE = 1
export const DEFAULT_AXIS_TICK_SIZE = 5
export const DEFAULT_AXIS_TICK_AMOUNT = 10;
export const DEFAULT_AXIS_FONT_SIZE = 10;
export const DEFAULT_AXIS_TICK_PADDING = 10;
export const DEFAULT_AXIS_FONT = 'sans-serif'
export const DEFAULT_AXIS_LABEL_PADDING = 1
export const DEFAULT_AXIS_TICK_OFFSET_VALUE = 0;



export type AxisOrientation = 'right' | 'left' | 'bottom' | 'top';
export interface D3Axis<Domain extends string | number> extends Axis<Domain> {
    orient: AxisOrientation
    domain?: boolean
    tickColor?: string
    tickCount?: number
    tickOffset?: number
    tickWidth?: number,
    label?: string,
    labelFontSize?: number,
    labelFontWeight?: number,
    labelFont?: string,

}