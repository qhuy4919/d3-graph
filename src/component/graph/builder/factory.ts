import { Datum, LinePathConfig, MarkType } from "../model"
import { setNumberOrNumberAccessor } from "../util";
import { MarkBuilder } from "./mark"
import { line } from 'd3-shape';

/**
 * A factory function for creating a new mark
 * @param type The mark type to create
 * @category Builder
 */
export function mark(type: MarkType) {
    return new MarkBuilder(type)
}

function markWithName(markType: MarkType, name?: string) {
    const result = mark(markType)
    return name ? result.name(name) : result
}

/**
 * Creates a new _group_ type mark
 * @category Builder
 * @param name
 */
export function markGroup(name?: string) {
    return markWithName(MarkType.Group, name)
}


/* d3 shape factory function */
export function d3Line<Data extends Datum>({
    x, y, curve
}: LinePathConfig<Data>) {
    const path = line<Data>();
    if (x) setNumberOrNumberAccessor(path.x, x);
    if (y) setNumberOrNumberAccessor(path.y, y);
    if (curve) path.curve(curve);

    return path;
}
/* End of region */