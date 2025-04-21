import { D3TextProps } from "../model";

export const D3Text = ({
    dx,
    dy,
    x = 0,
    textAnchor = 'start',
    fontSize,
    innerRef,
    innerTextRef,
    transform,
    children,
    overflow = 'visible',
    ...textProps
}: D3TextProps) => {
    return <svg
        ref={innerRef}
        x={dx}
        y={dy}
        fontSize={fontSize}
        overflow={overflow}
    >
        <text ref={innerTextRef} {...textProps} transform={transform} textAnchor={textAnchor} >
            <tspan x={x} >
                {children}
            </tspan>
        </text>
    </svg>
}