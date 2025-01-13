import { Subject, Subscription } from 'rxjs';
import { SceneNodeSpec } from '../scene-node';
import { AxisBuilder } from './axis';
import { ScaleCreator, SceneNode } from '../../model';

type SubscriableHandle<T> = {
    item: T,
    subscription: Subscription
}

export class SceneNodeBuilder {
    public readonly onChange = new Subject<unknown>();
    public readonly spec = new SceneNodeSpec();

    private markBuilders: Array<SubscriableHandle<any>> = [];
    private axisBuilders: Array<SubscriableHandle<AxisBuilder>> = []

    private scales: ScaleCreator[] = [];

    /**
     * @param name the name of the scale-crator to add
     * @param table the name of the bound datatable to use
     * @param creator the scale-creator
     */


    public scale(
        ...creators: Array<ScaleCreator>

    ): SceneNodeBuilder {
        creators.forEach(c => {
            this.spec.addScale(c);
            this.scales.push(c)
        });

        this.onChange.next('node add scales');
        return this;
    };

    public axes(...builder: AxisBuilder[]): SceneNodeBuilder {
        builder.forEach(b => {
            this.spec.addAxis(b.spec);
            this.axisBuilders.push({
                item: b,
                subscription: b.onChange.subscribe(
                    c => this.onChange.next(c),
                )
            })

        });
        return this;
    }


    public build(): SceneNode {
        return this.spec
    }

}