import React, { useEffect, useState, useRef, ReactNode } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { GeometryCollection, Topology } from "topojson-specification";
import { Feature, Geometry } from "geojson";

import { setAttributes } from "./utils/setAttributes";
import PlusIcon from "./assets/icons/PlusIcon";
import MinusIcon from "./assets/icons/MinusIcon";

interface GeometryProperties {
  CODE: string;
  KOR_NM: string;
  ENG_NM: string;
}

export interface MapData {
  code: string;
  name: string;
  count: number;
}

interface BubbleMapData extends MapData {
  size: number;
  index: number;
}

export interface TooltipProps {
  name: string;
  count: number;
  percent: number;
}

export interface KoreaMapData {
  sido: MapData[];
  sigungu: MapData[];
  emd: MapData[];
}

export interface BubbleMapConfigProps {
  width: number;
  height: number;
  data: KoreaMapData;
  countLabel?: string;
  countPostfix?: string;
  percentLabel?: string;
  customTooltip?(params: TooltipProps): ReactNode;
}

export default function KoreaBubbleMap({
  width,
  height,
  data,
  countLabel = "인원",
  countPostfix = "명",
  percentLabel = "비율",
  customTooltip,
}: BubbleMapConfigProps) {
  const zoomStep = useRef<number>(0);

  const [plusBtnDisabled, setPlusBtnDisabled] = useState<boolean>(false);
  const [minusBtnDisabled, setMinusBtnDisabled] = useState<boolean>(true);

  const [name, setName] = useState<string>("");
  const [count, setCount] = useState<number>(null);
  const [percent, setPercent] = useState<number>(null);

  async function draw() {
    const svg = d3
      .select(".react-korea-bubble-map")
      .select("svg") as d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    const g = svg.append("g");

    const { sidoGeometry, sigunguGeometry, emdGeometry } =
      await convertTopojsonToGeoData();
    const path = createPath(sidoGeometry);

    const emdMap = createMap({
      g,
      className: "emd-map",
      data: emdGeometry,
      path,
      attrs: {
        "fill-opacity": "0",
        stroke: "#fff",
        "stroke-opacity": "0",
        "stroke-width": "0.05px",
      },
    });

    const sigunguMap = createMap({
      g,
      className: "sigungu-map",
      data: sigunguGeometry,
      path,
      attrs: {
        "fill-opacity": "0",
        stroke: "#fff",
        "stroke-opacity": "0",
        "stroke-width": "0.15px",
      },
    });

    const sidoMap = createMap({
      g,
      className: "sido-map",
      data: sidoGeometry,
      path,
      attrs: {
        stroke: "#fff",
        "stroke-width": "0.5px",
      },
    });

    const sidoData = calculateBubbleSize(data.sido);
    const sigunguData = calculateBubbleSize(data.sigungu);
    const emdData = calculateBubbleSize(data.emd);

    const sidoBubbles = createBubbles({
      svg,
      data: sidoData,
      className: "sido-bubble",
      geometry: sidoGeometry,
      path,
      isSidoBubble: true,
    });

    const sigunguBubbles = createBubbles({
      svg,
      data: sigunguData,
      className: "sigungu-bubble",
      geometry: sigunguGeometry,
      path,
    });

    const emdBubbles = createBubbles({
      svg,
      data: emdData,
      className: "emd-bubble",
      geometry: emdGeometry,
      path,
    });

    const zoom = createZoom({
      g,
      sidoBubbles,
      sidoMap,
      sigunguBubbles,
      sigunguMap,
      emdBubbles,
      emdMap,
    });

    svg.call(zoom);
    addZoomEventToButton(svg, zoom);
  }

  async function convertTopojsonToGeoData() {
    const [koreaSidoMap, koreaSiMap, koreaGunguMap] =
      await importTopoJsonLazy();

    const sidoGeometry = topojson.feature(
      koreaSidoMap,
      koreaSidoMap.objects["sido"] as GeometryCollection<GeometryProperties>
    );
    const sigunguGeometry = topojson.feature(
      koreaSiMap,
      koreaSiMap.objects["sigungu"] as GeometryCollection<GeometryProperties>
    );
    const emdGeometry = topojson.feature(
      koreaGunguMap,
      koreaGunguMap.objects["emd"] as GeometryCollection<GeometryProperties>
    );

    return {
      sidoGeometry: sidoGeometry.features,
      sigunguGeometry: sigunguGeometry.features,
      emdGeometry: emdGeometry.features,
    };
  }

  async function importTopoJsonLazy() {
    const koreaSidoMap = import(
      "../public/sido.json"
    ) as unknown as Promise<Topology>;
    const koreaSiMap = import(
      "../public/sigungu.json"
    ) as unknown as Promise<Topology>;
    const koreaGunguMap = import(
      "../public/emd.json"
    ) as unknown as Promise<Topology>;

    return await Promise.all([koreaSidoMap, koreaSiMap, koreaGunguMap]);
  }

  function createPath(geometry: Feature<Geometry, GeometryProperties>[]) {
    const projection = d3.geoMercator().fitSize([width, height], {
      type: "FeatureCollection",
      features: geometry,
    });
    return d3.geoPath().projection(projection);
  }

  function createMap({
    g,
    className,
    data,
    path,
    attrs,
  }: {
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    className: string;
    data: Feature<Geometry, GeometryProperties>[];
    path: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    attrs: Record<string, string>;
  }) {
    const map = g
      .append("g")
      .attr("class", className)
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("data-code", (d) => d.properties.CODE.padEnd(10, "0"))
      .attr("data-name", (d) => d.properties.KOR_NM)
      .attr("fill", "#dbdce0");

    setAttributes(map, attrs);

    return map;
  }

  function calculateBubbleSize(datas: MapData[]) {
    const counts = datas.map((d) => d.count);
    const maxCount = Math.max(...counts);

    return datas
      .sort((a, b) => b.count - a.count)
      .map((d, i) => {
        const value = maxCount === 0 || d.count === 0 ? 0 : d.count / maxCount;

        const size = value < 0.1 ? 3 : value * 30;
        const result = size % 2 === 0 ? size : size + 1;

        return {
          ...d,
          size: result,
          index: i,
        };
      });
  }

  function createBubbles({
    svg,
    data,
    className,
    geometry,
    path,
    isSidoBubble = false,
  }: {
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    data: BubbleMapData[];
    className: string;
    geometry: Feature<Geometry, GeometryProperties>[];
    path: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    isSidoBubble?: boolean;
  }) {
    const totalCount = data
      .map((d) => d.count)
      .reduce((prev, cur) => prev + cur, 0);

    const bubbles = svg
      .append("g")
      .selectAll("bubbles")
      .data(data)
      .enter()
      .append("g");

    if (!isSidoBubble) {
      bubbles.style("display", "none");
    }

    bubbles
      .append("circle")
      .attr("class", "react-korea-bubble-map__pulse")
      .attr("origin-r", (d) => d.size)
      .attr("r", (d) => d.size)
      .attr("stroke", "#253FEB")
      .attr("stroke-opacity", "0.4")
      .attr("stroke-width", "1.5")
      .attr("origin-stroke-width", "1.5")
      .attr("fill", "#fff")
      .attr("fill-opacity", "0.3");

    bubbles
      .append("circle")
      .attr("class", className)
      .attr("origin-r", (d) => d.size)
      .attr("r", (d) => d.size)
      .attr("cx", function (d) {
        const bubble = findBubble(geometry, d);

        const [cx, cy] = path.centroid(bubble.geometry);
        this.setAttribute("cy", String(cy));

        const sibling = d3.select(this.previousElementSibling);
        sibling.attr("cx", cx);
        sibling.attr("cy", cy);
        sibling.attr("transform-origin", `${cx} ${cy}`);

        return cx;
      })
      .style("fill", "#253FEB")
      .attr("fill-opacity", "0.3")

      .on("mouseover", function (event, d) {
        handleBubbleMouseOver.call(this, event, d, totalCount);
      })
      .on("mousemove", handleBubbleMouseMove)
      .on("mouseout", handleBubleMouseOut);

    return bubbles;
  }

  function findBubble(
    geoData: Feature<Geometry, GeometryProperties>[],
    data: BubbleMapData
  ) {
    return geoData.find(
      (feature) => feature.properties.CODE.padEnd(10, "0") === data.code
    );
  }

  function handleBubbleMouseOver(
    event: any,
    data: BubbleMapData,
    totalCount: number
  ) {
    this.setAttribute("fill-opacity", "1");

    updateTooltipPosition(event.pageX, event.pageY);

    setName(data.name);
    setCount(data.count);
    setPercent(Math.floor((data.count / totalCount) * 100));
  }

  function handleBubbleMouseMove(event: any) {
    updateTooltipPosition(event.pageX, event.pageY);
  }

  function handleBubleMouseOut() {
    this.setAttribute("fill-opacity", "0.3");
    const tooltip = d3.select(".react-korea-bubble-map__tooltip");
    tooltip.style("opacity", 0);
  }

  function updateTooltipPosition(pageX: number, pageY: number) {
    const tooltip = d3.select(".react-korea-bubble-map__tooltip");
    const [tooltipWidth] = tooltip.style("width").split("px");
    const width = Number(tooltipWidth);

    tooltip.style("display", "block");
    const scrollX =
      typeof window.scrollX === "number" ? window.scrollX : window.pageXOffset;
    const isMousePointerOverflow =
      window.innerWidth + scrollX - pageX < width + 40;
    const offsetX = isMousePointerOverflow
      ? pageX - scrollX - width + 40
      : pageX - scrollX + 10;

    tooltip
      .style("left", offsetX + "px")
      .style("top", pageY + 20 + "px")
      .style("opacity", 1);
  }

  function createZoom({
    g,
    sidoBubbles,
    sidoMap,
    sigunguBubbles,
    sigunguMap,
    emdBubbles,
    emdMap,
  }: {
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    sidoBubbles: d3.Selection<SVGGElement, BubbleMapData, SVGGElement, unknown>;
    sidoMap: d3.Selection<SVGPathElement, unknown, SVGGElement, unknown>;
    sigunguBubbles: d3.Selection<
      SVGGElement,
      BubbleMapData,
      SVGGElement,
      unknown
    >;
    sigunguMap: d3.Selection<SVGPathElement, unknown, SVGGElement, unknown>;
    emdBubbles: d3.Selection<SVGGElement, BubbleMapData, SVGGElement, unknown>;
    emdMap: d3.Selection<SVGPathElement, unknown, SVGGElement, unknown>;
  }) {
    return d3
      .zoom()
      .scaleExtent([1, 80])
      .translateExtent([
        [-100, -100],
        [width + 100, height + 100],
      ])
      .on("zoom", (event) => {
        const { x, y, k: scale } = event.transform;
        g.attr("transform", event.transform);

        if (scale < 14) {
          resizeBubbles({ bubbles: sidoBubbles, x, y, scale });
          setAttributes(sidoMap, {
            "stroke-opacity": "1",
            "fill-opacity": "1",
          });
          setAttributes(sigunguMap, {
            "stroke-opacity": "0",
            "fill-opacity": "0",
          });
          setAttributes(emdMap, {
            "stroke-opacity": "0",
            "fill-opacity": "0",
          });
          sidoBubbles.style("display", "block");
          sigunguBubbles.style("display", "none");
          emdBubbles.style("display", "none");
          zoomStep.current = 0;
          setMinusBtnDisabled(scale === 1);
        } else if (scale >= 14 && scale < 46) {
          resizeBubbles({ bubbles: sigunguBubbles, x, y, scale });
          setAttributes(sidoMap, {
            "stroke-opacity": "0",
            "fill-opacity": "0",
          });
          setAttributes(sigunguMap, {
            "stroke-opacity": "1",
            "fill-opacity": "1",
          });
          sidoBubbles.style("display", "none");
          sigunguBubbles.style("display", "block");
          emdBubbles.style("display", "none");
          zoomStep.current = 1;
        } else {
          resizeBubbles({ bubbles: emdBubbles, x, y, scale });
          setAttributes(sidoMap, {
            "stroke-opacity": "0",
            "fill-opacity": "0",
          });
          setAttributes(sigunguMap, {
            "stroke-opacity": "0",
            "fill-opacity": "0",
          });
          setAttributes(emdMap, {
            "stroke-opacity": "1",
            "fill-opacity": "1",
          });
          sidoBubbles.style("display", "none");
          sigunguBubbles.style("display", "none");
          emdBubbles.style("display", "block");
          zoomStep.current = 2;
          setPlusBtnDisabled(scale === 80);
        }
      });
  }

  function resizeBubbles({
    bubbles,
    x,
    y,
    scale,
  }: {
    bubbles: d3.Selection<SVGGElement, BubbleMapData, SVGGElement, unknown>;
    x: number;
    y: number;
    scale: number;
  }) {
    bubbles.attr("transform", `translate(${x}, ${y}) scale(${scale})`);
    const circles = bubbles.selectAll("circle");
    circles.each(function () {
      const self = this as any;
      const r = self.getAttribute("origin-r");
      self.setAttribute("r", `${r / scale}`);
      const strokeWidth = self.getAttribute("origin-stroke-width");
      self.setAttribute("stroke-width", `${strokeWidth / scale}`);
    });
  }

  function addZoomEventToButton(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    zoom: d3.ZoomBehavior<Element, unknown>
  ) {
    d3.select(".react-korea-buble-map__zoom-in").on("click", function () {
      const inNum = zoomStep.current === 0 ? 15 : 80;
      zoom.scaleTo(svg.transition().duration(200), inNum);
    });
    d3.select(".react-korea-buble-map__zoom-out").on("click", function () {
      const outNum = zoomStep.current === 2 ? 15 : 1;
      zoom.scaleTo(svg.transition().duration(200), outNum);
    });
  }

  function renderTooltip() {
    if (customTooltip) {
      return customTooltip({
        name,
        count,
        percent,
      });
    }

    return (
      <>
        <strong>{name}</strong>
        <div>
          <span>{countLabel}</span>
          <span>
            {count}
            {countPostfix}
          </span>
        </div>
        <div>
          <span>{percentLabel}</span>
          <span>{percent}%</span>
        </div>
      </>
    );
  }

  function renderZoomButton() {
    return (
      <div className="btn-area visible">
        <button
          className="react-korea-buble-map__zoom-in"
          disabled={plusBtnDisabled}
        >
          <PlusIcon isActive={plusBtnDisabled === false} />
        </button>
        <button
          className="react-korea-buble-map__zoom-out"
          disabled={minusBtnDisabled}
        >
          <MinusIcon isActive={minusBtnDisabled === false} />
        </button>
      </div>
    );
  }

  useEffect(() => {
    draw();
  }, [data]);

  return (
    <div className="react-korea-bubble-map" style={{ width, height }}>
      <svg width={width} height={height}></svg>
      <div className="react-korea-bubble-map__tooltip">{renderTooltip()}</div>
      {renderZoomButton()}
    </div>
  );
}
