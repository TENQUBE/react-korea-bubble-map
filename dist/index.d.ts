import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactElement } from 'react';

interface MapData {
    code: string;
    name: string;
    count: number;
}
interface KoreaMapData {
    sido: MapData[];
    sigungu: MapData[];
    emd: MapData[];
}
interface BubbleMapConfigProps {
    width: number;
    height: number;
    data: KoreaMapData;
    countLabel?: string;
    countPostfix?: string;
    percentLabel?: string;
    customTooltip?: ReactElement;
}
declare function KoreaBubbleMap({ width, height, data, countLabel, countPostfix, percentLabel, customTooltip, }: BubbleMapConfigProps): react_jsx_runtime.JSX.Element;

export { type BubbleMapConfigProps, KoreaBubbleMap, type KoreaMapData, type MapData };
