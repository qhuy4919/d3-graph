import { D3Axis } from "./axis";
import { ChartOptions, Datum, Table } from "./base";
import { D3Mark } from "./mark";
import { ScaleCreator } from "./scale";

export type Metadata = {
    id: string,
    index?: string,
    [key: string]: unknown
};

export interface DataFrame {
    [key: string]: Table | Datum
}

export type ChannelHandler<T> = (eventArg: Metadata & { event: T }) => void

export type Channels = {
    [key: string]: ChannelHandler<any>
};

export type Facet = {
    name: string
    table?: string,
    groupBy?: string | string | ((row: any) => any);
    transform?: (data: any[]) => any[]
}

export type SceneNode = {
    scales: ScaleCreator[],

    marks: D3Mark[],

    axes: D3Axis[]
};

export type SceneGraphConverter<IntermediateForm> = {
    render(sceneGraph: any, options: ChartOptions): IntermediateForm
}