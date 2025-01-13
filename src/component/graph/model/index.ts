/**  
* This type descripe a rendering phase
* @param SourceForm the type of incoming data
* @param TargetForm the type of output
 */
export type Renderer<SourceForm, TargetForm> = {
    render: (input: SourceForm, handler: unknown) => TargetForm
}

export {
    type VSvgNode,
    type ChartOptions,
} from './base'


export * from './scale'
export * from './axis';