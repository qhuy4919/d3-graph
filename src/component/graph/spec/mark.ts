import { D3MarkType, Facet, MarkEncoding, MarkEncodings, MarkSpec } from "../model";
import { GraphSceneSpec } from "./graph";

export class D3MarkSpec implements MarkSpec {
    private _table: string | undefined
    private _encodings: MarkEncodings = {}
    private _name?: string
    private _child?: GraphSceneSpec
    private _facet?: Facet;

    public constructor(public readonly type: D3MarkType) { }

    public get child() {
        return this._child
    }

    public set child(value: GraphSceneSpec | undefined) {
        this._child = value
    }

    public get table(): string | undefined {
        return this._table
    }

    public set table(value: string | undefined) {
        this._table = value
    }

    public get name(): string | undefined {
        return this._name
    }

    public set name(value: string | undefined) {
        this._name = value
    }

    public get facet(): Facet | undefined {
        return this._facet
    }

    public set facet(value: Facet | undefined) {
        this._facet = value
    }

    public get encodings(): MarkEncodings {
        return this._encodings
    }

    public applyEncoding<T>(key: string, encoding: undefined | MarkEncoding<T>) {
        if (encoding != null) {
            this._encodings[key] = encoding
        } else {
            delete this._encodings[key]
        }
    }
}