import { createContext, useContext } from "react";
import { D3GraphSceneBuilder } from "./builder";
import { ChartOptions, getDefaultChartOptions } from "./model";

export const D3GraphSceneContext = createContext<{
    schema?: D3GraphSceneBuilder,
    options: ChartOptions

}>({
    schema: undefined,
    options: getDefaultChartOptions(),
});

export const useD3GraphSceneContext = () => useContext(D3GraphSceneContext);