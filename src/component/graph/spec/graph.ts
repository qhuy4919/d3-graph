import { D3GridOrientation, GraphScene } from "../model"
import { D3AxisSpec } from "./axis"
import { D3GridSpec } from "./grid"
import { D3MarkSpec } from "./mark"
import { D3ScaleSpec } from "./scale"

export class GraphSceneSpec implements GraphScene {
    private _scales: D3ScaleSpec[] = []
    private _axes: D3AxisSpec[] = [];
    private _grid: D3GridSpec[] = [];
    private _marks: D3MarkSpec[] = [];

    public get scales() {
        return this._scales
    }

    public get axes() {
        return this._axes
    }

    public get grid() {
        return this._grid;
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

    public removeScale(value: D3ScaleSpec) {
        this._scales = this._scales.filter(m => m !== value)
    }

    public addGrid(value: D3GridSpec) {
        this._grid.push(value)
    }

    public removeGrid(value: D3GridSpec) {
        this._grid = this._grid.filter(m => m !== value)
    }

    public addMark(value: D3MarkSpec) {
        this._marks.push(value)
    }

    public removeMark(value: D3MarkSpec) {
        this._marks = this._marks.filter(m => m !== value)
    }

    public getScale(name: string) {
        return this._scales.find(scale => scale.name === name);
    }

    public getGrid(orient: D3GridOrientation) {
        return this._grid.find(grid => grid.orient === orient);
    }

}