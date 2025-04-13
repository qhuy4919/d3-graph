import { Subject } from 'rxjs';
import { AxisBuilder } from './axis';
import { GraphScene } from '../model';
import { D3GraphScene } from '../spec';
import { ScaleBuilder } from './scale';

export class D3GraphSceneBuilder {
    public readonly onChange = new Subject<unknown>();
    public readonly spec = new D3GraphScene();

    public scale(...builder: ScaleBuilder[]): D3GraphSceneBuilder {
        builder.forEach(b => {
            this.spec.addScale(b.spec);
        });
        return this;
    }

    public axes(...builder: AxisBuilder[]): D3GraphSceneBuilder {
        builder.forEach(b => {
            this.spec.addAxis(b.spec);

        });
        return this;
    }


    public build(): GraphScene {
        return this.spec
    }

}