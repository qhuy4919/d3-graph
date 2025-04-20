import {
    LegendLabelProps,
    LegendShape,
    LegendShapeProps,
    LegendSpec
} from "../model";
import { D3ScaleSpec } from "./scale";

export class D3LegendSpec<
    Scale extends D3ScaleSpec,
> implements LegendSpec<Scale> {
    private _className?: string
    private _style?: React.CSSProperties
    private _scale: Scale
    private _colorScale: Scale
    //
    private _shape: LegendShape
    private _shapeProps: LegendShapeProps
    private _labelProps: LegendLabelProps

    public constructor(
        shape: LegendShape,
        scale: Scale,
        colorScale: Scale
    ) {
        this._scale = scale;
        this._shape = shape
        this._colorScale = colorScale
    }

    get className(): string | undefined {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }

    get style(): React.CSSProperties | undefined {
        return this._style;
    }

    set style(value: React.CSSProperties) {
        this._style = value;
    }

    get scale(): Scale {
        return this._scale;
    }

    set scale(value: Scale) {
        this._scale = value;
    }

    get colorScale(): Scale {
        return this._colorScale;
    }

    set colorScale(value: Scale) {
        this.colorScale = value;
    }

    get shape(): LegendShape {
        return this._shape;
    }

    set shape(value: LegendShape) {
        this._shape = value;
    }

    get shapeProps(): LegendShapeProps {
        return this._shapeProps
    }

    set shapeProps(value: LegendShapeProps) {
        this._shapeProps = {
            ...this._shapeProps,
            ...value
        }
    }

    get labelProps(): LegendLabelProps {
        return this._labelProps
    }

    set labelProps(value: LegendLabelProps) {
        this._labelProps = {
            ...this._labelProps,
            ...value
        }
    }


}