/*
* Grid specification
* @category Builder with spec
*/

import { D3GridOrientation } from "../model";
import { D3GridSpec } from "../spec";

export class GridBuilder {
    public readonly spec: D3GridSpec

    public constructor(
        scale: string,
        orient: D3GridOrientation
    ) {
        this.spec = new D3GridSpec(scale, orient);
    }

    public className(value: string) {
        this.spec.className = value
        return this
    }
    public stroke(value: string) {
        this.spec.stroke = value
        return this
    }
    public strokeWidth(value: string | number) {
        this.spec.strokeWidth = value
        return this
    }
    public strokeDasharray(value: string) {
        this.spec.className = value
        return this
    }
    public offset(value: number) {
        this.spec.offset = value
        return this
    }
    public opacity(value: number) {
        this.spec.opacity = value
        return this
    }
}
