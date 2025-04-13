import { GraphPadding } from "../model";
import { mergeClass } from "../util";

export type D3Group = {
    width: number;
    height: number;
    padding?: GraphPadding;
    className?: string;
    children?: React.ReactNode;
    innerRef?: React.RefObject<SVGGElement>;
}
export const D3Group = ({
    innerRef,
    children,
    className,
    ...rest
}: D3Group & Omit<React.SVGProps<SVGGElement>, keyof D3Group>) => {
    return <g
        ref={innerRef}
        className={mergeClass("d3-group", className)}
        {...rest}
    >
        {children}
    </g>
}