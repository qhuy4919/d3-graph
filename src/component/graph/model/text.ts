import { Ref, SVGAttributes } from "react";

export type D3TextProps = {
    innerRef?: Ref<SVGSVGElement>,
    innerTextRef?: Ref<SVGTextElement>;
    children?: string | number;
} & SVGAttributes<SVGTextElement>