import { AxisOrientation, D3Axis } from '../../model';
export class AxisSpec implements D3Axis {
    private _scale: string
    private _orient: AxisOrientation



    public constructor(scale: string, orient: AxisOrientation) {
        this._scale = scale;
        this._orient = orient;
    };

    public get scale(): string {
        return this._scale;
    }

    public set scale(value: string) {
        this._scale = value;
    }

    public get orient(): AxisOrientation {
        return this._orient;
    };

    public set orient(value: AxisOrientation) {
        this._orient = value;
    }
}