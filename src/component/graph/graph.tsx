import { ChartOptions, D3Datum, D3SignalListener } from "./model";
import { D3GraphSceneContext } from "./context";
import styled from 'styled-components'
import { D3GraphSceneBuilder, GraphOptionsManager } from "./builder";
import { D3Group } from "./renderer/group";
import { D3Axis, D3Grid, D3Legend } from "./renderer";

export const StyledD3GraphContainer = styled.div`
    width: 100%;
    height: 100%;
`;
export const StyledD3Graph = styled.svg``;

export type D3Graph<Data extends Record<string, unknown>> = {
    data: Data[];
    builder?: (props: D3Graph<Data>) => D3GraphSceneBuilder,
    options: ChartOptions,
    signalListener?: D3SignalListener<D3Datum>
    children?: React.ReactNode
};

export const D3Graph = <Data extends Record<string, unknown>>(props: D3Graph<Data>) => {
    const {
        options,
        children,
        builder,
    } = props;
    const { graphSpace, paddingLeft, paddingTop } = new GraphOptionsManager(options);
    const { shape } = graphSpace;
    const { width: graphWidth = 0, height: graphHeight = 0 } = shape;

    return <D3GraphSceneContext.Provider
        value={{
            schema: builder?.(props),
            options,
        }}
    >
        <StyledD3GraphContainer className={'d3-graph-container'}>
            <StyledD3Graph
                width={options.width}
                height={options.height}
            >
                <D3Group
                    className="d3-group-container"
                    height={graphHeight}
                    width={graphWidth}
                    transform={`translate(${paddingLeft},${paddingTop})`}
                >
                    <D3Axis />
                    <D3Grid />
                    {children}
                </D3Group>
            </StyledD3Graph>
            <D3Legend />
        </StyledD3GraphContainer>
    </D3GraphSceneContext.Provider>
};

