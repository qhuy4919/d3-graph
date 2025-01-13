import { Channels, MarkEncoding, MarkEncodings, MarkType, D3Mark } from "../../model";
import { SceneNodeSpec } from "../scene-node";

export class MarkSpec implements D3Mark {
    private _table?: string;
    private _channel?: Channels = {};
    private _encoding?: MarkEncodings;
    private _child?: SceneNodeSpec

    public constructor(public readonly type: MarkType) { }

    public get child() {
        return this._child
    }

    public set child(value: SceneNodeSpec | undefined) {
        this._child = value;
    }

    public get table() {
        return this._table
    };

    public set table(value: string | undefined) {
        this._table = value;
    }

    public get channel() {
        return this._channel
    };

    public set channel(value: Channels | undefined) {
        this._channel = value;
    }

    public get encoding() {
        return this._encoding
    };

    public set encoding(value: MarkEncodings | undefined) {
        this._encoding = value;
    };

    public applyEncoding<T>(key: string, encoding: MarkEncoding<T> | undefined) {
        if (!this._encoding) throw new Error('mark encoding must provided');
        if (encoding !== null && encoding !== undefined) {
            this._encoding[key] = encoding;
        }
        else {
            delete this._encoding[key];
        }
    }
}