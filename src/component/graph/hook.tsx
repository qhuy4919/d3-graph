import { useEffect, useState } from "react";
import { D3reduceData } from "./util";
import { D3Datum } from "./model";

export function useD3GraphData<Data extends Record<string, unknown>>(input: Data[]) {
    const [data, setData] = useState<D3Datum[]>([]);

    useEffect(() => {
        if (Array.isArray(input) && input.length > 0) {
            const normalizedData = D3reduceData(data, {
                period: "period",
                type: "type",
                amount: "amount",
                color: "color",
            });
            setData(normalizedData);
        }

    }, [input])

    return [data, setData];
}