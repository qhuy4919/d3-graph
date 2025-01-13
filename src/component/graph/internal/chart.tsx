import { useContext, useMemo } from 'react';
import { ChartOptions } from '../model';
import { ChartRendererContext } from '../context';

export type D3Chart = {
    width: number,
    height: number
    padding?: number,
    data: { [key: string]: any },
    title?: string,
    description?: string
}
export const D3Chart = (props: D3Chart) => {
    const {
        width,
        height,
        padding,
        title,
        description,
    } = props;

    const ChartOptions = useChartOption({
        width,
        height,
        padding,
        title,
        description
    })
};


function useChartOption({
    height,
    width,
    padding
}: Omit<D3Chart, 'data'>): ChartOptions {
    return useMemo(() => {
        const opts: ChartOptions = { width, height };
        if (padding) {
            opts.padding = padding;
        }

        return opts
    }, [width, height, padding])
};


function useScene(ChartOptions: ChartOptions, data: Record<string, any>): any {

};

function useOrchestrator() {
    const renderer = useContext(ChartRendererContext);
    return useMemo(() => renderer && new Ỏ)
}