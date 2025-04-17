import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { D3ScaleSpec } from "../spec";
import { PickD3Scale } from "../model";

export const ScaleRenderer = <T extends D3ScaleSpec['type']>(spec?: D3ScaleSpec) => {
    function getScaleBackbone<T extends D3ScaleSpec['type']>(spec: D3ScaleSpec) {
        const { type,
            domain,
            range,
            rangeRound,
            nice,
            padding
        } = spec;
        switch (type) {
            case 'linear':
                return scaleLinear()
                    .domain(domain as number[])
                    .rangeRound(rangeRound as number[])
                    .nice(nice) as PickD3Scale<T>

            case 'band':
                return scaleBand()
                    .domain(domain as string[])
                    .rangeRound(rangeRound as number[])
                    .padding(padding) as PickD3Scale<T>

            case "ordinal":
                return scaleOrdinal<string, string>()
                    .domain(domain as string[])
                    .range(range as string[]) as PickD3Scale<T>
        }
    }

    return spec ? getScaleBackbone<T>(spec) : undefined
};