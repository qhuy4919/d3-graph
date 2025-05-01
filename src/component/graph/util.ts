import { BaseType, select } from "d3-selection";
import { groups as d3Groups } from 'd3-array'
import { DefaultGraphColorSchema } from "../theme";
import {
    AnyD3Scale,
    AxisScale,
    D3DataSchema,
    D3Selection,
    D3Datum,
    DEFAULT_FONT_STYLE,
    ScaleInput,
    STACK_OFFSETS,
    STACK_ORDERS,
} from "./model";
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
    return data.reduce((acc: D3Datum[], d: ChartData, i) => {
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
    fontSize: React.CSSProperties['fontSize'],
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
export function getScaleBandwidth(scale: AnyD3Scale | AxisScale) {
    if (!scale) return 0;
    if ('bandwidth' in scale) {
        return scale.bandwidth?.() ?? 0;
    }

    const range = scale.range();
    const domain = scale.domain();
    return Math.abs(range[range.length - 1] - range[0]) / domain.length;
}


//style
export function stringifyStyling(style: React.CSSProperties) {
    if (!style) return '';
    return Object.keys(style).reduce((acc, key) => (
        acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key as keyof React.CSSProperties] + ';'
    ), '');
}

export function truncateLabel(
    text: D3Selection<BaseType, unknown, BaseType, D3Datum>,
    width: number = 0,
    fontSize: number = 12,
) {
    const truncateText = '...';


    text.each(function () {
        let labelName = select(this).text();
        const textWidth = getTextWidth(labelName, width, fontSize);
        if (textWidth >= width) {
            const truncateLength =
                Math.round(width / fontSize) +
                truncateText.length;


            labelName =
                labelName.slice(0, truncateLength) +
                truncateText;
        }

        select(this).text(labelName)
    })
}

//shape util
export function stackOrder(order?: keyof typeof STACK_ORDERS) {
    return (order && STACK_ORDERS[order]) || STACK_ORDERS.none;
}
export function stackOffset(offset?: keyof typeof STACK_OFFSETS) {
    return (offset && STACK_OFFSETS[offset]) || STACK_OFFSETS.none;
}

export function stackedTransformData<Data extends D3Datum>(data: Data[]) {
    return d3Groups(data, d => d.period).reduce(
        (acc: Data[], d: [string, Data[]]) => {
            let total = 0;
            const newEntry = {} as Data;

            (d?.[1] ?? []).forEach((entry) => {
                if (typeof entry.type === 'string')
                    Object.assign(newEntry, { [entry.type]: entry })
                total += entry.amount;

            });
            Object.assign(newEntry, { _dataKey: d[0] })
            Object.assign(newEntry, { _total: total })


            return [
                ...acc,
                newEntry
            ]

        }, []
    )
}

export function setNumberOrNumberAccessor<NumAccessor>(
    func: (d: number | NumAccessor) => void,
    value: number | NumAccessor,
) {
    if (typeof value === 'number') func(value);
    else func(value);
}

//end of region