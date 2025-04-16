import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { D3ScaleSpec } from "../spec";
import { ScaleTypeToD3Scale } from "../model";

export const ScaleRenderer = (spec?: D3ScaleSpec) => {
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
                    .nice(nice) as ScaleTypeToD3Scale[T]

            case 'band':
                return scaleBand()
                    .domain(domain as string[])
                    .rangeRound(rangeRound as number[])
                    .padding(padding) as ScaleTypeToD3Scale[T]

            case "ordinal":
                return scaleOrdinal<string, string>()
                    .domain(domain as string[])
                    .range(range as string[]) as ScaleTypeToD3Scale[T]
        }
    }

    return spec ? getScaleBackbone(spec) : undefined
}