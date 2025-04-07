/* 
A factory function for creating a new sence
@category Builder
 */

import { ChartOptions } from "../model";
import { SceneNodeBuilder } from "./builder";
import { GraphOptionsManager } from "./manager";

export function scene(
    cb: (child: SceneNodeBuilder) => SceneNodeBuilder,
    opts: ChartOptions,
): SceneNodeBuilder {
    const optsManager = new GraphOptionsManager(opts);
    return new SceneNodeBuilder()
}