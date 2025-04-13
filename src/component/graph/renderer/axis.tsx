import { GraphOptionsManager } from "../builder"
import { ChartOptions } from "../model"
import { D3AxisSpec } from "../spec"
import { mergeClass } from "../util"
import { D3Group } from "./group"

export type AxisRenderer = {
    graphOptions: ChartOptions
    spec: D3AxisSpec
}
export const AxisRenderer = ({
    graphOptions,
    spec,
}: AxisRenderer) => {
    const {
        className,
        ...rest,
    } = spec;

    const { paddingTop, paddingLeft } = new GraphOptionsManager(graphOptions);
    return <D3Group
        className={mergeClass('d3-axis', className)}
        transform={`translate(${paddingLeft}, ${paddingTop})`}
    >

    </D3Group>
}