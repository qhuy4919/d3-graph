import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Color from 'd3-color';
import * as d3Collection from 'd3-collection';
import * as d3Dispatch from 'd3-dispatch';
import * as d3Ease from 'd3-ease';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import {
    Selection,
    BaseType,
    select
} from 'd3-selection';
import assign from 'lodash.assign';
import colorHelper from './color';

// Type definitions
type StackedBarData = {
    name: string;
    stack: string;
    value: number | string;
    total?: number;
    [key: string]: unknown;
};

type TransformData = {
    total?: number;
    [key: string]: unknown;

}

type Margin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export function stackedBar() {
    const margin: Margin = { top: 40, right: 30, bottom: 60, left: 70 };
    let width = 960;
    let height = 500;

    let xScale: d3Scale.ScaleBand<string> | d3Scale.ScaleLinear<number, number> | undefined = undefined;
    let yScale: d3Scale.ScaleBand<string> | d3Scale.ScaleLinear<number, number> | undefined = undefined;

    let xAxis: d3Axis.Axis<string | number>;
    let yAxis: d3Axis.Axis<string | number>;

    let aspectRatio: number | null = null;
    let yTickTextYOffset = -8;
    let yTickTextXOffset = -20;
    let locale: string | undefined;

    let yTicks = 5;
    let xTicks = 5;
    let percentageAxisToMaxRatio = 1;

    const colorSchema = colorHelper().colorSchemas.britecharts;

    let colorScale: d3Scale.ScaleOrdinal<string, unknown, never> | undefined = undefined;
    let categoryColorMap: Record<string, string> = {};

    let ease = d3Ease.easeQuadInOut;
    const isHorizontal = false;

    let svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown> | null = null;
    let chartWidth: number;
    let chartHeight: number;
    let data: StackedBarData[];
    let transformedData: TransformData[] = [];
    let layers: d3Shape.Series<{ [key: string]: number; }, string>[] = [];
    let stacks: string[];
    let layerElements: Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined = undefined;
    let hasReversedStacks = false;

    let tooltipThreshold = 480;

    let yAxisLabel: string | undefined;
    let yAxisLabelEl: Selection<SVGTextElement, unknown, HTMLElement, unknown>;
    let yAxisLabelOffset = -60;

    let baseLine: Selection<SVGLineElement, unknown, HTMLElement, unknown>;
    let xAxisPadding = { top: 0, left: 0, bottom: 0, right: 0 };
    let barOpacity = 0.24;

    let animationDelayStep = 20;
    let animationDuration = 1000;
    let animationDelays: number[];

    let grid: 'horizontal' | 'vertical' | 'full' | null = null;

    const betweenBarsPadding = 0.1,
        betweenGroupsPadding = 0.1;
    const nameLabel = 'name';
    const valueLabel = 'value';
    const stackLabel = 'stack';
    const valueLabelFormat = ',f';

    const getName = (data: StackedBarData) => data[nameLabel];
    const getValue = (data: StackedBarData) => data[valueLabel];
    const getStack = (data: StackedBarData) => data[stackLabel];

    const getValOrDefaultToZero = (val: number) => (isNaN(val) || val < 0 ? 0 : val);
    let isAnimated = false;

    const dispatcher = d3Dispatch.dispatch(
        'customMouseOver',
        'customMouseOut',
        'customMouseMove',
        'customClick'
    );

    // Function definitions, types, and module structure are preserved.

    function exports(_selection: Selection<BaseType, StackedBarData[], BaseType, StackedBarData[]>) {
        _selection.each(function (_data: StackedBarData[]) {
            chartWidth = width - margin.left - margin.right;
            chartHeight = height - margin.top - margin.bottom;
            data = cleanData(_data);

            prepareData(data);
            buildScales();
            buildLayers();
            buildSVG(this);
            drawGridLines();
            buildAxis();
            drawAxis();
            drawStackedBar();
        });
    }

    // Add other functions and handlers here, translated similarly.

    function cleanData(originData: StackedBarData[]) {
        return originData.reduce((acc: StackedBarData[], d: StackedBarData) => {
            d.value = parseInt(d[valueLabel].toString());
            d.stack = d[stackLabel];
            d.name = d[nameLabel];
            d.topicName = getStack(d); //for tooltip

            return [...acc, d];
        }, [])
    }

    function prepareData(data: StackedBarData[]) {
        // Helper function to ensure stack uniqueness
        const uniq = (arr: string[]): string[] => [...new Set(arr)];

        // Extract unique stacks
        stacks = uniq(data.map(({ stack }) => stack));

        // Reverse stack order if specified
        if (hasReversedStacks) {
            stacks = stacks.reverse();
        }

        // Transform data into a nested structure and compute totals
        transformedData = d3Collection
            .nest<StackedBarData, any>()
            .key(getName)
            .rollup((values) => {
                const ret: Record<string, number | StackedBarData[]> = {};

                values.forEach((entry) => {
                    if (entry && entry[stackLabel]) {
                        ret[entry[stackLabel]] = getValue(entry);
                    }
                });

                // Include the original values for tooltip usage
                ret.values = values;

                return ret;
            })
            .entries(data)
            .map(({ key, value }) => ({
                total: d3Array.sum(d3Array.permute(value, stacks)),
                key,
                ...value,
            }));
    };


    function adjustYTickLabels(selection: Selection<SVGSVGElement, unknown, HTMLElement, unknown>): void {
        selection.selectAll('.tick text')
            .attr('transform', `translate(${yTickTextXOffset}, ${yTickTextYOffset})`);
    };

    function drawVerticalExtendedLine() {
        if (svg) {
            baseLine = svg.select('.grid-lines-group')
                .selectAll('line.extended-y-line')
                .data([0])
                .enter()
                .append('line')
                .attr('class', 'extended-y-line')
                .attr('y1', (xAxisPadding.bottom))
                .attr('y2', chartHeight)
                .attr('x1', 0)
                .attr('x2', 0);
        }
    }

    function drawHorizontalExtendedLine() {
        if (svg) {
            baseLine = svg.select('.grid-lines-group')
                .selectAll('line.extended-x-line')
                .data([0])
                .enter()
                .append('line')
                .attr('class', 'extended-x-line')
                .attr('x1', (xAxisPadding.left))
                .attr('x2', chartWidth)
                .attr('y1', chartHeight)
                .attr('y2', chartHeight);
        }
    }

    function drawHorizontalBars(layersSelection) {
        const layerJoin = layersSelection
            .data(layers);

        layerElements = layerJoin
            .enter()
            .append('g')
            .attr('fill', (({ key }) => categoryColorMap[key]))
            .classed('layer', true);

        let barJoin = layerElements
            .selectAll('.bar')
            .data((d) => filterOutUnkownValues(d));

        // Enter + Update
        let bars = barJoin
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', (d) => xScale(d[0]))
            .attr('y', (d) => yScale(d.data.key))
            .attr('height', yScale.bandwidth());

        if (isAnimated) {
            bars.style('opacity', barOpacity)
                .transition()
                .delay((_, i) => animationDelays[i])
                .duration(animationDuration)
                .ease(ease)
                .tween('attr.width', horizontalBarsTween);
        } else {
            bars.attr('width', (d) => xScale(d[1] - d[0]));
        }
    };

    function drawVerticalBars(layersSelection) {
        let layerJoin = layersSelection
            .data(layers);

        layerElements = layerJoin
            .enter()
            .append('g')
            .attr('fill', (({ key }) => categoryColorMap[key]))
            .classed('layer', true);

        let barJoin = layerElements
            .selectAll('.bar')
            .data((d) => filterOutUnkownValues(d));

        // Enter + Update
        let bars = barJoin
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', (d) => xScale(d.data.key))
            .attr('y', (d) => yScale(d[1]))
            .attr('width', xScale.bandwidth);

        if (isAnimated) {
            bars.style('opacity', barOpacity)
                .transition()
                .delay((_, i) => animationDelays[i])
                .duration(animationDuration)
                .ease(ease)
                .tween('attr.height', verticalBarsTween);
        } else {
            bars.attr('height', (d) => yScale(d[0]) - yScale(d[1]));
        }
    }

    function getYMax() {
        const uniqueDataPoints = new Set<number>(transformedData.map(item => item.total ?? 0));
        const isAllZero = uniqueDataPoints.size === 1 && uniqueDataPoints.has(0);

        if (isAllZero) {
            return 1;
        } else {
            return d3Array.max(transformedData.map(item => item.total ?? 0)) ?? 0;
        }
    }
    function buildAxis(): void {
        if (isHorizontal) {
            if (xScale) xAxis = d3Axis.axisBottom(xScale as d3Axis.AxisScale<any>).ticks(xTicks, valueLabelFormat);
            if (yScale) yAxis = d3Axis.axisLeft(yScale as d3Axis.AxisScale<any>)
        } else {
            if (xScale) xAxis = d3Axis.axisBottom(xScale as d3Axis.AxisScale<any>)
            if (yScale) yAxis = d3Axis.axisLeft(yScale as d3Axis.AxisScale<any>).ticks(yTicks, valueLabelFormat)
        }
    }

    function buildContainerGroups(): void {
        if (svg) {
            const container = svg.append('g')
                .classed('container-group', true)
                .attr('transform', `translate(${margin.left},${margin.top})`);

            container.append('g').classed('x-axis-group', true)
                .append('g').classed('x axis', true);

            container.selectAll('.x-axis-group')
                .append('g').classed('month-axis', true);

            container.append('g').classed('y-axis-group axis', true);
            container.append('g').classed('grid-lines-group', true);
            container.append('g').classed('chart-group', true);
            container.append('g').classed('y-axis-label', true);
            container.append('g').classed('metadata-group', true);
        }
    };

    function buildSVG(container: BaseType) {
        if (!svg) {
            svg = select(container)
                .append('svg')
                .classed('britechart stacked-bar', true);

            buildContainerGroups();
        }

        svg
            .attr('width', width)
            .attr('height', height);
    };

    function buildScales() {
        const yMax = getYMax();

        if (isHorizontal) {
            xScale = d3Scale.scaleLinear()
                .domain([0, yMax])
                .rangeRound([0, chartWidth - 1]);
            // 1 pix for edge tick

            yScale = d3Scale.scaleBand()
                .domain(data.map(getName))
                .rangeRound([chartHeight, 0])
                .padding(betweenBarsPadding);
        } else {
            xScale = d3Scale.scaleBand()
                .domain(data.map(getName))
                .rangeRound([0, chartWidth])
                .padding(betweenBarsPadding);

            yScale = d3Scale.scaleLinear()
                .domain([0, yMax])
                .rangeRound([chartHeight, 0])
                .nice();
        }

        colorScale = d3Scale.scaleOrdinal()
            .range(colorSchema)
            .domain(data.map(getStack));

        categoryColorMap = colorScale
            .domain(data.map(getStack))
            .domain()
            .reduce((memo: Record<string, string>, item: string) => {
                if (memo && colorScale) {
                    memo[item] = colorScale(item) as string
                }
                return memo;
            }, {});
    };

    function buildLayers() {
        const stackBar = d3Shape.stack().keys(stacks);
        const dataInitial = transformedData.map((item) => {
            const ret: Record<string, number> = {};

            stacks.forEach((key) => {
                ret[key] = item[key] as number;
            });

            return assign({}, item, ret);
        });

        layers = stackBar(dataInitial);
    };

    function drawGridLines() {
        const scale = isHorizontal ? xScale : yScale;

        if (scale && svg) {
            svg.select('.grid-lines-group')
                .selectAll('line')
                .remove();

            if (grid === 'horizontal' || grid === 'full') {
                svg.select('.grid-lines-group')
                    .selectAll('line.horizontal-grid-line')
                    .data(scale.ticks(yTicks).slice(1))
                    .enter()
                    .append('line')
                    .attr('class', 'horizontal-grid-line')
                    .attr('x1', (-xAxisPadding.left + 1))
                    .attr('x2', chartWidth)
                    .attr('y1', (d) => yScale(d))
                    .attr('y2', (d) => yScale(d));
            }

            if (grid === 'vertical' || grid === 'full') {
                svg.select('.grid-lines-group')
                    .selectAll('line.vertical-grid-line')
                    .data(scale.ticks(xTicks).slice(1))
                    .enter()
                    .append('line')
                    .attr('class', 'vertical-grid-line')
                    .attr('y1', 0)
                    .attr('y2', chartHeight)
                    .attr('x1', (d) => xScale(d))
                    .attr('x2', (d) => xScale(d));
            }

            if (isHorizontal) {
                drawVerticalExtendedLine();
            } else {
                drawHorizontalExtendedLine();
            }
        }
    };

    function drawAxis() {
        if (svg && xAxis && yAxis) {
            if (isHorizontal) {
                // Horizontal layout: x-axis at the bottom and y-axis on the left
                svg.select('.x-axis-group .axis.x')
                    .attr('transform', `translate(0, ${chartHeight})`)
                    .call(xAxis as d3Axis.Axis<SVGElement>);

                svg.select('.y-axis-group.axis')
                    .attr('transform', `translate(${-xAxisPadding.left}, 0)`)
                    .call(yAxis as d3Axis.Axis<SVGElement>);
            } else {
                // Vertical layout: x-axis at the bottom and y-axis on the left
                svg.select('.x-axis-group .axis.x')
                    .attr('transform', `translate(0, ${chartHeight})`)
                    .call(xAxis as d3Axis.Axis<SVGElement>);

                svg.select('.y-axis-group.axis')
                    .attr('transform', `translate(${-xAxisPadding.left}, 0)`)
                    .call(yAxis as d3Axis.Axis<SVGElement>)
                    .call(adjustYTickLabels);
            }

            // Add y-axis label if it exists
            if (yAxisLabel) {
                if (yAxisLabelEl) {
                    svg.selectAll('.y-axis-label-text').remove();
                }

                yAxisLabelEl = svg
                    .select('.y-axis-label')
                    .append('text')
                    .classed('y-axis-label-text', true)
                    .attr('x', -chartHeight / 2)
                    .attr('y', yAxisLabelOffset)
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(270 0 0)')
                    .text(yAxisLabel);
            }
        }
    };

    function drawStackedBar() {
        // Not ideal, we need to figure out how to call exit for nested elements
        if (svg) {
            if (layerElements) {
                svg.selectAll('.layer').remove();
            }

            let series = svg.select('.chart-group').selectAll('.layer')

            animationDelays = d3Array.range(animationDelayStep, (layers[0].length + 1) * animationDelayStep, animationDelayStep)

            if (isHorizontal) {
                drawHorizontalBars(series)
            } else {
                drawVerticalBars(series)
            }
            // Exit
            series.exit()
                .transition()
                .style('opacity', 0)
                .remove();
        }
    };

    exports.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        if (aspectRatio) {
            height = Math.ceil(_x * aspectRatio);
        }
        width = _x;

        return this;
    };

    return exports;
}

import data from './data.json';
import { useEffect, useRef } from 'react';
import { stackedBar as temp } from './simple-stack-bar';
export const BarChart = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const container = select('.group-bar-chart');



    useEffect(() => {
        const testDataSet = data;
     
        container.datum(testDataSet).call(temp);

    })

    return <svg className="group-bar-chart"
    >
    </svg>
}