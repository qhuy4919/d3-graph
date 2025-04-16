import {
    D3BaseScale,
    D3ScaleDomain,
    D3ScaleRange,
    D3ScaleRangeRound,
    D3ScaleType
} from "../model";
/** 
 * @Category Scale Specification
 * */



export class D3ScaleSpec implements D3BaseScale {
    private _name: string = '';
    private _type: D3ScaleType;
    private _domain: D3ScaleDomain;
    private _range: D3ScaleRange;
    private _rangeRound: D3ScaleRangeRound;
    private _padding: number = 0;
    private _nice: number = 0;
    private _ticks: number = 0;


    public constructor(
        name: string,
        type: D3ScaleType,
    ) {
        this._name = name;
        this._type = type;
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }
    get type(): D3ScaleType {
        return this._type;
    }
    set type(value: D3ScaleType) {
        this._type = value;
    }
    get domain(): D3ScaleDomain {
        return this._domain;
    }
    set domain(value: D3ScaleDomain) {
        this._domain = value;
    }
    get range(): D3ScaleRange {
        return this._range;
    }
    set range(value: D3ScaleRange) {
        this._range = value;
    }
    get rangeRound(): D3ScaleRangeRound {
        return this._rangeRound;
    }
    set rangeRound(value: D3ScaleRangeRound) {
        this._rangeRound = value;
    }
    get padding(): number {
        return this._padding;
    }
    set padding(value: number) {
        this._padding = value;
    }
    get nice(): number {
        return this._nice;
    }
    set nice(value: number) {
        this._nice = value;
    }

    get ticks() {
        return this._ticks;
    }

    set ticks(value: number) {
        this._ticks = value;
    }
}
