import {
    Axis,
    AxisScale,
    axisBottom,
    axisLeft,
    axisRight,
    axisTop
} from 'd3-axis';
import {
    AxisOrientation,
    D3Selection,
    DEFAULT_AXIS_COLOR,
    DEFAULT_AXIS_STROKE,
    DEFAULT_AXIS_TICK_AMOUNT,
    DEFAULT_AXIS_TICK_OFFSET_VALUE,
    DEFAULT_AXIS_TICK_PADDING,
} from '../model';
/*
* Axis specification props
@category Builder  
*/
export class AxisBuilder<Domain extends string | number> {
    private _name: string = '';
    private _scale: AxisScale<Domain>;
    private _orient: AxisOrientation;
    private _selection: D3Selection<SVGGElement>;
    // Tick configuration fields
    private _ticks: number = DEFAULT_AXIS_TICK_AMOUNT
    private _tickColor: string = DEFAULT_AXIS_COLOR
    private _tickCount?: number
    private _tickOffset = DEFAULT_AXIS_TICK_OFFSET_VALUE
    private _tickWidth: number = DEFAULT_AXIS_STROKE
    private _tickPadding: number = DEFAULT_AXIS_TICK_PADDING


    public constructor(
        name: string,
        selection: D3Selection<SVGGElement>,
        scale: AxisScale<Domain>,
        orient: AxisOrientation) {
        if (!scale) throw new Error('scale must be provided');
        if (!orient) throw new Error('orient must be provided');
        this._name = name;
        this._selection = selection;
        this._scale = scale;
        this._orient = orient;
    }

    get scale(): AxisScale<Domain> {
        return this._scale;
    }

    set scale(value: AxisScale<Domain>) {
        this._scale = value;
    }

    get orient(): AxisOrientation {
        return this._orient;
    }

    set orient(value: AxisOrientation) {
        if (!value) throw new Error('orient must be provided');
        this._orient = value;
    }

    get tickColor(): string {
        return this._tickColor;
    }

    set tickColor(value: string) {
        this._tickColor = value;
    }

    get tickCount(): number | undefined {
        return this._tickCount;
    }

    set tickCount(value: number | undefined) {
        this._tickCount = value;
    }

    get tickPadding(): number {
        return this._tickPadding;
    }

    set tickPadding(value: number) {
        this._tickPadding = value;
    }

    get tickOffset(): number {
        return this._tickOffset;
    }

    set tickOffset(value: number) {
        this._tickOffset = value;
    }

    get tickWidth(): number {
        return this._tickWidth;
    }

    set tickWidth(value: number) {
        this._tickWidth = value;
    }

    private getAxisOrientation()
        : (scale: AxisScale<Domain>) => Axis<Domain> {
        switch (this._orient) {
            case 'bottom':
                return axisBottom;
            case 'top':
                return axisTop;
            case 'left':
                return axisLeft;
            case 'right':
                return axisRight
            default:
                throw new Error('Invalid axis orientation')
        }
    }


    public build() {
        const name = this._name;
        const axis = this.getAxisOrientation()(this._scale)
            .tickArguments([this._ticks])
            .tickPadding(this._tickPadding);

        //draw all spec into screen
        this._selection.select<SVGGElement>(`.${name}-axis-group .axis.${name}`)
            .call((d) => axis(d))

    }



}

