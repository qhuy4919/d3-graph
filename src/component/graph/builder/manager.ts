/*
* A class for managing chart options
* @category Builder 
*/

import { ChartOptions, DEFAULT_HEIGHT, DEFAULT_WIDTH, ItemSpace } from "../model";

export class GraphOptionsManager {
    readonly options: ChartOptions;

    public constructor(options: ChartOptions = {}) {
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

}