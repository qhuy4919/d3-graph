import { createContext, useContext } from "react";
import { D3GraphSceneBuilder } from "./builder";

export const D3GraphSceneContext = createContext<{
    builder: D3GraphSceneBuilder | undefined,

}>({
    builder: undefined
});

export const useD3GraphSceneContext = () => useContext(D3GraphSceneContext);