import React from 'react';
import { CSSInterpolation, Theme, useCacheToken, useStyleRegister } from '@ant-design/cssinjs';
import genComponentStyleHook from './util/genComponentStyleHook';
import defaultSeedToken, { derivative as defaultDerivative } from './themes/default';
import version from '../../version';
import { resetComponent, resetIcon, clearFix, roundedArrow } from './util';
import formatToken from './util/alias';
import {
  initSlideMotion,
  slideUpIn,
  slideUpOut,
  slideDownIn,
  slideDownOut,
  slideLeftIn,
  slideLeftOut,
  slideRightIn,
  slideRightOut,
} from './util/slide';
import statisticToken, { merge as mergeToken } from './util/statistic';
import { GlobalToken, PresetColors } from './interface';
import type {
  SeedToken,
  DerivativeToken,
  AliasToken,
  OverrideToken,
  PresetColorType,
} from './interface';
import type { FullToken } from './util/genComponentStyleHook';

export {
  PresetColors,
  resetComponent,
  resetIcon,
  clearFix,
  roundedArrow,
  initSlideMotion,
  slideUpIn,
  slideUpOut,
  slideDownIn,
  slideDownOut,
  slideLeftIn,
  slideLeftOut,
  slideRightIn,
  slideRightOut,
  useStyleRegister,
  // Statistic
  statisticToken,
  mergeToken,
  // GenComponentStyleHook
  genComponentStyleHook,
};

export type {
  SeedToken,
  AliasToken,
  PresetColorType,
  // FIXME: Remove this type
  AliasToken as DerivativeToken,
  FullToken,
};

// ================================ Context =================================
const defaultTheme = new Theme(defaultDerivative);

export const DesignTokenContext = React.createContext<{
  token: Partial<SeedToken>;
  theme?: Theme<SeedToken, DerivativeToken>;
  override?: OverrideToken;
  hashed?: string | boolean;
}>({
  token: defaultSeedToken,
  theme: defaultTheme,
});

// ================================== Hook ==================================
export function useToken(): [Theme<SeedToken, DerivativeToken>, GlobalToken, string] {
  const {
    token: rootDesignToken,
    theme = defaultTheme,
    override,
    hashed,
  } = React.useContext(DesignTokenContext);

  const salt = `${version}-${hashed || ''}`;

  const [token, hashId] = useCacheToken<GlobalToken, SeedToken>(
    theme,
    [defaultSeedToken, rootDesignToken],
    {
      salt,
      override,
      formatToken,
    },
  );

  return [theme, token, hashed ? hashId : ''];
}

export type UseComponentStyleResult = [(node: React.ReactNode) => React.ReactElement, string];

export type GenerateStyle<ComponentToken extends object, ReturnType = CSSInterpolation> = (
  token: ComponentToken,
  hashId?: string,
) => ReturnType;
