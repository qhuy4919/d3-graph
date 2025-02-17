import { D3GraphBuilder } from "./component"
import { verticalStackedGraphBuilder } from "./component/d3-graph/stacked-graph";
import data from './component/data.json';
import styled from 'styled-components';

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

const StyleGraphContainer = styled.div`
  min-width: 800px;
  min-height: 300px;
  max-height: 400px;
  overflow: auto;
`;
function App() {
  return (
    <div style={{
      width: '100vw',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <StyleGraphContainer className='d3-graph-container'>
        <D3GraphBuilder<ChartData>
          data={data}
          containerSize={{
            width: 800,
            height: 600,
            margin: {
              top: 50,
              right: 60,
              bottom: 50,
              left: 60
            }
          }}
          spec={{
            builder: verticalStackedGraphBuilder,
            axis: {
              y: {
                axisLabel: 'Members'
              },
              x: {
                axisLabel: 'Number of Members'
              }
            }
          }}
        />

      </StyleGraphContainer>
    </div>
  )
}

export default App
