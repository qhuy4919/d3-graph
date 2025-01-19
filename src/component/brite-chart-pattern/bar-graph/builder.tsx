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
    select,
} from 'd3-selection';
import * as d3Selection from 'd3-selection'
import colorHelper from '../color';
import { validateContainer } from '../util';

// Type definitions
type StackedBarData = {
    name: string;
    stack: string;
    value: number;
    total?: number;
    date: string;
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

type D3Selection = Selection<BaseType | SVGSVGElement | SVGTextElement, unknown, null, undefined>;

export class StackedBarSpec {
    public margin: Margin = { top: 40, right: 30, bottom: 60, left: 70 };
    //prop for constructor
    public _width = 960;
    public _height = 500;
    public animationDelayStep = 20;
    public animationDuration = 1000;
    public animationDelays: number[] = [100];
    public isAnimated = false;
    public grid: 'horizontal' | 'vertical' | 'full' | null = 'horizontal';

    public isHorizontal: boolean = false;
    public colorSchema = colorHelper().colorSchemas.britecharts;

    public betweenBarsPadding = 0.1;
    public betweenGroupsPadding = 0.1;
    public _nameLabel: string = 'date';
    public _valueLabel: string = 'value';
    public _stackLabel: string = 'stack';
    public valueLabelFormat: string = ',f';

    //data
    private _data: StackedBarData[] = [];
    private transformedData: TransformData[] = [];
    private layers: d3Shape.Series<{ [key: string]: number; }, string>[] = [];

    //
    private xScale: d3Scale.ScaleBand<string> | d3Scale.ScaleLinear<number, number>;
    private yScale: d3Scale.ScaleBand<string> | d3Scale.ScaleLinear<number, number>;
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
    private svg: D3Selection;

    private stacks: string[];
    private layerElements: D3Selection;
    private hasReversedStacks = false;

    private tooltipThreshold = 480;

    private yAxisLabel: string | undefined;
    private yAxisLabelEl: Selection<SVGTextElement, unknown, BaseType, unknown>;
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

    private filterOutUnkownValues(d: any[]) {
        return d.map(layerEls => {
            for (let i = 0; i < layerEls.length; i++) {
                layerEls[i] = this.getValOrDefaultToZero(layerEls[i]);
            }
            return layerEls;
        });
    }

    public adjustYTickLabels(selection: Selection<BaseType, unknown, null, undefined>) {
        selection.selectAll('.tick text')
            .attr('transform', `translate(${this.yTickTextXOffset}, ${this.yTickTextYOffset})`);
    }

    private getYMax() {
        const uniqueDataPoints = new Set<number>(this.transformedData.map(d => d.total ?? 0));
        const isAllZero = uniqueDataPoints.size === 1 && uniqueDataPoints.has(0);

        if (isAllZero) {
            return 1;
        } else {
            return d3Array.max(uniqueDataPoints);
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


    public drawHorizontalBars(layersSelection: D3Selection) {
        const layerJoin = layersSelection
            .data(this.layers);

        this.layerElements = layerJoin
            .enter()
            .append('g')
            .attr('fill', (({ key }) => this.categoryColorMap[key]))
            .classed('layer', true);

        const barJoin = this?.layerElements
            .selectAll('.bar')
            .data((d) => this.filterOutUnkownValues(d));

        // Enter + Update
        const bars = barJoin
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', (d) => this.xScale(d[0]))
            .attr('y', (d) => this.yScale(d.data.key))
            .attr('height', this.yScale.bandwidth());

        bars.attr('width', (d) => this.xScale(d[1] - d[0]));

    };

    public drawVerticalBars(layersSelection: D3Selection) {
        let layerJoin = layersSelection
            .data(this.layers);

        this.layerElements = layerJoin
            .enter()
            .append('g')
            .attr('fill', (({ key }) => this.categoryColorMap[key]))
            .classed('layer', true);

        const barJoin = this.layerElements
            .selectAll('.bar')
            .data((d) => this.filterOutUnkownValues(d));

        // Enter + Update
        const bars = barJoin
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', (d) => this.xScale(d.data.key))
            .attr('y', (d) => {
                return this.yScale(d[1])
            })
            .attr('width', this.xScale.bandwidth());

        bars.attr('height', (d) => this.yScale(d[0]) - this.yScale(d[1]));

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

    private normalizedData(originData: StackedBarData[]) {
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

        // Extract unique stacks
        this.stacks = [...new Set(data.map(({ stack }) => stack))];

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
                let totalAmount = 0;

                //append stack field with value to main entry
                values.forEach((entry) => {
                    if (entry && entry[this._valueLabel]) {
                        totalAmount += entry[this._valueLabel]
                    }
                    if (entry && entry[this._stackLabel]) {
                        ret[entry[this._stackLabel]] = this.getValue(entry);
                    }
                });



                // Include the original values for tooltip usage
                ret.valueList = values;
                ret.total = totalAmount;

                return ret;
            })
            .entries(data)
            .map(({ key, value }) => {
                return {
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
            if (this.xScale) {
                this.xAxis = d3Axis
                    .axisBottom(this.xScale as d3Axis.AxisScale<string | number>)
                    .ticks(this.xTicks, this.valueLabelFormat)
            };
            if (this.yScale) {
                this.yAxis = d3Axis
                    .axisLeft(this.yScale as d3Axis.AxisScale<string | number>)
            }
        } else {
            if (this.xScale) {
                this.xAxis = d3Axis
                    .axisBottom(this.xScale as d3Axis.AxisScale<string | number>)
            }
            if (this.yScale) {
                this.yAxis = d3Axis
                    .axisLeft(this.yScale as d3Axis.AxisScale<string | number>)
                    .ticks(this.yTicks, this.valueLabelFormat)
            }
        }
    };

    public buildLayers() {
        const stackBar = d3Shape.stack().keys(this.stacks)
            .value((d, k) => d[k]);
        this.layers = stackBar(this.transformedData);
    };



    public drawAxis() {
        if (this.svg && this.xAxis && this.yAxis) {
            if (this.isHorizontal) {
                // Horizontal layout: x-axis at the bottom and y-axis on the left
                this.svg.select('.x-axis-group .axis.x')
                    .attr('transform', `translate(0, ${this.chartHeight})`)
                    .call(this.xAxis as any);

                this.svg.select('.y-axis-group.axis')
                    .attr('transform', `translate(${-this.xAxisPadding.left}, 0)`)
                    .call(this.yAxis as any);
            } else {
                // Vertical layout: x-axis at the bottom and y-axis on the left
                this.svg.select('.x-axis-group .axis.x')
                    .attr('transform', `translate(0, ${this.chartHeight})`)
                    .call(this.xAxis as any);

                this.svg.select('.y-axis-group.axis')
                    .attr('transform', `translate(${-this.xAxisPadding.left}, 0)`)
                    .call(this.yAxis as any)
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
        const scale = this.isHorizontal
            ? this.xScale as d3Scale.ScaleLinear<number, number, never>
            : this.yScale as d3Scale.ScaleLinear<number, number, never>;

        if (scale && this.svg) {
            this.svg.select('.grid-lines-group')
                .selectAll('line')
                .remove();

            if (this.grid === 'horizontal') {
                this.svg.select('.grid-lines-group')
                    .selectAll('line.horizontal-grid-line')
                    .data(scale.ticks(this.yTicks).slice(1))
                    .enter()
                    .append('line')
                    .attr('class', 'horizontal-grid-line')
                    .attr('x1', (-this.xAxisPadding.left + 1))
                    .attr('x2', this.chartWidth)
                    .attr('y1', (d) => this.yScale(d))
                    .attr('y2', (d) => this.yScale(d))
                    .attr('stroke', 'grey')
                    .attr('stroke-width', '1px');
            }

            if (this.grid === 'vertical') {
                this.svg.select('.grid-lines-group')
                    .selectAll('line.vertical-grid-line')
                    .data(scale.ticks(this.xTicks).slice(1))
                    .enter()
                    .append('line')
                    .attr('class', 'vertical-grid-line')
                    .attr('y1', 0)
                    .attr('y2', this.chartHeight)
                    .attr('x1', (d) => this.xScale(d))
                    .attr('x2', (d) => this.xScale(d))
                    .attr('stroke', 'grey')
                    .attr('stroke-width', '1px');;
            }

            if (this.isHorizontal) {
                this.drawVerticalExtendedLine();
            } else {
                this.drawHorizontalExtendedLine();
            }
        }
    };

    public drawStackedBar() {
        // Not ideal, we need to figure out how to call exit for nested elements
        if (this.svg) {
            if (this.layerElements) {
                this.svg.selectAll('.layer').remove();
            }

            const series = this.svg.select('.chart-group').selectAll('.layer')

            this.animationDelays = d3Array.range(
                this.animationDelayStep,
                (this.layers[0].length + 1) * this.animationDelayStep, this.animationDelayStep
            )

            if (this.isHorizontal) {
                this.drawHorizontalBars(series)
            } else {
                this.drawVerticalBars(series)
            }
            // Exit
            series
                // .exit()
                // .transition()
                .style('opacity', 0)
                .remove();
        }
    };

    private handleMouseOver(e, d) {
        console.log('e', e, 'd', d);
        this.dispatcher.call('customMouseOver', e, d, d3Selection.pointer(e));
    }

    public addMouseEvents() {
        const handleEventfunction = {
            mouseover: this.handleMouseOver.bind(this),
        }
        if (this.svg) {
            this.svg.selectAll('.bar')
                .on('mouseover', function (d) {
                    select(this)
                        .attr('opacity', '0.75')
                })
            this.svg.selectAll('.bar')
            .on('mouseout', function (d) {
                    select(this)
                        .attr('opacity', '1')
                })
        }
    }


    public build(_selection: Selection<BaseType, StackedBarData[], BaseType, unknown>) {
        const _buildSvg = this.buildSvg.bind(this);
        const _buildScales = this.buildScales.bind(this);
        const _buildLayers = this.buildLayers.bind(this);
        const _normalizedData = this.normalizedData.bind(this);
        const _prepareData = this.prepareData.bind(this);
        const _drawGridLines = this.drawGridLines.bind(this);
        const _buildAxis = this.buildAxis.bind(this);
        const _drawAxis = this.drawAxis.bind(this);
        const _drawStackedBar = this.drawStackedBar.bind(this);
        const _addMouseEnvent = this.addMouseEvents.bind(this);

        _selection.each(function (_data: StackedBarData[]) {
            _prepareData(_normalizedData(_data));
            _buildScales();
            _buildLayers();
            _buildSvg(this);
            _drawGridLines();
            _buildAxis();
            _drawAxis();
            _drawStackedBar();
            _addMouseEnvent()
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
        chart: (selection: D3Selection) => void
    ) {
        const container = select(element);
        validateContainer(container);

        // Calls the chart with the container and dataset
        if (data && data.length) {
            container.datum(data).call(chart);
        } else {
            container.call(chart);
        }

        return chart;
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

