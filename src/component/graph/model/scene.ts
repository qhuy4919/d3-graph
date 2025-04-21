import { D3AxisSpec, D3GridSpec, D3LegendSpec, D3ScaleSpec, D3TooltipSpec } from "../spec";
import { D3MarkSpec } from "../spec/mark";

export interface GraphScene {
    scales?: D3ScaleSpec[],
    axes?: D3AxisSpec[],
    grid?: D3GridSpec[],
    mark?: D3MarkSpec[],
    legend?: D3LegendSpec<D3ScaleSpec>[],
    tooltip?: D3TooltipSpec[]
}

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
}
