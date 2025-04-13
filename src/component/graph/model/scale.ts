export type D3ScaleType = 'band' | 'ordinal' | 'linear';
export type D3ScaleDomain = (string | number)[];
export type D3ScaleRange = (string | number)[];
export type D3ScaleRangeRound = (string | number)[];

export interface D3Scale {
    type: D3ScaleType
    range?: D3ScaleRange,
    rangeRound?: D3ScaleRangeRound,
    domain?: D3ScaleDomain,
    padding?: number,
    nice?: boolean,
};

