import { SVGProps } from "react";

export enum StrokeCap {
    Butt = 'butt',
    Round = 'round',
    Square = 'square',
};

export enum Orientation {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
};

export enum Interpolation {
    Basis = 'basis',
    Cardinal = 'cardinal',
    Linear = 'linear',
    Monotone = 'monotone',
    Natural = 'natural',
    step = 'step',

};

export enum MarkType {
    Arc = 'arc',
    Area = 'area',
    Group = 'group',
    Image = 'image',
    Line = 'line',
    Path = 'path',
    Rect = 'rect',
    Rule = 'rule',
    Symbol = 'symbol',
    Text = 'text',
    Trail = 'trail',
    Shape = 'shape',
};

//Omit some custom props that might be duplicate in original SVG props
export type AddSVGProps<Props, Element extends SVGElement> = Props &
    Omit<SVGProps<Element>, keyof Props>;