import { D3AxisSpec, D3GridSpec, D3ScaleSpec } from "../spec";

export interface GraphScene {
    scales?: D3ScaleSpec[]
    axes?: D3AxisSpec[]
    grid?: D3GridSpec[]
}