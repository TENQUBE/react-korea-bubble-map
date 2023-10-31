import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface MapData {
    code: string;
    name: string;
    count: number;
}
interface TooltipProps {
    name: string;
    count: number;
    percent: number;
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
    customTooltip?(params: TooltipProps): ReactNode;
}
declare function KoreaBubbleMap({ width, height, data, countLabel, countPostfix, percentLabel, customTooltip, }: BubbleMapConfigProps): react_jsx_runtime.JSX.Element;

export { type BubbleMapConfigProps, KoreaBubbleMap, type KoreaMapData, type MapData, type TooltipProps };
