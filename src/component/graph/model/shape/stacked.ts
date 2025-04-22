import {
    stackOffsetExpand,
    stackOffsetDiverging,
    stackOffsetNone,
    stackOffsetSilhouette,
    stackOffsetWiggle,
    stackOrderAscending,
    stackOrderDescending,
    stackOrderInsideOut,
    stackOrderNone,
    stackOrderReverse,
    SeriesPoint,
} from 'd3-shape';
import { BarGroupBar } from './bar-group';
import { Datum as D3Datum } from '../base';

export const STACK_OFFSETS = {
    expand: stackOffsetExpand,
    diverging: stackOffsetDiverging,
    none: stackOffsetNone,
    silhouette: stackOffsetSilhouette,
    wiggle: stackOffsetWiggle,
};

export const STACK_ORDERS = {
    ascending: stackOrderAscending,
    descending: stackOrderDescending,
    insideout: stackOrderInsideOut,
    none: stackOrderNone,
    reverse: stackOrderReverse,
};

export const STACK_OFFSET_NAMES = Object.keys(STACK_OFFSETS);
export const STACK_ORDER_NAMES = Object.keys(STACK_ORDERS);

export type StackPathConfig = {
    /** Sets the stack offset to the pre-defined d3 offset, see https://github.com/d3/d3-shape#stack_offset. */
    offset?: keyof typeof STACK_OFFSETS;
    /** Sets the stack order to the pre-defined d3 function, see https://github.com/d3/d3-shape#stack_order. */
    order?: keyof typeof STACK_ORDERS;
    /** Sets the value accessor for a Datum, which defaults to d[key]. */
    value?: number;
};

export type BaseStackProps<Datum> = {
    /** Array of data for which generates a stack. */
    data: Datum[];
    /** className applied to path element. */
    className?: string;
    /** Top offset of rendered Stack. */
    top?: number;
    /** Left offset of rendered Stack. */
    left?: number;
} & StackPathConfig;

export interface BarStack<Datum extends D3Datum> {
    index: number;
    key: string
    bars: (Omit<BarGroupBar<Datum>, 'value' | 'data'> & {
        /** Processed bar Datum with bar bounds and original datum. */
        bar: SeriesPoint<Datum>;
        /** stack key */
    })[];
}
