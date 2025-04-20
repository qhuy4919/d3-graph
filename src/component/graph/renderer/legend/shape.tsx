import { LegendShape } from "../../model";
import { D3Group } from "../group";

export type D3LegendShape = {
    label: string | number;
    itemIndex: number;
    margin?: string | number;
    shape?: LegendShape;
    fill?: string;
    size?: string | number;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties
}
export const D3LegendShape = ({
    shape,
    ...rest
}: D3LegendShape) => {
    switch (shape) {
        case 'rect':
            return <ShapeRect {...rest} />
        case 'circle':
            return <ShapeCircle {...rest} />
        case 'line':
            return <ShapeLine {...rest} />
    }
}

export type ShapeCircleProps = Pick<D3LegendShape,
    | 'fill'
    | 'style'
    | 'width'
    | 'height'
    | 'margin'
>

export function ShapeCircle({ fill, width, height, style }: ShapeCircleProps) {
    const cleanWidth = typeof width === 'string' || typeof width === 'undefined' ? 0 : width;
    const cleanHeight = typeof height === 'string' || typeof height === 'undefined' ? 0 : height;
    const size = Math.max(cleanWidth, cleanHeight);
    const radius = size / 2;
    return (
        <svg width={size} height={size}>
            <D3Group top={radius} left={radius}>
                <circle r={radius} fill={fill} style={style} />
            </D3Group>
        </svg>
    );
}

export type ShapeShapeLineProps = Pick<D3LegendShape,
    | 'fill'
    | 'style'
    | 'width'
    | 'height'
    | 'margin'
>

export function ShapeLine({ fill, width, height, style }: ShapeShapeLineProps) {
    const cleanHeight = typeof height === 'string' || typeof height === 'undefined' ? 0 : height;
    const lineThickness = typeof style?.strokeWidth === 'number' ? style?.strokeWidth : 2;
    return (
        <svg width={width} height={height} >
            <D3Group top={cleanHeight / 2 - lineThickness / 2}>
                <line
                    x1={0}
                    x2={width}
                    y1={0}
                    y2={0}
                    stroke={fill}
                    strokeWidth={lineThickness}
                    style={style}
                />
            </D3Group>
        </svg>
    );
}

export type ShapeRectProps = Pick<D3LegendShape,
    | 'fill'
    | 'style'
    | 'width'
    | 'height'
    | 'margin'
>

export function ShapeRect({ fill, width, margin, height, style }: ShapeRectProps) {
    return (
        <div
            style={{
                width,
                height,
                margin,
                background: fill,
                ...style,
            }}
        />
    );
}

