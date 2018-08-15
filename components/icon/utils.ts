import * as React from 'react';
import { IconProps } from './index';

type TransformInformation = Pick<IconProps, 'rotate' | 'flip'>;

export function getComputedSvgStyle(
  { rotate, flip }: TransformInformation,
  svgStyle: React.CSSProperties,
): React.CSSProperties {

  if (!(rotate || flip)) {
    return { ...svgStyle };
  }

  return {
    transform: `${rotate ? `rotate(${rotate}deg)` : ''} `
      + `${(flip === 'horizontal' || flip === 'both') ? `scaleX(-1)` : ''} `
      + `${(flip === 'vertical' || flip === 'both') ? `scaleY(-1)` : ''}`,
    ...svgStyle,
  };
}

// These props make sure that the SVG behaviours like general text.
// Reference: https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
export const svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  ['aria-hidden']: 'true',
};
