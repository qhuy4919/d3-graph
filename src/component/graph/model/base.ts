export type SvgCommonProps = {
    //the color inside the shape
    fill?: string

    [key: string]: unknown
}

export type SvgCommonStyle = {
    //Margin
    margin?: number | string,
    marginTop?: number | string,
    marginBottom?: number | string,
    marginLeft?: number | string,
    marginRight?: number | string,
    [key: string]: unknown,
};

export type VSvgTransformType = 'translate' | 'rotate' | 'scale';

export type VSvgTransform<Value> = {
    type: VSvgTransformType
    value: Value
}

export type VDomNode<Attr, Style> = {
    type: string,
    attr?: Attr,
    style?: Style,
    children?: Array<string | VDomNode<unknown, unknown>>
};

export type VSvgNode = {
    transform?: Array<VSvgTransform<unknown>>,
    
} & VDomNode<SvgCommonProps, SvgCommonStyle>;


export type ChartOptions = {
    /**
     * In pixel, the coordinate system will 
     * translated to this point 
    */ 
    origin?: [number, number],

    width?: number,
    height?: number,

    padding?: number
}