import React from "react";
import { D3Datum } from "../model"
import { D3TooltipSpec } from "../spec";
import styled from 'styled-components';

export const StyledD3Tooltip = styled.div`
    margin: 5px;
    display: grid;
    grid-template-columns: auto auto;
    flex-direction: column;
    column-gap: 10px;
    row-gap: 10px;
    .tooltip-label {
        color: #a1a1aa;
        text-align: end;
    }
    .tooltip-value {
        color: #3c3e46;
    }
`;


export type TooltipRenderer<Data extends D3Datum> = {
    data: Data,
    spec?: Pick<D3TooltipSpec, 'labelSchema' | 'valueSchema'>
}
export const TooltipRenderer = <Data extends D3Datum>({
    data,
    spec
}: TooltipRenderer<Data>) => {
    if (!spec) return <></>;

    const { labelSchema, valueSchema } = spec ?? {};
    return <StyledD3Tooltip className="d3-tooltip-container">
        {
            Object.keys(labelSchema).map((label, i) => {
                const value = valueSchema[label]
                    ? valueSchema[label]?.(data)
                    : data[label]

                return (
                    <React.Fragment key={`${label}-${i}}`}>
                        <span className="tooltip-label">{labelSchema[label]}</span>
                        <span className="tooltip-value">{value}</span>

                    </React.Fragment>
                )
            })
        }
    </StyledD3Tooltip>
}