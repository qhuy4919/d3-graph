import { Selection } from "d3-selection";

export const validateContainer = (container: Selection<any, any, null, undefined>) => {
    if (container?.empty()) {
        throw Error('A root container is required');
    }
}

const DEFAULT_TEXT_SIZE = 12;
const DEFAULT_FONT_STYLE = 'Arial';
const DEFAULT_TEXT_WIDTH = 100;
const DEFAULT_MARGIN_RATIO = 0.15;
const DEFAULT_MARKER_SIZE = 16;

export const getTextWidth = (text: string, fontSize = DEFAULT_TEXT_SIZE, fontstyle = DEFAULT_FONT_STYLE) => {
    let a = document.createElement('canvas');
    let b = a.getContext('2d');

    if (b) {
        b.font = fontSize + 'px ' + fontstyle;

        return b.measureText(text).width
    };

    return DEFAULT_TEXT_WIDTH
}

export const getLineElementMargin = (marginRatio = DEFAULT_MARGIN_RATIO, markerSize = DEFAULT_MARKER_SIZE) => {
    return marginRatio * markerSize;
}