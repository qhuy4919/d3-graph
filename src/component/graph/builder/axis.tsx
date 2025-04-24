import {
    AxisOrientation,
    D3TickFormat,
} from '../model';
import { D3AxisSpec } from '../spec';
/*
* Axis specification props
* @category Builder  
*/
export class AxisBuilder {
    public readonly spec: D3AxisSpec;

    public constructor(
        scale: string,
        orient: AxisOrientation) {
        if (!scale) throw new Error('scale must be provided');
        if (!orient) throw new Error('orient must be provided');

        this.spec = new D3AxisSpec(scale, orient);
    }

    public transform(value: string) {
        this.spec.transform = value;
        return this;
    }

    public className(value: string) {
        this.spec.className = value;
        return this;
    }

    public ticks(value: number) {
        this.spec.ticks = value;
        return this;
    }

    public tickPadding(value: number) {
        this.spec.tickPadding = value;
        return this;
    }

    public tickFormat(value: D3TickFormat) {
        this.spec.tickFormat = value;
        return this;
    }

    public title(value: string) {
        this.spec.title = value;
        return this;
    }

    public titleStyle(value: React.CSSProperties) {
        this.spec.titleStyle = {
            ...this.spec.titleStyle,
            ...value,
        }
        return this;
    }

    public build() {
        return this.spec;
    }
}

