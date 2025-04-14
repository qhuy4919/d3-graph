import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { D3ScaleSpec } from "../spec";

export const ScaleRenderer = (spec?: D3ScaleSpec) => {
    function getScaleBackbone(spec: D3ScaleSpec) {
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
                    .nice(nice)

            case 'band':
                return scaleBand()
                    .domain(domain as string[])
                    .rangeRound(rangeRound as number[])
                    .padding(padding)

            case "ordinal":
                return scaleOrdinal()
                    .domain(domain as string[])
                    .range(range)
        }
    }

    return spec ? getScaleBackbone(spec) : undefined
}