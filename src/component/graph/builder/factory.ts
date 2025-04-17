import { MarkType } from "../model"
import { MarkBuilder } from "./mark"


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
