import {
    ScaleBand,
    ScaleLinear,
    ScaleLogarithmic,
    ScaleOrdinal,
    ScalePoint,
    ScalePower,
    ScaleQuantile,
    ScaleQuantize,
    ScaleRadial,
    ScaleSymLog,
    ScaleThreshold,
    ScaleTime
} from 'd3-scale';

export type D3ScaleDomain = (string | number)[];
export type D3ScaleRange = (string | number)[];
export type D3ScaleRangeRound = (string | number)[];
export type D3ScaleOutput = number | string | boolean | null;
export type D3DefaultThresholdInput = number | string | Date;
/** Union types of all values from a map type */
export type ValueOf<T> = T[keyof T];
export interface D3BaseScale {
    type: D3ScaleType
    range?: D3ScaleRange,
    rangeRound?: D3ScaleRangeRound,
    domain?: D3ScaleDomain,
    padding?: number,
    nice?: boolean | number;
};

export interface ScaleTypeToD3Scale<
    Output = D3ScaleOutput,
    DiscreteInput extends string = string,
    ThresholdInput extends D3DefaultThresholdInput = D3DefaultThresholdInput,
> {
    // Input of these continuous scales are `number | { valueOf(): number }`
    // and cannot be customized via generic type.
    linear: ScaleLinear<Output, Output>;
    log: ScaleLogarithmic<Output, Output>;
    pow: ScalePower<Output, Output>;
    sqrt: ScalePower<Output, Output>;
    symlog: ScaleSymLog<Output, Output>;
    radial: ScaleRadial<Output, Output>;
    // Input of time scales are `Date | number | { valueOf(): number }`
    // and cannot be customized via generic type.
    time: ScaleTime<Output, Output>;
    utc: ScaleTime<Output, Output>;
    // Input of these discretizing scales are `number | { valueOf(): number }`
    // and cannot be customized via generic type.
    quantile: ScaleQuantile<Output>;
    quantize: ScaleQuantize<Output>;
    // Threshold scale has its own Input generic type.
    threshold: ScaleThreshold<ThresholdInput, Output>;
    // Ordinal scale can customize both Input and Output types.
    ordinal: ScaleOrdinal<DiscreteInput, Output>;
    // Output of these two scales are always number while Input can be customized.
    point: ScalePoint<DiscreteInput>;
    band: ScaleBand<DiscreteInput>;
}
export type D3ScaleType = keyof ScaleTypeToD3Scale;

export type PickD3Scale<
    T extends keyof ScaleTypeToD3Scale<Output, DiscreteInput, D3DefaultThresholdInput>,
    Output = D3ScaleOutput,
    DiscreteInput extends string = string,
    ThresholdInput extends D3DefaultThresholdInput = D3DefaultThresholdInput,
> = ValueOf<Pick<ScaleTypeToD3Scale<Output, DiscreteInput, ThresholdInput>, T>>;

export type D3Scale<
    Output = D3ScaleOutput,
    DiscreteInput extends string = string,
    ThresholdInput extends D3DefaultThresholdInput = D3DefaultThresholdInput,
> = ValueOf<ScaleTypeToD3Scale<Output, DiscreteInput, ThresholdInput>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyD3Scale = D3Scale<any, any, any>;
export type ScaleInput<Scale extends AnyD3Scale> = Parameters<Scale>[0];

//any scale casting type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyBandScale = PickD3Scale<'band', any, any>;
