/*
* A class for managing chart options
* @category Builder 
*/

import { ChartOptions, DEFAULT_HEIGHT, DEFAULT_WIDTH, GraphPadding, ItemSpace } from "../model";

export class GraphOptionsManager {
    readonly options: ChartOptions;

    public constructor(options: ChartOptions = { width: 0, height: 0 }) {
        this.options = options;
    }

    public get graphSpace(): ItemSpace {
        const padding = this.options.padding;
        const graphWidth = this.options.width ?? DEFAULT_WIDTH;
        const graphHeight = this.options.height ?? DEFAULT_HEIGHT;

        let paddingLeft = 0,
            paddingRight = 0,
            paddingTop = 0,
            paddingBottom = 0;
        if (typeof padding === 'object') {
            paddingLeft = padding.left || 0;
            paddingRight = padding.right || 0;
            paddingTop = padding.top || 0;
            paddingBottom = padding.bottom || 0;
        }
        else if (typeof padding === 'number') {
            paddingLeft = paddingRight = paddingTop = paddingBottom = padding;
        }

        const x = paddingLeft;
        const y = paddingTop;
        const width = graphWidth - paddingLeft - paddingRight;
        const height = graphHeight - paddingTop - paddingBottom;

        return {
            origin: { x, y },
            shape: { width, height },
        }
    }

    private getPadding(name: keyof GraphPadding): number {
        const padding = this.options.padding;
        if (typeof padding === 'number') {
            return padding as number
        } else if (typeof padding === 'object') {
            return padding[name] || 0
        }
        return 0
    }

    public get paddingTop(): number {
        return this.getPadding('top')
    }

    public get paddingBottom(): number {
        return this.getPadding('bottom')
    }

    public get paddingLeft(): number {
        return this.getPadding('left')
    }

    public get paddingRight(): number {
        return this.getPadding('right')
    }


}