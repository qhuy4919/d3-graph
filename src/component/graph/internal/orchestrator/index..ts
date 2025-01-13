import { ChartOptions, DataFrame, SceneGraphConverter, SceneNode, VDomNode, VDomRenderer } from "../../model";

export class Orchestrator<T> {
    public constructor(
        private renderer: VDomRenderer<VDomNode<any, any>, T>,
        private preRenderer: SceneGraphConverter<any>

    ) { };

    public renderScene(
        scene: SceneNode,
        options: ChartOptions = {},
        tables: DataFrame,
    ) {
        try {
            const vdom = this.preRenderer.render();
            return this.renderer.render(vdom, {});
        } catch (error) {
            console.log('error rendering scene', error);
            throw error
        }
    }
}