import {
    GridSpec,
    D3GridOrientation,
    DEFAULT_GRID_DASHARRAY,
    DEFAULT_GRID_STROKE,
    DEFAULT_GRID_STROKE_WIDTH
} from "../model";

export class D3GridSpec implements GridSpec {
    private _scale: string;
    private _orient: D3GridOrientation
    private _className?: string;
    private _stroke: string = DEFAULT_GRID_STROKE;
    private _strokeWidth: string | number = DEFAULT_GRID_STROKE_WIDTH;
    private _strokeDasharray: string = DEFAULT_GRID_DASHARRAY;
    private _offset?: number;
    private _opacity: number = 0.3;

    public constructor(
        scale: string,
        orient: D3GridOrientation
    ) {
        if (!scale) throw new Error('scale must be provided');
        this._scale = scale;
        this._orient = orient
    }

    get scale(): string {
        return this._scale;
    }

    set scale(value: string) {
        this._scale = value;
    }

    get orient(): D3GridOrientation {
        return this._orient;
    }

    set orient(value: D3GridOrientation) {
        this._orient = value;
    }

    get className(): string | undefined {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }
    get stroke(): string {
        return this._stroke;
    }

    set stroke(value: string) {
        this._stroke = value;
    }
    get strokeWidth(): string | number {
        return this._strokeWidth;
    }

    set strokeWidth(value: string | number) {
        this._strokeWidth = value;
    }
    get strokeDasharray(): string {
        return this._strokeDasharray;
    }

    set strokeDasharray(value: string) {
        this._strokeDasharray = value;
    }

    get offset(): number | undefined {
        return this._offset;
    }

    set offset(value: number) {
        this._offset = value;
    }

    get opacity(): number {
        return this._opacity;
    }

    set opacity(value: number) {
        this._opacity = value;
    }


}

