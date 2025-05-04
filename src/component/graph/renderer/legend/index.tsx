import { forwardRef } from "react"
import { GraphOptionsManager } from "../../builder"
import { useD3GraphSceneContext } from "../../context"
import { D3LegendSpec, D3ScaleSpec } from "../../spec"
import { mergeClass } from "../../util"
import { ScaleRenderer } from "../scale"
import { D3LegendLabel } from "./label"
import { LegendItem } from "./legend-item"
import { D3LegendShape } from "./shape";
import styled from 'styled-components';

export type LegendRenderer = {
    spec: D3LegendSpec<D3ScaleSpec>
}
export const StyledLegendSectionLabel = styled.span`
    font-weight: bold;
`;

export const LegendRenderer = ({
    spec
}: LegendRenderer) => {
    const {
        scale,
        colorScale: colorScaleSpec,
        className,
        style,
        shape,
        label = 'Legend',
        shapeProps,
        labelProps,
    } = spec;

    const { options } = useD3GraphSceneContext();
    const { paddingLeft } = new GraphOptionsManager(options);
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
        style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: '12px',
            alignItems: 'center',
            gap: '8px',
            marginLeft: paddingLeft,
            color: '#303030',
            ...style,
        }}
    >
        <StyledLegendSectionLabel style={style}>{label}:</StyledLegendSectionLabel>
        {
            labelList.map((label, i) => {
                return (
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
                )
            })
        }
    </div>

}
export type D3Legend = {
    innterRef?: React.Ref<HTMLDivElement>;
}
export const D3Legend = ({
    innterRef
}: D3Legend) => {
    const { schema } = useD3GraphSceneContext();
    if (!schema) return <>No Legend Available</>
    const legendSpecList = schema.spec.legend;
    return <div ref={innterRef} className='d3-legend-list'>
        {
            legendSpecList.map((spec, i) => {
                //Cannot spread instance of class
                //therfore have to pass it into props
                return <LegendRenderer
                    key={`d3-legend-${i}`}
                    spec={spec}
                />
            })
        }
    </div>
}