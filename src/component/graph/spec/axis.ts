import { AxisSpec, D3TickFormat } from "../model";
import {
    AxisOrientation,
    DEFAULT_AXIS_COLOR,
    DEFAULT_AXIS_STROKE,
    DEFAULT_AXIS_TICK_AMOUNT,
    DEFAULT_AXIS_TICK_OFFSET_VALUE,
    DEFAULT_AXIS_TICK_PADDING,
} from '../model';

export class D3AxisSpec implements AxisSpec {
    private _className: string = ''
    private _scale: string;
    private _orient: AxisOrientation;
    // Tick configuration fields
    private _ticks: number = DEFAULT_AXIS_TICK_AMOUNT
    private _tickColor: string = DEFAULT_AXIS_COLOR
    private _tickCount?: number
    private _tickOffset = DEFAULT_AXIS_TICK_OFFSET_VALUE
    private _tickWidth: number = DEFAULT_AXIS_STROKE
    private _tickPadding: number = DEFAULT_AXIS_TICK_PADDING
    private _tickFormat?: D3TickFormat = undefined
    private _transform?: string
    // Label configuration 
    private _labelFontSize: React.CSSProperties['fontSize']
    private _labelStyle?: React.CSSProperties
    //Title configuration
    private _title: string = ''
    private _titleStyle?: React.CSSProperties = undefined

    public constructor(
        scale: string,
        orient: AxisOrientation) {
        if (!scale) throw new Error('scale must be provided');
        if (!orient) throw new Error('orient must be provided');
        this._scale = scale;
        this._orient = orient;
    }

    get className(): string {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }

    get scale(): string {
        return this._scale;
    }

    set scale(value: string) {
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

    get ticks(): number {
        return this._ticks;
    }

    set ticks(value: number) {
        this._ticks = value;
    }

    get tickFormat(): D3TickFormat | undefined {
        return this._tickFormat
    }

    set tickFormat(formatFunc: D3TickFormat) {
        this._tickFormat = formatFunc;
    }

    get transform(): string | undefined {
        return this._transform;
    }

    set transform(value: string) {
        this._transform = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get titleStyle(): React.CSSProperties | undefined {
        return this._titleStyle;
    }

    set titleStyle(style: React.CSSProperties) {
        this._titleStyle = {
            ...this._titleStyle,
            ...style
        }
    }

    get labelFontSize() {
        return this._labelFontSize;
    }

    set labelFontSize(value: React.CSSProperties['fontSize']) {
        this._labelFontSize = value;
    }

    get labelStyle(): React.CSSProperties | undefined {
        return this._labelStyle;
    }

    set labelStyle(style: React.CSSProperties) {
        this._labelStyle = {
            ...this._labelStyle,
            ...style
        }
    }

}