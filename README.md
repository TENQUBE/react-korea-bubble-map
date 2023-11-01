> ❗ **The current version is being developed and tested internally.**

# @tenqube/react-korea-bubble-map

React SVG Korea map with d3 and topojson.

## Installation

```sh
$ npm install @tenqube/react-korea-bubble-map
```

## Bubble Map

![react-korea-bubble-map-example](https://github.com/TENQUBE/react-korea-bubble-map/assets/45587474/f1ee9a36-aed8-4359-bacc-3d08ec160acb)

### Levels

South Korean administrative divisions are consisted of three levels:

- [Provinces (시도)](http://en.wikipedia.org/wiki/Administrative_divisions_of_South_Korea#Provincial_level_divisions): Special City(특별시), Metropolitan City(광역시), Province(도), Special Self-governing Province(특별자치도), Special Self-governing City(특별자치시)
- [Municipalities (시군구)](http://en.wikipedia.org/wiki/Administrative_divisions_of_South_Korea#Municipal_level_divisions): Si (시, city), Gun (군, county), Gu (구, district)
- [Submunicipalities (읍면동)](http://en.wikipedia.org/wiki/Administrative_divisions_of_South_Korea#Submunicipal_level_divisions): Eup (읍, town), Myeon (면, township), Dong (동, neighborhood)

## Quick Start

```ts
import React from "react";
import ReactDOM from "react-dom/client";
import { KoreaBubbleMap, KoreaMapData } from "@tenqube/react-korea-buble-map";
const container = document.getElementById("wrap") as HTMLElement;
const root = ReactDOM.createRoot(container);
const data: KoreaMapData = {
  sido: [{ code: "1100000000", name: "서울특별시", count: 400 }],
  sigungu: [
    { code: "1168000000", name: "강남구", count: 300 },
    { code: "1171000000", name: "송파구", count: 100 },
  ],
  emd: [
    { code: "1168010100", name: "역삼동", count: 300 },
    { code: "1171010100", name: "잠실동", count: 100 },
  ],
};
root.render(<KoreaBubbleMap data={data} width={500} height={500} />);
```

#### BubbleMapConfigProps

| Prop          | Type                                             | Mandatory          | Default | Description                                                                 |
| ------------- | ------------------------------------------------ | ------------------ | ------- | --------------------------------------------------------------------------- |
| width         | number                                           | :heavy_check_mark: | -       | svg의 width                                                                 |
| height        | number                                           | :heavy_check_mark: | -       | svg의 height                                                                |
| data          | KoreaMapData                                     | :heavy_check_mark: | -       | 시도(sido), 시군구(sigungu), 읍면동(emd)의 지역별 코드와 데이터를 가진 타입 |
| countLabel    | string                                           |                    | 인원    | 버블의 툴팁에 나오는 count label                                            |
| countPostfix  | string                                           |                    | 명      | 버블의 툴팁에 나오는 count postfix                                          |
| percentLabel  | string                                           |                    | 비율    | 전체 count 중 현재 지역의 count(%) label                                    |
| customTooltip | customTooltip?(params: TooltipProps): ReactNode; |                    | -       | 버블의 커스텀 툴팁                                                          |

#### KoreaMapData

| Prop    | Type    | Mandatory          | Default | Description     |
| ------- | ------- | ------------------ | ------- | --------------- |
| sido    | MapData | :heavy_check_mark: | -       | 시/도 데이터    |
| sigungu | MapData | :heavy_check_mark: | -       | 시/군/구 데이터 |
| emd     | MapData | :heavy_check_mark: | -       | 읍/면/동 데이터 |

#### MapData

| Prop  | Type   | Mandatory          | Default | Description |
| ----- | ------ | ------------------ | ------- | ----------- |
| code  | string | :heavy_check_mark: | -       | 법정동코드  |
| name  | string | :heavy_check_mark: | -       | 지역 이름   |
| count | number | :heavy_check_mark: | -       | 집계된 수   |

#### TooltipProps

| Prop    | Type   | Mandatory          | Default | Description                 |
| ------- | ------ | ------------------ | ------- | --------------------------- |
| name    | string | :heavy_check_mark: | -       | 지역 이름                   |
| count   | number | :heavy_check_mark: | -       | 집계된 수                   |
| percent | number | :heavy_check_mark: | -       | 전체 집계 중 현재 지역 비율 |

## References

- http://www.gisdeveloper.co.kr/?p=2332
- https://github.com/southkorea/southkorea-maps
