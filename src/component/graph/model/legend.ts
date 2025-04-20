import { CSSProperties } from "styled-components";
import { D3ScaleSpec } from "../spec";

export type FormattedLabel<Datum, Output, ExtraAttributes = Record<string, unknown>> = {
    datum: Datum;
    index: number;
    text: string;
    value?: Output;
} & ExtraAttributes;

export type LegendShape =
    | 'rect'
    | 'circle'
    | 'line';

export type LegendShapeProps = {
    shapeWidth?: CSSProperties['width'],
    shapeHeight?: CSSProperties['height'],
    shapeMargin?: CSSProperties['margin'],
}
export type LegendLabelProps = React.HTMLProps<HTMLSpanElement>;

export interface LegendSpec<Scale extends D3ScaleSpec> {
    shape: LegendShape,
    className?: string,
    style?: React.CSSProperties,
    //Legend specification
    shapeProps: LegendShapeProps
    labelProps: LegendLabelProps
    // scale spec
    scale?: Scale,

}