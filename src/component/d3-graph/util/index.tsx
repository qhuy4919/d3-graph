import { Selection } from "d3-selection";
import { max } from 'd3-array';
import { ChartShape, DEFAULT_LEGEND_LABEL, DynamicLegendProps, } from "../model";
import { mergeDeepWith } from 'ramda';
import styled from 'styled-components';
import { renderToStaticMarkup } from 'react-dom/server';
export const validateContainer = (container: Selection<any, any, null, undefined>) => {
    if (container?.empty()) {
        throw Error('A root container is required');
    }
};

const StyledD3TooltipEntry = styled.div`
    width: 100%;
    height: 30px;
    display: block;
    padding: var(--spacing);
`

const DEFAULT_TEXT_SIZE = 12;
const DEFAULT_FONT_STYLE = 'Arial';
const DEFAULT_TEXT_WIDTH = 100;
const DEFAULT_MARGIN_RATIO = 0.15;
const DEFAULT_MARKER_SIZE = 16;

export const clamp = (min: number, cur: number, max: number) => {
    return cur <= min ? min : cur >= max ? max : cur;
};

export const getTextWidth = (text: string, fontSize = DEFAULT_TEXT_SIZE, fontstyle = DEFAULT_FONT_STYLE) => {
    const a = document.createElement('canvas');
    const b = a.getContext('2d');

    if (b) {
        b.font = fontSize + 'px ' + fontstyle;

        return b.measureText(text).width
    };

    return DEFAULT_TEXT_WIDTH
}

export const getLineElementMargin = (marginRatio = DEFAULT_MARGIN_RATIO, markerSize = DEFAULT_MARKER_SIZE) => {
    return marginRatio * markerSize;
}

export const getMax = (totalList: Set<number>) => {
    const isAllZero = totalList.size === 1 && totalList.has(0);

    if (isAllZero) {
        return 1;
    } else {
        return max(totalList) ?? 0;
    }
}

export function getValOrDefaultToZero(value: number) {
    return (isNaN(value) || value < 0) ? 0 : value
};

export function interactiveElement(shape: ChartShape) {
    switch (shape) {
        case 'stacked': return 'bar'
        case 'group': return 'bar'
        case 'pie': return 'arc'
        default: return 'bar'
    }
}

export function mergeWithDefault<D = Record<string, unknown>>(
    defaultObject: Partial<D> = {},
    object: Partial<D> = {},
): D {
    const mergeCriteria = (left: unknown, right: unknown) => right === undefined || right === null ? left : right;

    return mergeDeepWith(mergeCriteria, defaultObject, object);
};


type LegendConfig = {
    defaultWidth: number,
    defaultHeight: number
    fontSize: number,
    markerSize: number
} & Partial<Omit<DynamicLegendProps, 'selection'>>
export function getLegendWidth<T extends Record<string, unknown>>(data: T[], config: LegendConfig) {
    const { fontSize, markerSize, legendLabel = DEFAULT_LEGEND_LABEL } = config;

    const labelList = [legendLabel, ...new Set(
        data.map(d => d.type)
    )] as string[];

    const totalLegendWidth = labelList.reduce((acc, curr) => {
        return acc += getTextWidth(curr, fontSize) + markerSize + getLineElementMargin();
    }, 0);

    return totalLegendWidth;
}

export function getLegendHeight<T extends Record<string, unknown>>(data: T[], config: LegendConfig) {
    const { defaultHeight, defaultWidth } = config;
    const padding = 10;
    const legendWidth = getLegendWidth(data, config);
    return Math.ceil(legendWidth / defaultWidth * defaultHeight) + padding;
}

export type GraphTextBuilder<
    Data extends Record<string, unknown> = Record<string, unknown>,
    CustomizeProps extends Record<string, unknown> = Record<string, unknown>
> = Partial<Record<keyof Required<Data>, string | ((props: CustomizeProps) => string)>>;
export const withD3CustomizableTooltip = <
    Data extends Record<string, unknown> = Record<string, unknown>,
    Props extends Record<string, unknown> = Record<string, unknown>
>(
    tooltipLabel: { default: GraphTextBuilder<Data, Props>, customize?: GraphTextBuilder<Data, Props> },
    tooltipValue: { default: GraphTextBuilder<Data, Props>, customize?: GraphTextBuilder<Data, Props> },
    customizeProps: Props,
    isLimitTooltip?: boolean,
) => {
    const combinedTooltipLabelMap = mergeWithDefault(
        tooltipLabel.default,
        tooltipLabel.customize,
    );
    const combinedTooltipValueMap = mergeWithDefault(
        tooltipValue.default,
        tooltipValue.customize,
    );

    return (fieldNameList: (keyof Data)[]) => {
        const serializedTooltipFieldList = fieldNameList
            .map(fieldName => {
                const labelBuilder = combinedTooltipLabelMap[fieldName];
                const valueBuilder = combinedTooltipValueMap[fieldName];
                if (!labelBuilder || !valueBuilder) return <></>;
                const label = typeof labelBuilder === 'string' ? labelBuilder : labelBuilder(customizeProps);
                const value = typeof valueBuilder === 'string' ? valueBuilder : valueBuilder(customizeProps);

                return <StyledD3TooltipEntry>
                    <b>{label}</b>:&nbsp;
                    <span>{value}</span>
                </StyledD3TooltipEntry>;
            });

        if (isLimitTooltip) {
            return `{ ${serializedTooltipFieldList.join(',')},"Click to show more": ''}`;
        }
        return renderToStaticMarkup(serializedTooltipFieldList.map(x => x));

    };
};

export const countBy = <Data extends Record<string, unknown> = Record<string, unknown>>(
    data: Data[],
    key: keyof Data,
) => {
    return (data ?? []).reduce(function (prev, curr) {
        const groupingValue = curr[key] as string;
        if (prev[groupingValue] === undefined) prev[groupingValue] = 0;
        prev[groupingValue] += 1;

        return prev;
    }, {} as Record<string, number>);
};

const calculateLabelAngle = (domainLength: number, width: number) => {
    const domainTickSize = width / domainLength;
    return domainLength === -1
        ? -35
        : Math.round(clamp(
            -35,
            -1 * Math.acos(clamp(1, domainTickSize, 90) / 90) * 180 / (Math.PI),
            0));
};
const calculateFontSize = (domainLength: number, width: number) => {
    if (domainLength === -1) return 10;
    return clamp(
        11,
        Math.round(width / domainLength * 0.125),
        15,
    );
};
const calculateMarkFontSize = (domainLength: number, width: number) => {
    if (domainLength === -1) return 10;
    return clamp(
        11,
        Math.round(width / domainLength * 0.125),
        15,
    );
};
export const withDynamicSize = (
    data: Record<string, unknown>[],
    width: number,
    fastRender = false,
    countKey = 'period',
) => {
    const domainLength = fastRender ? -1 : Object.keys(countBy(data, countKey)).length;
    return {
        labelAngle: calculateLabelAngle(domainLength, width),
        fontSize: calculateFontSize(domainLength, width),
        labelLimit: domainLength > 0
            ? 0.85 * width / domainLength // Tỷ lệ ước chừng của đồ thị ngang sau khi trừ đi trục tung
            : 100,
        markFontSize: calculateMarkFontSize(domainLength, width),
    };
};