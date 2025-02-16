import { Dispatch } from 'd3';
import { D3Selection } from "./selection";

export type MouseEventCallBack<Data> = (
    e: any,
    d?: Data,
    customProps?: {
        customTooltip?: (d?: Data) => string
    }
) => void;

export type D3EventListeners<Data> = {
    onMouseOver?: MouseEventCallBack<Data>,
    onMouseOut?: MouseEventCallBack<Data>,
    onMouseMove?: MouseEventCallBack<Data>
    onClick?: MouseEventCallBack<Data>,
}

export type D3MouseEvent<Data> = {
    selection: D3Selection<SVGGElement>,
    selectionElement: string
    dispatcher: D3Dispatcher
} & D3EventListeners<Data>;

export type D3Dispatcher = Dispatch<object>;
