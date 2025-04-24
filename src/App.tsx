import { Button } from 'antd';
import { D3BarGraph, D3StackedBarGraph, D3LineGraph } from './component';
import { defaultChartOptionPadding } from './component/graph/model';
import { D3reduceData } from './component/graph/util';
import { useState } from 'react';
import { barData, lineData } from './fake-data';

function App() {
  const normalizeBarData = D3reduceData(barData, {
    period: "period",
    type: "type",
    amount: "amount",
    color: "network_bgcolor",
  });

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
    <div style={{ width: '100vw', height: '100vh' }}>
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
      <div style={{ position: 'relative', width: '100%', height: '50%' }}>
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
      <div style={{ position: 'relative', width: '100%', height: '50%' }}>
        <D3LineGraph
          data={normalizeLineData}
          options={{
            height: customHeight,
            width: customWidth,
            padding: defaultChartOptionPadding
          }}
        />
      </div>
    </div>
  )
}

export default App

