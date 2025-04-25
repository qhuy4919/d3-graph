import { Button } from 'antd';
import { D3BarGraph, D3StackedBarGraph, D3LineGraph, D3HorizontalBarGraph } from './component';
import { defaultChartOptionPadding } from './component/graph/model';
import { D3reduceData } from './component/graph/util';
import { useState } from 'react';
import { barData, lineData, horizontalBarData } from './fake-data';
import styled from 'styled-components';

export const StyledD3Container = styled.div`
  display: flex;
  flex-direction: column;
 
`;
function App() {
  const normalizeBarData = D3reduceData(barData, {
    period: "period",
    type: "type",
    amount: "amount",
    color: "network_bgcolor",
  });

  const normalizeHorizontalBarData = D3reduceData(horizontalBarData, {
    period: "sku",
    type: "sku",
    amount: "amount",
    color: "color",
  })

  const normalizeLineData = D3reduceData(lineData, {
    period: "record_date",
    type: "type",
    amount: "pulse_pressure",
    color: "color",
  });

  const [customWidth, setCustomWidth] = useState(1000);
  const [customHeight, setCustomHeight] = useState(400);
  const [type, setType] = useState('stacked');

  return (
    <div style={{ width: '100%' }}>
      <Button
        onClick={() => {
          setCustomWidth(prev => prev + 100);
          setCustomHeight(prev => prev + 50)
        }}
      >
        Zoom in
      </Button>
      <Button
        onClick={() => {
          setCustomWidth(prev => prev - 100);
          setCustomHeight(prev => prev - 50)
        }}
      >
        Zoom out
      </Button>
      <Button
        onClick={() => setType('group')}
      >
        Switch to Group
      </Button>
      <Button
        onClick={() => setType('stacked')}
      >
        Switch to Stacked
      </Button>
      <StyledD3Container className='d3-container'>
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
          {
            type === 'group'
              ? <D3BarGraph
                data={normalizeBarData}
                options={{
                  height: customHeight,
                  width: customWidth,
                  padding: defaultChartOptionPadding
                }
                }
              />
              : <D3StackedBarGraph
                data={normalizeBarData}
                options={{
                  height: customHeight,
                  width: customWidth,
                  padding: defaultChartOptionPadding
                }}
              />
          }
        </div>
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
          <D3LineGraph
            data={normalizeLineData}
            options={{
              height: customHeight,
              width: customWidth,
              padding: defaultChartOptionPadding
            }}
          />
        </div>
        <div style={{ position: 'relative', width: '100%', height: '700px' }}>
          <D3HorizontalBarGraph
            data={normalizeHorizontalBarData}
            options={{
              height: 1000,
              width: 1200,
              padding: {
                ...defaultChartOptionPadding,
                left: 150
              }
            }}
          />
        </div>
      </StyledD3Container>
    </div>
  )
}

export default App

