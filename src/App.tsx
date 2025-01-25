import { GraphBuilder } from "./component/brite-chart-pattern/builder"
import data from './component/brite-chart-pattern/data.json'
function App() {


  return (
    <>
      <GraphBuilder data={data} containerSize={{
        width: 1000,
        height: 600,
      }} />
    </>
  )
}

export default App
