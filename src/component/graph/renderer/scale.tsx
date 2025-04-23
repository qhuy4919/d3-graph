import { scaleBand, scaleLinear, scaleOrdinal, scaleTime } from "d3-scale";
import { D3ScaleSpec } from "../spec";
import { D3ScaleOutput, PickD3Scale } from "../model";

export const ScaleRenderer = <
    T extends D3ScaleSpec['type'],
    Output extends D3ScaleOutput
>(spec?: D3ScaleSpec) => {
    if (
        !spec ||
        typeof spec !== 'object' ||
        !('type' in spec)
    ) {
        throw new Error('Scale render failed!');
    }
    const {
        type,
        name,
        domain = [],
        range = [],
        rangeRound = [],
        nice,
        padding = 1,
    } = spec;

    switch (type) {
        case 'linear':
            return scaleLinear()
                .domain(domain as number[])
                .rangeRound(rangeRound as number[])
                .nice(nice) as PickD3Scale<T, Output>

        case 'band':
            return scaleBand()
                .domain(domain as string[])
                .rangeRound(rangeRound as number[])
                .padding(padding) as PickD3Scale<T, Output>

        case "ordinal":
            return scaleOrdinal<string, string>()
                .domain(domain as string[])
                .range(range as string[]) as PickD3Scale<T, Output>
        case 'time':
            return scaleTime<string>()
                .domain(domain as Iterable<Date | number>)
                .range(range as string[]) as PickD3Scale<T, Output>
        default:
            throw new Error(`Something wrong with ${name}`)
    }

};