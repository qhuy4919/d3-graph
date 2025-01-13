export type Scale<In, Out> = {
    (input?: In): Out,
    range?: () => Out,
    domain?: () => In[],

    __scale_type__?: string,
};

export type Scales = {
    [x: string]: Scale<any, any>
}

export type ScaleCreationContext = {
    view: {
        width: number,
        height: number
    },

    viewBouns: {
        x: [number, number],
        y: [number, number]
    },

    scales: Scales
};

export type ScaleCreator = (input: ScaleCreationContext) => Scales