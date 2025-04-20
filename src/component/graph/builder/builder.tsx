import { Subject } from 'rxjs';
import { AxisBuilder } from './axis';
import { GraphScene } from '../model';
import { D3ScaleSpec, GraphSceneSpec } from '../spec';
import { ScaleBuilder } from './scale';
import { GridBuilder } from './grid';
import { MarkBuilder } from './mark';
import { LegendBuilder } from './legend';

export class D3GraphSceneBuilder {
    public readonly onChange = new Subject<unknown>();
    public readonly spec = new GraphSceneSpec();

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

    public grid(...builder: GridBuilder[]): D3GraphSceneBuilder {
        builder.forEach(b => {
            this.spec.addGrid(b.spec)
        });
        return this;
    }

    public legend(...builder: LegendBuilder<D3ScaleSpec>[]): D3GraphSceneBuilder {
        builder.forEach(b => {
            this.spec.addLegend(b.spec)
        });
        return this;
    }

    public mark(...builder: MarkBuilder[]): D3GraphSceneBuilder {
        builder.forEach(b => {
            this.spec.addMark(b.spec);
        })

        return this;
    }


    public build(): GraphScene {
        return this.spec
    }

}