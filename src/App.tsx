import { GraphBuilder } from "./component/brite-chart-pattern/builder"
import data from './component/brite-chart-pattern/data.json'
function App() {


  return (
    <>
      <GraphBuilder
        chartKey='experience-stacked-chart'
        data={data}
        containerSize={{
          width: 1000,
          height: 600,
        }}
        shape='stack'
      />
      <GraphBuilder
        chartKey='experience-pie-chart'
        data={data}
        containerSize={{
          width: 1000,
          height: 600,
        }}
        shape='pie'
      />
    </>
  )
}

export default App
