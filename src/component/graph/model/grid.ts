import { D3Scale } from './scale';
// grid scale
export type GridScaleOutput = number | string | undefined;
export type GridScale = D3Scale<string>;
// common
export type CommonGridProps = {
    scale: string,
    className?: string,
    stroke?: string
    strokeWidth?: string | number,
    strokeDasharray?: string,
    offset?: number,
    opacity?: number,
}
//const
export const DEFAULT_GRID_STROKE_WIDTH = '1px';
export const DEFAULT_GRID_STROKE = '#f8f8f8';
export const DEFAULT_GRID_DASHARRAY = '3,3'