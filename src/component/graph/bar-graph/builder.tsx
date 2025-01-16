import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Collection from 'd3-collection';
import * as d3Dispatch from 'd3-dispatch';
import * as d3Ease from 'd3-ease';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import {
    Selection,
    BaseType,
    select
} from 'd3-selection';
import assign from 'lodash.assign';
import colorHelper from './color';
import { validateContainer } from '../util';

// Type definitions
type StackedBarData = {
    name: string;
    stack: string;
    value: number | string;
    total?: number;
    [key: string]: any;
};

type TransformData = {
    total?: number;
    [key: string]: any;

}

type Margin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export class StackedBarSpec {
    public margin: Margin = { top: 40, right: 30, bottom: 60, left: 70 };
    //prop for constructor
    public _width = 960;
    public _height = 500;
    public animationDelayStep = 20;
    public animationDuration = 1000;
    public animationDelays: number[] = [100];
    public isAnimated = false;
    public grid: 'horizontal' | 'vertical' | 'full' | null = null;

    public isHorizontal: boolean = false;
    public colorSchema = colorHelper().colorSchemas.britecharts;

    public betweenBarsPadding = 0.1;
    public betweenGroupsPadding = 0.1;
    public _nameLabel: string = 'name';
    public _valueLabel: string = 'value';
    public _stackLabel: string = 'stack';
    public valueLabelFormat: string = ',f';

    //data
    private _data: StackedBarData[] = [];
    private transformedData: TransformData[] = [];
    private layers: d3Shape.Series<{ [key: string]: number; }, string>[] = [];

    //
    private xScale: d3Scale.ScaleBand<string> | d3Scale.ScaleLinear<number, number> | undefined = undefined;
    private yScale: d3Scale.ScaleBand<string> | d3Scale.ScaleLinear<number, number> | undefined = undefined;
    private xAxis: d3Axis.Axis<string | number>;
    private yAxis: d3Axis.Axis<string | number>;

    private aspectRatio: number | null = null;
    private yTickTextYOffset = -8;
    private yTickTextXOffset = -20;
    private locale: string | undefined;
    private yTicks = 5;
    private xTicks = 5;
    private percentageAxisToMaxRatio = 1;
    private colorScale: d3Scale.ScaleOrdinal<string, unknown, never> | undefined = undefined;
    private categoryColorMap: Record<string, string> = {};
    private ease = d3Ease.easeQuadInOut;
    private svg: Selection<SVGSVGElement, unknown, null, undefined>;

    private stacks: string[];
    private layerElements: Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined = undefined;
    private hasReversedStacks = false;

    private tooltipThreshold = 480;

    private yAxisLabel: string | undefined;
    private yAxisLabelEl: Selection<SVGTextElement, unknown, HTMLElement, unknown>;
    private yAxisLabelOffset = -60;

    private baseLine: Selection<SVGLineElement, number, BaseType, unknown>;
    private xAxisPadding = { top: 0, left: 0, bottom: 0, right: 0 };
    private barOpacity = 0.24;

    private chartWidth = this._width - this.margin.left - this.margin.right;
    private chartHeight = this._height - this.margin.top - this.margin.bottom;

    public dispatcher = d3Dispatch.dispatch(
        'customMouseOver',
        'customMouseOut',
        'customMouseMove',
        'customClick'
    );

    public constructor(containerWidth: number) {
        this._width = containerWidth;
    }

    public set data(data: StackedBarData[]) {
        this._data = data;
    }

    public getStack(data: StackedBarData) {
        return data[this._stackLabel];
    }

    public getName(data: StackedBarData) {
        return data[this._nameLabel];
    }

    public getValue(data: StackedBarData) {
        return data[this._valueLabel];
    }

    private getValOrDefaultToZero(value: number) {
        return (isNaN(value) || value < 0) ? 0 : value
    }

    public adjustYTickLabels(selection: Selection<SVGSVGElement, unknown, null, undefined>) {
        selection.selectAll('.tick text')
            .attr('transform', `translate(${this.yTickTextXOffset}, ${this.yTickTextYOffset})`);
    }

    private getYMax() {
        const uniqueDataPoints = new Set<number>(this.transformedData.map(item => item.total ?? 0));
        const isAllZero = uniqueDataPoints.size === 1 && uniqueDataPoints.has(0);

        if (isAllZero) {
            return 1;
        } else {
            return d3Array.max(this.transformedData.map(item => item.total ?? 0)) ?? 0;
        }
    };

    private drawVerticalExtendedLine() {
        if (this.svg) {
            this.baseLine = this.svg.select('.grid-lines-group')
                .selectAll('line.extended-y-line')
                .data([0])
                .enter()
                .append('line')
                .attr('class', 'extended-y-line')
                .attr('y1', (this.xAxisPadding.bottom))
                .attr('y2', this.chartHeight)
                .attr('x1', 0)
                .attr('x2', 0);
        }
    }

    private buildContainerGroups(): void {
        if (this.svg) {
            const container = this.svg.append('g')
                .classed('container-group', true)
                .style('fill', 'orange')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

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


    private drawHorizontalExtendedLine() {
        if (this.svg) {
            this.baseLine = this.svg.select('.grid-lines-group')
                .selectAll('line.extended-x-line')
                .data([0])
                .enter()
                .append('line')
                .attr('class', 'extended-x-line')
                .attr('x1', (this.xAxisPadding.left))
                .attr('x2', this.chartWidth)
                .attr('y1', this.chartHeight)
                .attr('y2', this.chartHeight);
        }
    }


    public buildSvg(container: BaseType) {
        if (!this.svg) {
            this.svg = select(container)
                .append('svg')
                .classed('d3-stacked-bar', true);
            this.buildContainerGroups()
        }

        this.svg
            ?.attr('width', this._width)
            ?.attr('height', this._height)
    };

    private cleanData(originData: StackedBarData[]) {
        return originData.reduce((acc: StackedBarData[], d: StackedBarData) => {
            const valueLabel = this._valueLabel;
            const stackLabel = this._stackLabel;
            const nameLabel = this._nameLabel;

            d.value = parseInt(d[valueLabel].toString());
            d.stack = d[stackLabel];
            d.name = d[nameLabel];
            d.topicName = this.getStack(d); //for tooltip

            return [...acc, d];
        }, [])
    }

    private prepareData(data: StackedBarData[]) {
        // Helper function to ensure stack uniqueness
        const uniq = (arr: string[]): string[] => [...new Set(arr)];

        // Extract unique stacks
        this.stacks = uniq(data.map(({ stack }) => stack));

        // Reverse stack order if specified
        if (this.hasReversedStacks) {
            this.stacks = this.stacks.reverse();
        }

        // Transform data into a nested structure and compute totals
        this.transformedData = d3Collection
            .nest<StackedBarData, Record<string, any>>()
            .key(this.getName.bind(this))
            .rollup((values) => {
                const ret: Record<string, number | StackedBarData[]> = {};

                values.forEach((entry) => {
                    if (entry && entry[this._stackLabel]) {
                        ret[entry[this._stackLabel]] = this.getValue(entry);
                    }
                });

                // Include the original values for tooltip usage
                ret.values = values;

                return ret;
            })
            .entries(data)
            .map(({ key, value }) => {
                const normalizedStack = this.stacks.map(x => parseInt(x))
                return {
                    total: d3Array.sum(d3Array.permute(value, normalizedStack)),
                    key,
                    ...value,
                }
            });
    };

    public buildScales() {
        const yMax = this.getYMax();

        if (this.isHorizontal) {
            this.xScale = d3Scale.scaleLinear()
                .domain([0, yMax])
                .rangeRound([0, this.chartWidth - 1]);
            // 1 pix for edge tick

            this.yScale = d3Scale.scaleBand()
                .domain(this._data.map(i => this.getName(i)))
                .rangeRound([this.chartHeight, 0])
                .padding(this.betweenBarsPadding);
        } else {
            this.xScale = d3Scale.scaleBand()
                .domain(this._data.map(i => this.getName(i)))
                .rangeRound([0, this.chartWidth])
                .padding(this.betweenBarsPadding);

            this.yScale = d3Scale.scaleLinear()
                .domain([0, yMax])
                .rangeRound([this.chartHeight, 0])
                .nice();
        }

        this.colorScale = d3Scale.scaleOrdinal()
            .range(this.colorSchema)
            .domain(this._data.map(x => this.getStack(x)));

        this.categoryColorMap = this.colorScale
            .domain(this._data.map(x => this.getStack(x)))
            .domain()
            .reduce((memo: Record<string, string>, item: string) => {
                if (memo && this.colorScale) {
                    memo[item] = this.colorScale(item) as string
                }
                return memo;
            }, {});
    };

    public buildAxis(): void {
        if (this.isHorizontal) {
            if (this.xScale) this.xAxis = d3Axis.axisBottom(this.xScale as d3Axis.AxisScale<any>).ticks(this.xTicks, this.valueLabelFormat);
            if (this.yScale) this.yAxis = d3Axis.axisLeft(this.yScale as d3Axis.AxisScale<any>)
        } else {
            if (this.xScale) this.xAxis = d3Axis.axisBottom(this.xScale as d3Axis.AxisScale<any>)
            if (this.yScale) this.yAxis = d3Axis.axisLeft(this.yScale as d3Axis.AxisScale<any>).ticks(this.yTicks, this.valueLabelFormat)
        }
    }


    public drawAxis() {
        if (this.svg && this.xAxis && this.yAxis) {
            if (this.isHorizontal) {
                // Horizontal layout: x-axis at the bottom and y-axis on the left
                this.svg.select('.x-axis-group .axis.x')
                    .attr('transform', `translate(0, ${this.chartHeight})`)
                    .call(this.xAxis);

                this.svg.select('.y-axis-group.axis')
                    .attr('transform', `translate(${-this.xAxisPadding.left}, 0)`)
                    .call(this.yAxis);
            } else {
                // Vertical layout: x-axis at the bottom and y-axis on the left
                this.svg.select('.x-axis-group .axis.x')
                    .attr('transform', `translate(0, ${this.chartHeight})`)
                    .call(this.xAxis);

                this.svg.select('.y-axis-group.axis')
                    .attr('transform', `translate(${-this.xAxisPadding.left}, 0)`)
                    .call(this.yAxis)
                    .call(this.adjustYTickLabels.bind(this));
            }

            // Add y-axis label if it exists
            if (this.yAxisLabel) {
                if (this.yAxisLabelEl) {
                    this.svg.selectAll('.y-axis-label-text').remove();
                }

                this.yAxisLabelEl = this.svg
                    .select('.y-axis-label')
                    .append('text')
                    .classed('y-axis-label-text', true)
                    .attr('x', -this.chartHeight / 2)
                    .attr('y', this.yAxisLabelOffset)
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(270 0 0)')
                    .text(this.yAxisLabel);
            }
        }
    };

    public drawGridLines() {
        const scale = this.isHorizontal ? this.xScale : this.yScale;

        if (scale && this.svg) {
            this.svg.select('.grid-lines-group')
                .selectAll('line')
                .remove();

            if (this.grid === 'horizontal' || this.grid === 'full') {
                this.svg.select('.grid-lines-group')
                    .selectAll('line.horizontal-grid-line')
                    .data(scale.ticks(this.yTicks).slice(1))
                    .enter()
                    .append('line')
                    .attr('class', 'horizontal-grid-line')
                    .attr('x1', (-this.xAxisPadding.left + 1))
                    .attr('x2', this.chartWidth)
                    .attr('y1', (d) => this.yScale(d))
                    .attr('y2', (d) => this.yScale(d));
            }

            if (this.grid === 'vertical' || this.grid === 'full') {
                this.svg.select('.grid-lines-group')
                    .selectAll('line.vertical-grid-line')
                    .data(scale.ticks(xTicks).slice(1))
                    .enter()
                    .append('line')
                    .attr('class', 'vertical-grid-line')
                    .attr('y1', 0)
                    .attr('y2', this.chartHeight)
                    .attr('x1', (d) => this.xScale(d))
                    .attr('x2', (d) => this.xScale(d));
            }

            if (this.isHorizontal) {
                this.drawVerticalExtendedLine();
            } else {
                this.drawHorizontalExtendedLine();
            }
        }
    };


    public build(_selection: Selection<BaseType, StackedBarData[], BaseType, StackedBarData[]>) {
        // const margin = this?.margin
        // const width = this._width;
        // const height = this._height;
        const _buildSvg = this.buildSvg.bind(this);
        const _buildScales = this.buildScales.bind(this);
        const _cleanData = this.cleanData.bind(this);
        const _prepareData = this.prepareData.bind(this);
        const _drawGridLines = this.drawGridLines.bind(this);
        const _buildAxis = this.buildAxis.bind(this);
        const _drawAxis = this.drawAxis.bind(this);

        _selection.each(function (_data: StackedBarData[]) {
            // const chartWidth = width - margin.left - margin.right;
            // const chartHeight = height - margin.top - margin.bottom;
            _prepareData(_cleanData(_data));
            _buildScales();
            // buildLayers();
            _buildSvg(this);
            _drawGridLines();
            _buildAxis();
            _drawAxis();
            // drawStackedBar();
            console.log(this);
        });
    }
}


export const stackBarBuilder = () => {
    const bar = {};
    const barChart = new StackedBarSpec(1000);

    const create = function (element: BaseType,
        data: StackedBarData[],
        configuration: Record<string, unknown>
    ) {
        const container = select(element);
        barChart.data = data;
        const chart = barChart.build;
        validateContainer(container);
        container.datum(data).call(chart.bind(barChart))
    };

    const update = function (
        element: BaseType,
        data: StackedBarData[],
        configuration: Record<string, unknown>,
        chart: unknown
    ) {
        // const container = select(element);
        // validateContainer(container);

        // // Calls the chart with the container and dataset
        // if (data && data.length) {
        //     container.datum(data).call(chart);
        // } else {
        //     container.call(chart);
        // }

        // return chart;
    }

    const destroy = () => { };

    return Object.assign(
        bar,
        {
            create,
            update,
            destroy,
        }
    )
}

