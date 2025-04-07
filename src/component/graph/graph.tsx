import { memo } from "react";
import { D3GraphProps } from "./model";

export const D3Graph = memo(<Data extends Record<string, unknown>>({
    width,
    height,
    data,
    padding = { top: 0, right: 0, bottom: 0, left: 0 },
}: D3GraphProps<Data>) => {
    return <>
        345345
    </>
})