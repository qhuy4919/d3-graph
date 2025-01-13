import { SceneNodeSpec } from "../internal/scene-node";
import { Datum, ViewSize } from "./base";
import { Interpolation, MarkType, Orientation, StrokeCap } from "./common";
import { Facet, Metadata, SceneNode } from "./scene";

export enum MarkEncodingKey {
    // Common encoding keys
    x = 'x',
    x2 = 'x2',
    xc = 'xc',
    y = 'y',
    y2 = 'y2',
    yc = 'yc',
    width = 'width',
    height = 'height',
    opacity = 'opacity',
    fill = 'fill',
    fillOpacity = 'fillOpacity',
    stroke = 'stroke',
    strokeOpacity = 'strokeOpacity',
    strokeWidth = 'strokeWidth',
    strokeCap = 'strokeCap',
    strokeDash = 'strokeDash',
    strokeDashOffset = 'strokeDashOffset',
    strokeJoin = 'strokeJoin',
    strokeMiterLimit = 'strokeMiterLimit',
    cursor = 'cursor',
    href = 'href',
    tooltip = 'tooltip',
    zIndex = 'zIndex',

    // Arc encoding keys
    startAngle = 'startAngle',
    endAngle = 'endAngle',
    padAngle = 'padAngle',
    innerRadius = 'innerRadius',
    outerRadius = 'outerRadius',
    cornerRadius = 'cornerRadius',

    // Area encoding keys
    orient = 'orient',
    interpolate = 'interpolate',
    tension = 'tension',
    defined = 'defined',

    // Group encoding keys
    clip = 'clip',

    // Image encoding keys
    url = 'url',
    aspect = 'aspect',
    align = 'align',
    baseline = 'baseline',

    // Path encoding keys
    path = 'path',

    // Symbol encoding keys
    size = 'size',
    shape = 'shape',

    // Text encoding keys
    angle = 'angle',
    dir = 'dir',
    dx = 'dx',
    dy = 'dy',
    ellipsis = 'ellipsis',
    font = 'font',
    fontSize = 'fontSize',
    fontWeight = 'fontWeight',
    fontVariant = 'fontVariant',
    fontStyle = 'fontStyle',
    limit = 'limit',
    radius = 'radius',
    text = 'text',
    theta = 'theta',

    // Accessibility keys
    ariaTitle = 'aria-title',
    ariaDescription = 'aria-description',
    tabIndex = 'tab-index',

    // Metadata
    metadata = 'metadata',
};

export type EncodingContext = {
    d: Datum,
    index: number,
    view: ViewSize
};

export type MarkEncoding<T> = T | ((ctx: EncodingContext) => T)

export type MarkEncodings = {
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
    [MarkEncodingKey.strokeCap]?: MarkEncoding<StrokeCap>
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
    [MarkEncodingKey.orient]?: MarkEncoding<Orientation>
    [MarkEncodingKey.interpolate]?: MarkEncoding<Interpolation>
    [MarkEncodingKey.tension]?: MarkEncoding<number>
    [MarkEncodingKey.defined]?: MarkEncoding<boolean>
    [MarkEncodingKey.clip]?: MarkEncoding<boolean>
    [MarkEncodingKey.url]?: MarkEncoding<string>
    [MarkEncodingKey.aspect]?: MarkEncoding<boolean>


    [MarkEncodingKey.metadata]?: MarkEncoding<Metadata>

    // catch all, and to allow indexing
    [key: string]: MarkEncoding<any> | undefined
};


export type D3Mark = {
    type: MarkType,
    encodings?: MarkEncodings,
    facet?: Facet,
    child?: SceneNode;

}
