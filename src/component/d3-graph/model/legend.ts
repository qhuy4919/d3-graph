import { ChartSize, D3BaseGraphData, D3ScaleOrdinal, D3Selection } from "../model";

export type D3LegendShape = 'rect' | 'circle' | 'line';
export type DynamicLegendProps = {
    selection: D3Selection<SVGGElement>,
    data: D3BaseGraphData[],
    shape?: D3LegendShape,

    legendLabel?: string,
    //color
    colorScale: D3ScaleOrdinal,
    //styling
    fontSize?: number,
    textLetterSpacing?: number,
    markerSize?: number,
    marginRatio?: number,
    numberLetterSpacing?: number,
    numberFormat?: string,

} & ChartSize