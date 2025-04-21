import { D3TooltipType } from "../model";
import { D3TooltipSpec } from "../spec";

/** 
 * @builder tooltip
*/
export class TooltipBuilder {
    public readonly spec: D3TooltipSpec;

    public constructor(
        type: D3TooltipType,
        labelSchema: Record<string, React.ReactNode>,
        valueSchema: Record<string, React.ReactNode>

    ) {
        this.spec = new D3TooltipSpec(
            type,
            labelSchema,
            valueSchema
        );
    }

    public build() {
        return this.spec;
    }

}