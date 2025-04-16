import { D3ScaleDomain, D3ScaleRange, D3ScaleRangeRound, D3ScaleType } from "../model";
import { D3ScaleSpec } from "../spec";

/** 
 * @builder scale
*/
export class ScaleBuilder {
    public readonly spec: D3ScaleSpec;

    public constructor(
        name: string,
        type: D3ScaleType
    ) {
        this.spec = new D3ScaleSpec(name, type);
    }

    public domain(domain: D3ScaleDomain) {
        this.spec.domain = domain;
        return this;
    }

    public range(range: D3ScaleRange) {
        this.spec.range = range;
        return this;
    }

    public rangeRound(range: D3ScaleRangeRound) {
        this.spec.rangeRound = range;
        return this;
    }

    public nice(value: number) {
        this.spec.nice = value;
        return this;
    }

    public padding(padding: number) {
        this.spec.padding = padding;
        return this;
    }

    public ticks(value: number) {
        this.spec.ticks = value;
        return this;
    }

    public build() {
        return this.spec;
    }

}