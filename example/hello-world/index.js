import React from "react";
import ReactDOM from "react-dom/client";
import { KoreaBubbleMap } from "../../dist/esm";
// import KoreaBubbleMap from "../../src/KoreaBubbleMap";

const container = document.getElementById("wrap");
const root = ReactDOM.createRoot(container);

const data = {
  sido: [
    { code: "3000000000", name: "대전광역시", count: 383 },
    { code: "4600000000", name: "전라남도", count: 189 },
    { code: "4700000000", name: "경상북도", count: 336 },
    { code: "2600000000", name: "부산광역시", count: 645 },
    { code: "5000000000", name: "제주특별자치도", count: 145 },
    { code: "4300000000", name: "충청북도", count: 608 },
    { code: "4800000000", name: "경상남도", count: 527 },
    { code: "1100000000", name: "서울특별시", count: 2178 },
    { code: "5100000000", name: "강원특별자치도", count: 453 },
    { code: "2800000000", name: "인천광역시", count: 1081 },
    { code: "2700000000", name: "대구광역시", count: 389 },
    { code: "4100000000", name: "경기도", count: 5213 },
    { code: "4400000000", name: "충청남도", count: 591 },
    { code: "3611000000", name: "세종특별자치시", count: 163 },
    { code: "2900000000", name: "광주광역시", count: 269 },
    { code: "4500000000", name: "전라북도", count: 234 },
    { code: "3100000000", name: "울산광역시", count: 245 },
  ],
  sigungu: [
    { code: "1168000000", name: "강남구", count: 800 },
    { code: "2720000000", name: "남구", count: 154 },
    { code: "5183000000", name: "양양군", count: 3 },
    { code: "4374000000", name: "영동군", count: 2 },
    { code: "4477000000", name: "서천군", count: 2 },
    { code: "4783000000", name: "고령군", count: 2 },
    { code: "4873000000", name: "함안군", count: 2 },
    { code: "2617000000", name: "동구", count: 130 },
    { code: "4882000000", name: "고성군", count: 7 },
    { code: "4682000000", name: "해남군", count: 2 },
    { code: "4721000000", name: "영주시", count: 2 },
    { code: "4784000000", name: "성주군", count: 2 },
  ],
  emd: [
    { code: "1111010100", name: "청운동", count: 100 },
    { code: "1168010100", name: "역삼동", count: 200 },
  ],
};

const App = () => {
  return (
    <div>
      <KoreaBubbleMap data={data} width={500} height={500} />
    </div>
  );
};

root.render(<App />);
