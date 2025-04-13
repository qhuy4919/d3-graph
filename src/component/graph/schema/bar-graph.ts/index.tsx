import { D3GraphSceneBuilder } from "../../builder"
import { AxisBuilder } from "../../builder/axis"
import { ScaleBuilder } from "../../builder/scale"
import { D3Graph } from '../../graph';

export const BarChartBuilder = () => {
    const chart = new D3GraphSceneBuilder()
    chart.axes(
        new AxisBuilder('amountScale', 'bottom'),
        new AxisBuilder('periodScale', 'left')
    )
        .scale(
            new ScaleBuilder('amountScale', 'linear')
                .domain([0, 100])
                .range([0, 100]),
            new ScaleBuilder('periodScale', 'band')
                .domain(['Jan', 'Feb', 'Mar', 'Apr'])
                .range([0, 100])
        ).build();

    return chart;
}

export const D3BarChart = () => {
    const chart = BarChartBuilder()
    return <D3Graph
        data={[]}
        builder={chart}
        height={500}
        width={1500}
        padding={{ top: 20, right: 20, bottom: 20, left: 20 }}
    />
}