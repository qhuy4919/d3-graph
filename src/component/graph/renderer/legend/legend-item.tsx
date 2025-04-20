import React from 'react';
import { D3FlexDirection } from '../../model';

export type LegendItemProps = {
    flexDirection?: D3FlexDirection;
    alignItems?: string;
    margin?: string | number;
    children?: React.ReactNode;
    display?: string;
};

export function LegendItem({
    flexDirection = 'row',
    alignItems = 'center',
    margin = '0',
    display = 'flex',
    children,
    ...restProps
}: LegendItemProps & Omit<React.HTMLProps<HTMLDivElement>, keyof LegendItemProps>) {
    return (
        <div
            className="d3-legend-item"
            style={{
                display,
                alignItems,
                flexDirection,
                margin,
            }}
            {...restProps}
        >
            {children}
        </div>
    );
}
