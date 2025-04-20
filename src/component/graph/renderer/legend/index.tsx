import { useD3GraphSceneContext } from "../../context"
import { D3LegendSpec, D3ScaleSpec } from "../../spec"
import { mergeClass } from "../../util"
import { ScaleRenderer } from "../scale"
import { D3LegendLabel } from "./label"
import { LegendItem } from "./legend-item"
import { D3LegendShape } from "./shape"

export type LegendRenderer = {
    spec: D3LegendSpec<D3ScaleSpec>
}
export const LegendRenderer = ({
    spec
}: LegendRenderer) => {
    const {
        scale,
        colorScale: colorScaleSpec,
        className,
        style,
        shape,
        shapeProps,
        labelProps,
    } = spec;

    const colorScale = ScaleRenderer<'ordinal', string>(colorScaleSpec);
    const domain = 'domain' in scale ? scale.domain : []
    const labelList = [... new Set(domain)] as string[];
    const {
        shapeHeight,
        shapeWidth,
        shapeMargin,
    } = shapeProps ?? {};


    return <div
        className={mergeClass('d3-legend', className)}
        style={style}
    >
        {
            labelList.map((label, i) => (
                <LegendItem
                    key={`legend-item_${label}`}
                >
                    <D3LegendShape
                        shape={shape}
                        itemIndex={i}
                        height={shapeHeight}
                        width={shapeWidth}
                        style={{
                            margin: shapeMargin

                        }}
                        label={label}
                        fill={colorScale(label)}
                    />
                    <D3LegendLabel
                        label={label}
                        {...labelProps}
                    />
                </LegendItem>
            ))
        }
    </div>

}
export const D3Legend = () => {
    const { schema } = useD3GraphSceneContext();
    if (!schema) return <>No Legend Available</>
    const legendSpecList = schema.spec.legend;
    return legendSpecList.map((spec, i) => {
        //Cannot spread instance of class
        //therfore have to pass it into props
        return <LegendRenderer
            key={`d3-legend-${i}`}
            spec={spec}
        />
    })
}