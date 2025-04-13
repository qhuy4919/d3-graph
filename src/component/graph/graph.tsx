import { ChartOptions, D3GraphProps } from "./model";
import { D3GraphSceneContext, useD3GraphSceneContext } from "./context";
import { useD3GraphData } from "./hook";
import { AxisRenderer } from "./renderer/axis";


export const D3Graph = <Data extends Record<string, unknown>>(props: D3GraphProps<Data>) => {
    const {
        data,
        builder,
        height,
        width,
        padding,
    } = props;
    const [normalizeData] = useD3GraphData(data);



    return <D3GraphSceneContext.Provider value={builder}>
        <D3Axis {...props} />
    </D3GraphSceneContext.Provider>
};

export type D3Axis = ChartOptions
const D3Axis = (props: D3Axis) => {
    const builder = useD3GraphSceneContext();
    if (!builder) return <>Non Graph Available</>
    const axisSpecList = builder.spec.axes;
    return axisSpecList.map((spec, i) => {
        return <AxisRenderer
            key={`d3-axis-${i}`}
            spec={spec}
            graphOptions={props}
        />
    })
}