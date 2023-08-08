import * as React from 'react';
import { getStyleStr } from './utils';

/**
 * Base size of the canvas, 1 for parallel layout and 2 for alternate layout
 * Only alternate layout is currently supported
 */
export const BaseSize = 2;
export const FontGap = 3;

export type AppendWatermark = (
  base64Url: string,
  markWidth: number,
  container: HTMLElement,
) => void;

export default function useWatermark(
  markStyle: React.CSSProperties,
  gapX: number,
): [
  appendWatermark: AppendWatermark,
  removeWatermark: (container: HTMLElement) => void,
  isWatermarkEle: (ele: Node) => boolean,
] {
  const [watermarkMap] = React.useState(() => new Map<HTMLElement, HTMLDivElement>());

  const appendWatermark = (base64Url: string, markWidth: number, container: HTMLElement) => {
    if (container) {
      if (!watermarkMap.get(container)) {
        const newWatermarkEle = document.createElement('div');
        watermarkMap.set(container, newWatermarkEle);
      }

      const watermarkEle = watermarkMap.get(container)!;

      watermarkEle.setAttribute(
        'style',
        getStyleStr({
          ...markStyle,
          backgroundImage: `url('${base64Url}')`,
          backgroundSize: `${(gapX + markWidth) * BaseSize}px`,
        }),
      );
      container.append(watermarkEle);
    }
  };

  const removeWatermark = (container: HTMLElement) => {
    const watermarkEle = watermarkMap.get(container);

    if (watermarkEle && container) {
      container.removeChild(watermarkEle);
    }

    watermarkMap.delete(container);
  };

  const isWatermarkEle = (ele: any) => Array.from(watermarkMap.values()).includes(ele);

  return [appendWatermark, removeWatermark, isWatermarkEle];
}
