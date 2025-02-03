import { D3GraphBuilder } from "./component/brite-chart-pattern/builder"
import data from './component/brite-chart-pattern/data.json'
import { D3DataSchema } from "./component/brite-chart-pattern/model"

type ChartData = {
  amount: number,
  period: string,
  type: string,
  bgcolor: string,
  min_range: string,
  max_range: string,
  insurer_id: string,
  identifier: string
}
function App() {
  return (
    <>
      <D3GraphBuilder<ChartData>
        chartKey='experience-stacked-chart'
        data={data}
        containerSize={{
          width: 1000,
          height: 600,
        }}
        spec={{
          shape: 'stack',
        }}
      />
      <D3GraphBuilder
        chartKey='experience-group-chart'
        data={data}
        containerSize={{
          width: 1000,
          height: 600,
        }}
        spec={{
          shape: 'group',
        }} />
      <D3GraphBuilder
        chartKey='experience-pie-chart'
        data={data}
        containerSize={{
          width: 1000,
          height: 600,
        }}
        spec={{
          shape: 'pie',
        }}
      />
    </>
  )
}

export default App
