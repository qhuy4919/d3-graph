import { GraphPadding } from "../model";
import { mergeClass } from "../util";

export type D3Group = {
    width?: number;
    height?: number;
    padding?: GraphPadding;
    className?: string;
    children?: React.ReactNode;
    innerRef?: React.RefObject<SVGGElement>;
    top?: number,
    left?: number,
}
export const D3Group = ({
    innerRef,
    children,
    className,
    transform,
    top = 0,
    left = 0,
    ...rest
}: D3Group & Omit<React.SVGProps<SVGGElement>, keyof D3Group>) => {
    return <g
        ref={innerRef}
        className={mergeClass("d3-group", className)}
        transform={transform || `translate(${left}, ${top})`}
        {...rest}
    >
        {children}
    </g>
}