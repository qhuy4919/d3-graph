import { D3TooltipType, Datum, TooltipSpec } from "../model"

export class D3TooltipSpec implements TooltipSpec {
    private _type: D3TooltipType
    private _labelSchema: Record<string, React.ReactNode>
    private _valueSchema: Record<string, (value: Datum) => React.ReactNode>


    public constructor(
        type: D3TooltipType,
        labelSchema: Record<string, React.ReactNode>,
        valueSchema: Record<string, (value: Datum) => React.ReactNode>

    ) {
        this._type = type;
        this._labelSchema = labelSchema
        this._valueSchema = valueSchema
    }

    get type() {
        return this._type
    }

    set type(value: D3TooltipType) {
        this._type = value
    }

    get labelSchema() {
        return this._labelSchema
    }

    set labelSchema(value: Record<string, React.ReactNode>) {
        this._labelSchema = {
            ...this._labelSchema,
            ...value,
        }
    }

    get valueSchema() {
        return this._valueSchema
    }

    set valueSchema(value: Record<string, (value: Datum) => React.ReactNode>) {
        this._valueSchema = {
            ...this._valueSchema,
            ...value,
        }
    }
}