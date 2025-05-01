import { D3Datum } from "../base";

/** Unique key for item in a group. */
export type D3GroupKey = string;

export interface BarGroupBar<Data extends D3Datum> {
    /** group key */
    key: string;
    /** index of BarGroup (matches input D3Datum index). */
    index: number;
    /** data refer to bar */
    data: Data
    /** group value (D3Datum[key]) */
    value: number;
    /** height of bar. */
    height: number;
    /** width of bar. */
    width: number;
    /** x position of bar. */
    x: number;
    /** y position of bar. */
    y: number;
    /** color of bar. */
    color: string;
}

interface BaseBarGroup<Data extends D3Datum> {
    /** index of BarGroup (matches input D3Datum index). */
    index: number;
    /** bars within group, one for each key. */
    bars: BarGroupBar<Data>[];
}

/** One BarGroup is returned for each D3Datum, which has multiple sub-bars (based on keys). */
export interface BarGroup<Datum extends D3Datum = D3Datum> extends BaseBarGroup<Datum> {
    /** x0 position of bar group */
    x0: number;
}

/** One BarGroup is returned for each D3Datum, which has multiple sub-bars (based on keys). */
export interface BarGroupHorizontal<Datum extends D3Datum = D3Datum> extends BaseBarGroup<Datum> {
    /** y0 position of bar group */
    y0: number;
}

export interface BaseBarGroupProps<Datum extends D3Datum> {
    /** Array of data for which to generate grouped bars. */
    data: Datum[];
    /** className applied to Bars. */
    className?: string;
    /** Top offset of rendered Bars. */
    top?: number;
    /** Left offset of rendered Bars. */
    left?: number;
}
