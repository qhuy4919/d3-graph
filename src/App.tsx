import { Button } from 'antd';
import { D3BarChart } from './component';
import { defaultChartOptionPadding } from './component/graph/model';
import { D3reduceData } from './component/graph/util';
import { useState } from 'react';


function App() {
  const normalizeData = D3reduceData(data, {
    period: "period",
    type: "type",
    amount: "amount",
    color: "network_bgcolor",
  });

  const [customWidth, setCustomWidth] = useState(1000);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Button
        onClick={() => { setCustomWidth(prev => prev + 100) }}
      >Set Width</Button>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <D3BarChart
          data={normalizeData}
          options={{
            height: 500,
            width: customWidth,
            padding: defaultChartOptionPadding
          }
          }
        />
      </div>
    </div>
  )
}

export default App

const data = [
  {
    "period": "Anthem MA",
    "type": "(All Networks)",
    "network_bgcolor": "#5CA83C",
    "insurer_identifier": "541739330",
    "insurer_id": "d1473906-d137-085e-9010-4f6d36df0912",
    "insurer_bgcolor": "#DBA39A",
    "network_identifier": "ANN",
    "amount": 100
  },
  {
    "period": "Anthem MA",
    "type": "TECQ Foundation",
    "network_bgcolor": "#94248C",
    "insurer_identifier": "541739330",
    "insurer_id": "d1473906-d137-085e-9010-4f6d36df0912",
    "insurer_bgcolor": "#DBA39A",
    "network_identifier": "TF",
    "amount": 1
  },
  {
    "period": "Anthem MA",
    "type": "Van Lang IPA",
    "network_bgcolor": "#4C94FC",
    "insurer_identifier": "541739330",
    "insurer_id": "d1473906-d137-085e-9010-4f6d36df0912",
    "insurer_bgcolor": "#DBA39A",
    "network_identifier": "VL",
    "amount": 2
  },
  {
    "period": "SCAN MA",
    "type": "TEACO Provider Network",
    "network_bgcolor": "#EC8C1C",
    "insurer_identifier": "953858259",
    "insurer_id": "a3ed5854-689b-11ee-8c99-0242ac120002",
    "insurer_bgcolor": "#018881",
    "network_identifier": "TPN",
    "amount": 1
  },
  {
    "period": "SCAN MA",
    "type": "Van Lang IPA",
    "network_bgcolor": "#4C94FC",
    "insurer_identifier": "953858259",
    "insurer_id": "a3ed5854-689b-11ee-8c99-0242ac120002",
    "insurer_bgcolor": "#018881",
    "network_identifier": "VL",
    "amount": 10
  },
  {
    "period": "SCAN MA",
    "type": "(All Networks)",
    "network_bgcolor": "#5CA83C",
    "insurer_identifier": "953858259",
    "insurer_id": "a3ed5854-689b-11ee-8c99-0242ac120002",
    "insurer_bgcolor": "#018881",
    "network_identifier": "ANN",
    "amount": 56
  },
  {
    "period": "SCAN MA",
    "type": "TECQ Foundation",
    "network_bgcolor": "#94248C",
    "insurer_identifier": "953858259",
    "insurer_id": "a3ed5854-689b-11ee-8c99-0242ac120002",
    "insurer_bgcolor": "#018881",
    "network_identifier": "TF",
    "amount": 2
  },
  {
    "period": "SCAN MA",
    "type": "TEACO Health",
    "network_bgcolor": "#5CC4C4",
    "insurer_identifier": "953858259",
    "insurer_id": "a3ed5854-689b-11ee-8c99-0242ac120002",
    "insurer_bgcolor": "#018881",
    "network_identifier": "TH",
    "amount": 1
  },
  {
    "period": "Kelsey-Care MA",
    "type": "TEACO Health",
    "network_bgcolor": "#5CC4C4",
    "insurer_identifier": "541739327",
    "insurer_id": "f3b2a616-91b2-7fbd-5576-542bb05c5a61",
    "insurer_bgcolor": "#F4CCCC",
    "network_identifier": "TH",
    "amount": 112
  },
  {
    "period": "Kelsey-Care MA",
    "type": "Van Lang IPA",
    "network_bgcolor": "#4C94FC",
    "insurer_identifier": "541739327",
    "insurer_id": "f3b2a616-91b2-7fbd-5576-542bb05c5a61",
    "insurer_bgcolor": "#F4CCCC",
    "network_identifier": "VL",
    "amount": 33
  },
  {
    "period": "Kelsey-Care MA",
    "type": "(All Networks)",
    "network_bgcolor": "#5CA83C",
    "insurer_identifier": "541739327",
    "insurer_id": "f3b2a616-91b2-7fbd-5576-542bb05c5a61",
    "insurer_bgcolor": "#F4CCCC",
    "network_identifier": "ANN",
    "amount": 277
  },
  {
    "period": "Kelsey-Care MA",
    "type": "TEACO Provider Network",
    "network_bgcolor": "#EC8C1C",
    "insurer_identifier": "541739327",
    "insurer_id": "f3b2a616-91b2-7fbd-5576-542bb05c5a61",
    "insurer_bgcolor": "#F4CCCC",
    "network_identifier": "TPN",
    "amount": 644
  },
  {
    "period": "Wellcare MA",
    "type": "Van Lang IPA",
    "network_bgcolor": "#4C94FC",
    "insurer_identifier": "541739325",
    "insurer_id": "39d20e4c-7a11-0a14-4d9f-e73df23f5ca0",
    "insurer_bgcolor": "#5CC4C4",
    "network_identifier": "VL",
    "amount": 1
  },
  {
    "period": "Wellcare MA",
    "type": "TEACO Health",
    "network_bgcolor": "#5CC4C4",
    "insurer_identifier": "541739325",
    "insurer_id": "39d20e4c-7a11-0a14-4d9f-e73df23f5ca0",
    "insurer_bgcolor": "#5CC4C4",
    "network_identifier": "TH",
    "amount": 72
  },
  {
    "period": "Wellcare MA",
    "type": "TECQ Foundation",
    "network_bgcolor": "#94248C",
    "insurer_identifier": "541739325",
    "insurer_id": "39d20e4c-7a11-0a14-4d9f-e73df23f5ca0",
    "insurer_bgcolor": "#5CC4C4",
    "network_identifier": "TF",
    "amount": 1
  },
  {
    "period": "Wellcare MA",
    "type": "TEACO Provider Network",
    "network_bgcolor": "#EC8C1C",
    "insurer_identifier": "541739325",
    "insurer_id": "39d20e4c-7a11-0a14-4d9f-e73df23f5ca0",
    "insurer_bgcolor": "#5CC4C4",
    "network_identifier": "TPN",
    "amount": 9
  },
  {
    "period": "Devoted Health MA",
    "type": "(All Networks)",
    "network_bgcolor": "#5CA83C",
    "insurer_identifier": "824278774",
    "insurer_id": "a68c9512-72d4-53d9-ae80-0765842e3ca7",
    "insurer_bgcolor": "#A0C382",
    "network_identifier": "ANN",
    "amount": 1
  },
  {
    "period": "Humana MA",
    "type": "TEACO Health",
    "network_bgcolor": "#5CC4C4",
    "insurer_identifier": "391263473",
    "insurer_id": "c826edbc-aae0-c9d5-9037-d1977dde7e3e",
    "insurer_bgcolor": "#EC8C1C",
    "network_identifier": "TH",
    "amount": 2
  },
  {
    "period": "Humana MA",
    "type": "TEACO Provider Network",
    "network_bgcolor": "#EC8C1C",
    "insurer_identifier": "391263473",
    "insurer_id": "c826edbc-aae0-c9d5-9037-d1977dde7e3e",
    "insurer_bgcolor": "#EC8C1C",
    "network_identifier": "TPN",
    "amount": 1
  },
  {
    "period": "Humana MA",
    "type": "Van Lang IPA",
    "network_bgcolor": "#4C94FC",
    "insurer_identifier": "391263473",
    "insurer_id": "c826edbc-aae0-c9d5-9037-d1977dde7e3e",
    "insurer_bgcolor": "#EC8C1C",
    "network_identifier": "VL",
    "amount": 84
  },
  {
    "period": "Humana MA",
    "type": "(All Networks)",
    "network_bgcolor": "#5CA83C",
    "insurer_identifier": "391263473",
    "insurer_id": "c826edbc-aae0-c9d5-9037-d1977dde7e3e",
    "insurer_bgcolor": "#EC8C1C",
    "network_identifier": "ANN",
    "amount": 207
  },
  {
    "period": "Humana MA",
    "type": "TECQ Foundation",
    "network_bgcolor": "#94248C",
    "insurer_identifier": "391263473",
    "insurer_id": "c826edbc-aae0-c9d5-9037-d1977dde7e3e",
    "insurer_bgcolor": "#EC8C1C",
    "network_identifier": "TF",
    "amount": 1
  },
  {
    "period": "Molina MA",
    "type": "Van Lang IPA",
    "network_bgcolor": "#4C94FC",
    "insurer_identifier": "541739328",
    "insurer_id": "1fb7dbb6-9658-1eb9-4cf4-afce26a4649f",
    "insurer_bgcolor": "#5CA83C",
    "network_identifier": "VL",
    "amount": 28
  },
  {
    "period": "Molina MA",
    "type": "(All Networks)",
    "network_bgcolor": "#5CA83C",
    "insurer_identifier": "541739328",
    "insurer_id": "1fb7dbb6-9658-1eb9-4cf4-afce26a4649f",
    "insurer_bgcolor": "#5CA83C",
    "network_identifier": "ANN",
    "amount": 777
  },
  {
    "period": "Molina MA",
    "type": "TEACO Health",
    "network_bgcolor": "#5CC4C4",
    "insurer_identifier": "541739328",
    "insurer_id": "1fb7dbb6-9658-1eb9-4cf4-afce26a4649f",
    "insurer_bgcolor": "#5CA83C",
    "network_identifier": "TH",
    "amount": 33
  },
  {
    "period": "Molina MA",
    "type": "TECQ Foundation",
    "network_bgcolor": "#94248C",
    "insurer_identifier": "541739328",
    "insurer_id": "1fb7dbb6-9658-1eb9-4cf4-afce26a4649f",
    "insurer_bgcolor": "#5CA83C",
    "network_identifier": "TF",
    "amount": 2
  },
  {
    "period": "Molina MA",
    "type": "TEACO Provider Network",
    "network_bgcolor": "#EC8C1C",
    "insurer_identifier": "541739328",
    "insurer_id": "1fb7dbb6-9658-1eb9-4cf4-afce26a4649f",
    "insurer_bgcolor": "#5CA83C",
    "network_identifier": "TPN",
    "amount": 119
  },
  {
    "period": "Wellpoint (AGP) MA",
    "type": "(All Networks)",
    "network_bgcolor": "#5CA83C",
    "insurer_identifier": "541739323",
    "insurer_id": "d76615c2-0de7-b23c-d64f-e708f9a98ed2",
    "insurer_bgcolor": "#4C94FC",
    "network_identifier": "ANN",
    "amount": 14
  },
  {
    "period": "Wellpoint (AGP) MA",
    "type": "TEACO Provider Network",
    "network_bgcolor": "#EC8C1C",
    "insurer_identifier": "541739323",
    "insurer_id": "d76615c2-0de7-b23c-d64f-e708f9a98ed2",
    "insurer_bgcolor": "#4C94FC",
    "network_identifier": "TPN",
    "amount": 4
  },
  {
    "period": "Wellpoint (AGP) MA",
    "type": "TECQ Foundation",
    "network_bgcolor": "#94248C",
    "insurer_identifier": "541739323",
    "insurer_id": "d76615c2-0de7-b23c-d64f-e708f9a98ed2",
    "insurer_bgcolor": "#4C94FC",
    "network_identifier": "TF",
    "amount": 2
  },
  {
    "period": "Wellpoint (AGP) MA",
    "type": "Van Lang IPA",
    "network_bgcolor": "#4C94FC",
    "insurer_identifier": "541739323",
    "insurer_id": "d76615c2-0de7-b23c-d64f-e708f9a98ed2",
    "insurer_bgcolor": "#4C94FC",
    "network_identifier": "VL",
    "amount": 1
  },
  {
    "period": "Wellpoint (AGP) MA",
    "type": "TEACO Health",
    "network_bgcolor": "#5CC4C4",
    "insurer_identifier": "541739323",
    "insurer_id": "d76615c2-0de7-b23c-d64f-e708f9a98ed2",
    "insurer_bgcolor": "#4C94FC",
    "network_identifier": "TH",
    "amount": 2
  }
]