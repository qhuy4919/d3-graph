import {
    AxisOrientation,
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


    public build() {
        return this.spec;
    }



}

