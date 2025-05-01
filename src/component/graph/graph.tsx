import { ChartOptions, D3EventListener, D3Datum, SignalListener } from "./model";
import { D3GraphSceneContext } from "./context";
import styled from 'styled-components'
import { D3GraphSceneBuilder, GraphOptionsManager } from "./builder";
import { D3Group } from "./renderer/group";
import { D3Axis, D3Grid, D3Legend } from "./renderer";

export const StyledD3GraphContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .d3-graph-content {
        padding-bottom: var(--spacing);
    }
`;
export const StyledD3Graph = styled.svg``;

export type D3Graph<Data extends D3Datum> = {
    data: Data[];
    builder?: D3GraphSceneBuilder,
    options: ChartOptions,
    signalListener?: Record<D3EventListener, SignalListener>
    children?: React.ReactNode
};

export const D3Graph = <Data extends D3Datum>(props: D3Graph<Data>) => {
    const {
        options,
        children,
        builder,
    } = props;
    const { graphSpace, paddingLeft, paddingTop } = new GraphOptionsManager(options);
    const { shape } = graphSpace;

    return <D3GraphSceneContext.Provider
        value={{
            schema: builder,
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
                    height={shape.height}
                    width={shape.width}
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

