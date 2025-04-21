export type D3TooltipType = 'axis' | 'graph' | 'legend';

export interface TooltipSpec {
    type: D3TooltipType,
    labelSchema: Record<string, React.ReactNode>,
    valueSchema: Record<string, React.ReactNode>
} 