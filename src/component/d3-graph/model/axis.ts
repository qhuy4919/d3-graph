import { AxisScale } from "d3-axis";

type D3AxisOrientation = 'left' | 'right' | 'top' | 'bottom';
export type DynamicAxisProps<Domain extends string | number> = {
    orientation: D3AxisOrientation,
    scale: AxisScale<Domain>
    axisLabel?: string,
    axisLabelOffset?: number,
    ticks?: number,
    tickPadding?: number
    tickFormat?: (d: Domain) => string,
    tickLabelFontSize?: number,
    tickLabelFontWeight?: number,
    tickLabelFontFamily?: string,

};

export type D3AxisProps<DomainX extends string | number, DomainY extends string | number> = {
    grid?: 'vertical' | 'horizontal' | 'full'
    x: DynamicAxisProps<DomainX>,
    y: DynamicAxisProps<DomainY>,
};

