export type D3TooltipType = 'axis' | 'graph' | 'legend';

export interface TooltipSpec {
    type: D3TooltipType,
    labelSchema: Record<string, React.ReactNode>,
    valueSchema: Record<string, (value: string) => React.ReactNode>
}

export const DEFAULT_AXIS_TOOLTIP_KEY = 'label';
export const DEFAULT_LEGEND_TOOLTIP_KEY = 'label';