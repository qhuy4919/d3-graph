import { createElement } from 'react'
import { ReactElement } from "react";
import { VSvgNode } from "../model";

function createElementFor(
    vdom: VSvgNode,
    key: string,
    handler: unknown
): ReactElement<any>{
    const {
        type,
        attr,
        style,

    } = vdom;

    const reactAttr = {
        key,
        style,
        ...attr,
    }

    const visualElement = createElement(type,reactAttr);

    return visualElement
}
export class Renderer {
    public render(vdom: VSvgNode, handler: unknown): ReactElement<unknown> {
        return createElementFor(vdom, 'root', handler);
    }
}