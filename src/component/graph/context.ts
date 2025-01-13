import { createContext } from "react";
import { Renderer, VSvgNode } from './model';

/* This is mainly use internally by React components to interact
    with builder api
 */
export const SceneBuilderContext = createContext<
SceneNodeBuilder | undefined
>(undefined)


export const ChartRendererContext = createContext<
    Renderer<VSvgNode, unknown> | undefined
>(undefined)