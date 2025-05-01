import { D3Table, D3Datum, ViewSize } from "./base";
import { MarkType } from "./common";
import { D3Scale } from "./scale";
import { GraphScene, MarkEncodingKey } from "./scene";

export type D3MarkType = `${MarkType}`;
export type D3MarkOrientation = 'horizontal' | 'vertical';
export type D3SymbolType = 'circle' | 'square' | 'diamond' | 'cross';
export type D3FontWeight =
    | 'normal'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
/**
 * Faceting configuration to apply on incoming data
 */
export interface Facet {
    /**
     * The name of the facet-tables that dowstream marks will see
     */
    name: string

    /**
     * The name to use for the group mark's bound-data row in the context of
     * facet encoding. If the group mark has a bound data row, it will be mapped to
     * a facet partition using the facet's group-by mechanism. If the group is not
     * bound to a data row, it will be bound to the data facet partitions.
     */
    keyRowName?: string

    /**
     * The name of the source table to generate facets from. If not defined,
     * then the parent table will be used
     */
    table?: string

    /**
     * For data-driven facets, an array of field names by which to partition the data.
     * This property is required if using data-driven facets.
     */
    groupBy?: string | string[] | ((row: unknown) => unknown)

    /**
     * Data transformation to apply on data partitions after partitioning
     */
    transform?: (data: unknown[]) => unknown[]
}

export interface EncodingContext {
    /**
     * The current D3Datum to encode, e.g. a row in the bound data array.
     */
    d: D3Datum

    /**
     * The index of the D3Datum within the data collection
     */
    index: number

    /**
     * The dimensions of the current working view (e.g. Chart-Dimensions or
     * current Group Dimensions)
     */
    view: ViewSize

    /**
     * Named data tables, D3Datum instances, and scales..
     *
     * The data tables are a combination of the source dataset and any faceting
     * tables created at this point. Nomed D3Datums are generated from faceting
     * when the parent row is named.
     */
    [key: string]: D3Datum | D3Table | D3Scale<unknown> | ViewSize | number
}

export type MarkEncoding<T> = T | ((ctx: EncodingContext) => T)

export interface MarkEncodings {
    [MarkEncodingKey.x]?: MarkEncoding<number>
    [MarkEncodingKey.x2]?: MarkEncoding<number>
    [MarkEncodingKey.xc]?: MarkEncoding<number>
    [MarkEncodingKey.width]?: MarkEncoding<number>
    [MarkEncodingKey.y]?: MarkEncoding<number>
    [MarkEncodingKey.y2]?: MarkEncoding<number>
    [MarkEncodingKey.yc]?: MarkEncoding<number>
    [MarkEncodingKey.height]?: MarkEncoding<number>
    [MarkEncodingKey.opacity]?: MarkEncoding<number>
    [MarkEncodingKey.fill]?: MarkEncoding<string>
    [MarkEncodingKey.fillOpacity]?: MarkEncoding<number>
    [MarkEncodingKey.stroke]?: MarkEncoding<string>
    [MarkEncodingKey.strokeOpacity]?: MarkEncoding<number>
    [MarkEncodingKey.strokeWidth]?: MarkEncoding<number>
    [MarkEncodingKey.strokeDash]?: MarkEncoding<[number, number]>
    [MarkEncodingKey.strokeDashOffset]?: MarkEncoding<number>
    [MarkEncodingKey.strokeMiterLimit]?: MarkEncoding<number>
    [MarkEncodingKey.cursor]?: MarkEncoding<string>
    [MarkEncodingKey.href]?: MarkEncoding<string>
    [MarkEncodingKey.tooltip]?: MarkEncoding<string>
    [MarkEncodingKey.zIndex]?: MarkEncoding<number>

    [MarkEncodingKey.startAngle]?: MarkEncoding<number>
    [MarkEncodingKey.endAngle]?: MarkEncoding<number>
    [MarkEncodingKey.padAngle]?: MarkEncoding<number>
    [MarkEncodingKey.innerRadius]?: MarkEncoding<number>
    [MarkEncodingKey.outerRadius]?: MarkEncoding<number>
    [MarkEncodingKey.cornerRadius]?: MarkEncoding<number>
    [MarkEncodingKey.orient]?: MarkEncoding<D3MarkOrientation>
    [MarkEncodingKey.tension]?: MarkEncoding<number>
    [MarkEncodingKey.defined]?: MarkEncoding<boolean>
    [MarkEncodingKey.clip]?: MarkEncoding<boolean>
    [MarkEncodingKey.url]?: MarkEncoding<string>
    [MarkEncodingKey.aspect]?: MarkEncoding<boolean>

    [MarkEncodingKey.path]?: MarkEncoding<string>
    [MarkEncodingKey.size]?: MarkEncoding<number>
    [MarkEncodingKey.shape]?: MarkEncoding<D3SymbolType | string>
    [MarkEncodingKey.angle]?: MarkEncoding<number>
    [MarkEncodingKey.dx]?: MarkEncoding<number>
    [MarkEncodingKey.dy]?: MarkEncoding<number>
    [MarkEncodingKey.ellipsis]?: MarkEncoding<string>
    [MarkEncodingKey.font]?: MarkEncoding<string>
    [MarkEncodingKey.fontSize]?: MarkEncoding<number>
    [MarkEncodingKey.fontWeight]?: MarkEncoding<D3FontWeight>
    [MarkEncodingKey.fontVariant]?: MarkEncoding<string | number>
    [MarkEncodingKey.fontStyle]?: MarkEncoding<number>
    [MarkEncodingKey.limit]?: MarkEncoding<number>
    [MarkEncodingKey.radius]?: MarkEncoding<number>
    [MarkEncodingKey.text]?: MarkEncoding<string>
    [MarkEncodingKey.theta]?: MarkEncoding<number>

    // [MarkEncodingKey.metadata]?: MarkEncoding<Metadata>

    // catch all, and to allow indexing
    [key: string]: MarkEncoding<unknown> | undefined
}

export interface MarkSpec {
    type: D3MarkType,
    /*
    The name of the data-table to bind this mark to.
    Quite similar to vega 
     */
    table?: string,
    /* 
    The encodings, which map data values into attribute values
     */
    encodings: MarkEncodings
    /*
    name of this mark 
     */
    name?: string
    /*
    For group mark, an options parameter on data faceting
    Using in group bar,... 
     */
    facet?: Facet,
    child?: GraphScene

}