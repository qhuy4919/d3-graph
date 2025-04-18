import { DefaultGraphColorSchema } from "../theme";
import { AnyD3Scale, D3DataSchema, Datum, DEFAULT_FONT_STYLE, DEFAULT_TEXT_SIZE, ScaleInput } from "./model";

export function D3reduceData<ChartData extends Record<string, unknown>>(
    data: ChartData[],
    dataSchema: D3DataSchema
) {
    const {
        period,
        type,
        amount,
        color,
    } = dataSchema
    return data.reduce((acc: Datum[], d: ChartData, i) => {
        return [
            ...acc,
            {
                amount: d[amount] as number,
                type: d[type] as string,
                period: d[period] as string,
                color: d[color] as string ?? DefaultGraphColorSchema.default.scheme[i],
                ...d,
            }
        ]
    }, []);
};

export function mergeClass(...args: (boolean | string | undefined | null)[]) {
    return args.filter(Boolean).join(' ');
}

export const getTextWidth = (
    text: string,
    maxWidth: number,
    fontSize = DEFAULT_TEXT_SIZE,
    fontStyle = DEFAULT_FONT_STYLE
) => {
    const a = document.createElement('canvas');
    const b = a.getContext('2d');

    if (b) {
        b.font = fontSize + 'px ' + fontStyle;

        return b.measureText(text).width
    };

    return maxWidth
}
//util for scale
export function getScaleTicks<Scale extends AnyD3Scale>(
    scale: Scale,
    numTicks?: number,
): ScaleInput<Scale>[] {
    // Because `Scale` is generic type which maybe a subset of AnyD3Scale
    // that may not have `ticks` field,
    // TypeScript will not let us do the `'ticks' in scale` check directly.
    // Have to manually cast and expand type first.
    const s = scale as AnyD3Scale;

    if ('ticks' in s) {
        return s.ticks(numTicks);
    }

    return s
        .domain()
        .filter(
            (_, index, arr) =>
                numTicks == null ||
                arr.length <= numTicks ||
                index % Math.round((arr.length - 1) / numTicks) === 0,
        );


}
export function getScaleBandwidth(scale: AnyD3Scale) {
    if (!scale) return 0;
    if ('bandwidth' in scale) {
        return scale.bandwidth();
    }

    const range = scale.range();
    const domain = scale.domain();
    return Math.abs(range[range.length - 1] - range[0]) / domain.length;
}
