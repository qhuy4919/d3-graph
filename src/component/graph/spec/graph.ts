import { GraphScene } from "../model"
import { D3AxisSpec } from "./axis"
import { D3ScaleSpec } from "./scale"

export class D3GraphScene implements GraphScene {
    private _scales: D3ScaleSpec[] = []
    private _axes: D3AxisSpec[] = []

    public get scales() {
        return this._scales
    }

    public getScale(name: string) {
        return this._scales.find(scale => scale.name === name);
    }

    public get axes() {
        return this._axes
    }

    public addAxis(value: D3AxisSpec) {
        this._axes.push(value)
    }

    public removeAxis(value: D3AxisSpec) {
        this._axes = this._axes.filter(m => m !== value)
    }

    public addScale(value: D3ScaleSpec) {
        this._scales.push(value)
    }
}