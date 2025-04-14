import { ChartOptions, D3GraphProps } from "./model";
import { D3GraphSceneContext, useD3GraphSceneContext } from "./context";
import { useD3GraphData } from "./hook";
import { AxisRenderer } from "./renderer";
import styled from 'styled-components'

export const StyledD3Graph = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .d3-graph-content {
        padding-bottom: var(--spacing);
    }
`;

export const D3Graph = <Data extends Record<string, unknown>>(props: D3GraphProps<Data>) => {
    const {
        data,
        builder,
        height,
        width,
        padding,
    } = props;
    const [normalizeData] = useD3GraphData(data);



    return <D3GraphSceneContext.Provider
        value={{
            builder
        }}
    >
        <StyledD3Graph>
            <D3Axis {...props} />
        </StyledD3Graph>
    </D3GraphSceneContext.Provider>
};

export type D3Axis = ChartOptions
const D3Axis = (props: D3Axis) => {
    const { builder } = useD3GraphSceneContext();
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