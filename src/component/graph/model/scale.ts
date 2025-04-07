import { ScaleBand, ScaleLinear, ScaleOrdinal, } from 'd3-scale';
export type D3Scale<In extends string | number, Out extends In> = {
    type: ScaleBand<Out> | ScaleOrdinal<In, Out> | ScaleLinear<In, In>
    range?: Out[],
    domain?: In[],

};

