import { Subject } from 'rxjs';
import { AxisSpec } from '../spec';
import { AxisOrientation, D3Axis } from '../../model';


export class AxisBuilder {
    public readonly onChange = new Subject<any>();
    public readonly spec: AxisSpec;

    public constructor(scale: string, orient: AxisOrientation) {
        if(!scale) throw new Error('scale must be provided');
        if(!orient) throw new Error('orient must be provided');

        this.spec = new AxisSpec(scale, orient);
    };

    public build(): D3Axis {
        return this.spec
    }
}