import React from 'react';

export type LegendLabelOwnProps = {
    label?: React.ReactNode;
    children?: React.ReactNode;
};

export type D3LegendLabel = LegendLabelOwnProps &
    Omit<React.HTMLProps<HTMLSpanElement>, keyof LegendLabelOwnProps>;

export function D3LegendLabel({
    label,
    children,
    ...restProps
}: D3LegendLabel) {
    return (
        <span
            className="legend-label"
            style={{
                display: 'flex',
            }}
            {...restProps}
        >
            {children || label}
        </span>
    );
}
