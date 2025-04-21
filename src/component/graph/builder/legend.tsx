/*
Legend Builder
@category Builder 
 */

import { LegendLabelProps, LegendShape, LegendShapeProps } from "../model";
import { D3LegendSpec, D3ScaleSpec } from "../spec";

export class LegendBuilder<
    Scale extends D3ScaleSpec,
> {
    public readonly spec: D3LegendSpec<Scale>

    public constructor(
        shape: LegendShape,
        scale: Scale,
        colorScacle: Scale
    ) {
        this.spec = new D3LegendSpec(shape, scale, colorScacle);
    }

    public className(value: string) {
        this.spec.className = value;
        return this;
    }

    public label(value: string) {
        this.spec.label = value;
        return this;
    }

    public style(style: React.CSSProperties) {
        this.spec.style = style;
        return this;
    }

    public shapeAttr(value: LegendShapeProps) {
        this.spec.shapeProps = {
            ...this.spec.shapeProps,
            ...value
        }
        return this
    }

    public labelAttr(value: LegendLabelProps) {
        this.spec.labelProps = {
            ...this.spec.labelProps,
            ...value
        }
        return this;
    }

}