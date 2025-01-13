import { ScaleCreator, SceneNode } from "../model";
import { AxisSpec, MarkSpec } from "./spec";

export class SceneNodeSpec implements SceneNode {
    private _scales: ScaleCreator[] = [];
    private _marks: MarkSpec[] = [];
    private _axis: AxisSpec[] = [];

    public get scales() {
        return this._scales;
    }

    public get marks() {
        return this._marks;
    }

    public get axes() {
        return this._axis;
    };

    public addScale(value: ScaleCreator) {
        this._scales.push(value);
    };

    public addAxis(value: AxisSpec) {
        this._axis.push(value);
    }

}