import { D3AxisSpec } from "../spec";

export interface GraphScene {
    scales?: unknown[]
    axes: D3AxisSpec[]
}