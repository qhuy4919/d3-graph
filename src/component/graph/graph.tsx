import { D3BaseGraph, Datum } from "./model";
import { D3GraphSceneContext } from "./context";
import styled from 'styled-components'
import { GraphOptionsManager } from "./builder";
import { D3Group } from "./renderer/group";

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

export type D3Graph<Data extends Datum> = {
    children?: React.ReactNode
} & D3BaseGraph<Data>;

export const D3Graph = <Data extends Datum>(props: D3Graph<Data>) => {
    const {
        options,
        children,
        builder,
    } = props;
    const { graphSpace, paddingLeft, paddingTop } = new GraphOptionsManager(options);
    const { shape } = graphSpace

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
                    {children}
                </D3Group>
            </StyledD3Graph>
        </StyledD3GraphContainer>
    </D3GraphSceneContext.Provider>
};

