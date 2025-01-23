import { BarChart } from "./component/brite-chart-pattern"
import { GraphBuilder } from "./component/brite-chart-pattern/builder"
import data from './component/brite-chart-pattern/data.json'
function App() {


  return (
    <>
      <BarChart chartName='test-bar-chart' />
      <GraphBuilder data={data} containerSize={{
        width: 800,
        height: 600,
      }} />
    </>
  )
}

export default App
