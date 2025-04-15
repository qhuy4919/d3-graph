import { D3BarChart } from './component';
import { D3reduceData } from './component/graph/util';


function App() {
  const normalizeData = D3reduceData(data, {
    period: "period",
    type: "type",
    amount: "amount",
    color: "color",
  });

  return (
    <D3BarChart
      data={normalizeData}
      options={{
        height: 400,
        width: 800,
        padding: { top: 40, right: 40, bottom: 40, left: 40 }
      }
      }
    />
  )
}

export default App


const data = [
  {
    "tax_id": "202020205",
    "type": "OLLERMAN INC - Test RAPS",
    "_id": "4996c2b3-0bdb-4027-9079-9fb58d92fd4f",
    "alias": null,
    "eligible": null,
    "ineligible": null,
    "amount": null,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#FF4D4F",
    "tag": "new-provider"
  },
  {
    "tax_id": "394578341",
    "type": "ABUNDANCE OF CARE, INC.",
    "_id": "d3a8fdc4-0a0f-4902-86ba-8dcfad35caac",
    "alias": null,
    "eligible": null,
    "ineligible": null,
    "amount": null,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#FF4D4F",
    "tag": "new-provider"
  },
  {
    "tax_id": "394587378",
    "type": "A1 SMILES",
    "_id": "f27f8810-0870-4c25-8ffb-cac942f60515",
    "alias": null,
    "eligible": null,
    "ineligible": null,
    "amount": null,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#FF4D4F",
    "tag": "new-provider"
  },
  {
    "tax_id": "123213212",
    "type": "AREA AGENCY ON AGING OF WESTERN ARKANSAS, INC",
    "_id": "bfe49101-7a01-4e23-93e6-c17d43ca1cb8",
    "alias": null,
    "eligible": null,
    "ineligible": null,
    "amount": null,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#FF4D4F",
    "tag": "new-provider"
  },
  {
    "tax_id": "723672242",
    "type": "Trang Company",
    "_id": "ce70f3c1-fa00-454d-8dab-9255738bccd2",
    "alias": null,
    "eligible": null,
    "ineligible": null,
    "amount": null,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#FF4D4F",
    "tag": "new-provider"
  },
  {
    "tax_id": "134582794",
    "type": "24 SEVEN CARE, LLC",
    "_id": "ef66425c-b4e2-4bc8-a850-6261dc10fb60",
    "alias": null,
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#FF4D4F",
    "tag": "new-provider"
  },
  {
    "tax_id": "048975239",
    "type": "Jaclan",
    "_id": "4a5e17d2-fb25-4087-afe0-1f0d1be5f4dd",
    "alias": "Jaclan",
    "eligible": 5,
    "ineligible": 0,
    "amount": 5,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "938985649",
    "type": "GENTLE DENTISTRY",
    "_id": "b6c108d5-4fec-4880-a35c-9bb3f4611e69",
    "alias": "GENTLE DENTISTRY",
    "eligible": 5,
    "ineligible": 0,
    "amount": 5,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "237657326",
    "type": "CI MEDICAL - II",
    "_id": "8d3cb959-d7b7-4d91-b4d5-b58cfb9047f1",
    "alias": "CI MEDICAL - II",
    "eligible": 5,
    "ineligible": 0,
    "amount": 5,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "345676460",
    "type": "CI MEDICAL - I",
    "_id": "ad5eed44-7bc3-40e3-bed2-ec36261492ee",
    "alias": "CI MEDICAL - I",
    "eligible": 3,
    "ineligible": 0,
    "amount": 3,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "644644464",
    "type": "A PLACE",
    "_id": "9c14c6d3-b3ad-49fd-8e56-94ea004c11b6",
    "alias": "A PLACE",
    "eligible": 3,
    "ineligible": 0,
    "amount": 3,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "129475834",
    "type": "abcd",
    "_id": "afd45050-6592-4f29-b54b-28f68b50e3fd",
    "alias": "abcd",
    "eligible": 3,
    "ineligible": 0,
    "amount": 3,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "102918221",
    "type": "(heart) dba CENTER OF NORTH HOUSTON",
    "_id": "6a0d5de8-183f-4c4b-9214-f2b32c2fe371",
    "alias": "(heart) dba CENTER OF NORTH HOUSTON",
    "eligible": 2,
    "ineligible": 0,
    "amount": 2,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "309857348",
    "type": "DBA TEST A HOME FOR US",
    "_id": "4024baee-db27-4555-a1eb-056583c5a2c2",
    "alias": "DBA TEST A HOME FOR US",
    "eligible": 2,
    "ineligible": 0,
    "amount": 2,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "239578393",
    "type": "A DENTAL CORPORATION",
    "_id": "105bf2a3-47ed-4b56-ab83-82ed2158df1f",
    "alias": "A DENTAL CORPORATION",
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "768349789",
    "type": "BODYLOGICMD OF HARTFORD",
    "_id": "15a37f21-8661-44d6-98d6-7c5547d652a1",
    "alias": "BODYLOGICMD OF HARTFORD",
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "273567263",
    "type": "TEXAS HEALTH",
    "_id": "1f31be8b-1b12-4dcd-9767-f6e1f1962787",
    "alias": "TEXAS HEALTH",
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "101010101",
    "type": "AHF PHARMACY",
    "_id": "62537239-037f-47e0-8e32-e6633559a6f5",
    "alias": "AHF PHARMACY",
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "397583754",
    "type": "ALWAYS THE BEST",
    "_id": "63ec7345-b89e-49cf-98ba-fa4cf817016a",
    "alias": "ALWAYS THE BEST",
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "345485643",
    "type": "A NEW START TREATMENT AND RECOVERY CENTER",
    "_id": "9c43fd17-51bf-4f10-aafa-59a7a5375876",
    "alias": "A NEW START TREATMENT AND RECOVERY CENTER",
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "092314879",
    "type": "ABEL COUNSELING LLC",
    "_id": "d27474cf-4af5-40dd-b02a-dd50a33098ae",
    "alias": null,
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "761278318",
    "type": "HENRY COUNTY HEALTH DEPT-ABBEVILLE MAT CM",
    "_id": "d7b73d02-b013-4b7f-a65a-21cd1adf902b",
    "alias": null,
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "923857634",
    "type": "A CARING HEART NURSING SERVICES LLC",
    "_id": "e2b95bc6-aaee-45a4-8a07-c0e860847569",
    "alias": null,
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "345982364",
    "type": "ABA WEISSENBERG ELITE BEHAVIORAL SERVICES",
    "_id": "f18f2a6f-b163-4523-ac6f-3441c3ccfccd",
    "alias": null,
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": "250378534",
    "type": "A WOMAN'S PLACE LLC",
    "_id": "d5603a0f-bf35-4f6c-af67-f291291a11cb",
    "alias": null,
    "eligible": 1,
    "ineligible": 0,
    "amount": 1,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#000000",
    "tag": null
  },
  {
    "tax_id": null,
    "type": "HEALTHSOURCE CHIROPRACTIC OF HARTSELLE",
    "_id": "273c2624-a26a-45f6-9165-21960f209d83",
    "alias": "HEALTHSOURCE CHIROPRACTIC OF HARTSELLE",
    "eligible": null,
    "ineligible": null,
    "amount": null,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#94248C",
    "tag": "oon-provider"
  },
  {
    "tax_id": null,
    "type": "Test 1",
    "_id": "29d55adb-10ec-4bfe-824c-6c8a85cd0dcd",
    "alias": null,
    "eligible": null,
    "ineligible": null,
    "amount": null,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#94248C",
    "tag": "oon-provider"
  },
  {
    "tax_id": "395673645",
    "type": "TEXAS EYE",
    "_id": "aac38018-f328-4cd9-83c2-21e52dd1c056",
    "alias": "TEXAS EYE",
    "eligible": 2443,
    "ineligible": 0,
    "amount": 2443,
    "eligible_bgcolor": "#43A047",
    "ineligible_bgcolor": "#FF4D4F",
    "lbcolor": "#94248C",
    "tag": "oon-provider"
  }
]