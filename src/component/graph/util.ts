import { DefaultGraphColorSchema } from "../theme";
import { D3DataSchema, Datum } from "./model";

export function D3reduceData<ChartData extends Record<string, unknown>>(data: ChartData[], dataSchema: D3DataSchema) {
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
