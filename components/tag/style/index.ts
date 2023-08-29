import type React from 'react';
import type { CSSInterpolation } from '@ant-design/cssinjs';

import { resetComponent } from '../../style';
import type { GlobalToken } from '../../theme';
import type { FullToken } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import type { GenStyleFn } from '../../theme/util/genComponentStyleHook';

export interface ComponentToken {
  /**
   * @desc 默认背景色
   * @descEN Default background color
   */
  defaultBg: string;
  /**
   * @desc 默认文字颜色
   * @descEN Default text color
   */
  defaultColor: string;
}

export interface TagToken extends FullToken<'Tag'> {
  tagFontSize: number;
  tagLineHeight: React.CSSProperties['lineHeight'];
  tagIconSize: number;
  tagPaddingHorizontal: number;
  tagBorderlessBg: string;
}

// ============================== Styles ==============================

const genBaseStyle = (token: TagToken): CSSInterpolation => {
  const { paddingXXS, lineWidth, tagPaddingHorizontal, componentCls } = token;
  const paddingInline = tagPaddingHorizontal - lineWidth;
  const iconMarginInline = paddingXXS - lineWidth;

  return {
    // Result
    [componentCls]: {
      ...resetComponent(token),
      display: 'inline-block',
      height: 'auto',
      marginInlineEnd: token.marginXS,
      paddingInline,
      fontSize: token.tagFontSize,
      lineHeight: token.tagLineHeight,
      whiteSpace: 'nowrap',
      background: token.defaultBg,
      border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
      borderRadius: token.borderRadiusSM,
      opacity: 1,
      transition: `all ${token.motionDurationMid}`,
      textAlign: 'start',
      position: 'relative',

      // RTL
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      '&, a, a:hover': {
        color: token.defaultColor,
      },

      [`${componentCls}-close-icon`]: {
        marginInlineStart: iconMarginInline,
        color: token.colorTextDescription,
        fontSize: token.tagIconSize,
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid}`,

        '&:hover': {
          color: token.colorTextHeading,
        },
      },

      [`&${componentCls}-has-color`]: {
        borderColor: 'transparent',

        [`&, a, a:hover, ${token.iconCls}-close, ${token.iconCls}-close:hover`]: {
          color: token.colorTextLightSolid,
        },
      },

      [`&-checkable`]: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        cursor: 'pointer',

        [`&:not(${componentCls}-checkable-checked):hover`]: {
          color: token.colorPrimary,
          backgroundColor: token.colorFillSecondary,
        },

        '&:active, &-checked': {
          color: token.colorTextLightSolid,
        },

        '&-checked': {
          backgroundColor: token.colorPrimary,
          '&:hover': {
            backgroundColor: token.colorPrimaryHover,
          },
        },

        '&:active': {
          backgroundColor: token.colorPrimaryActive,
        },
      },

      [`&-hidden`]: {
        display: 'none',
      },

      // To ensure that a space will be placed between character and `Icon`.
      [`> ${token.iconCls} + span, > span + ${token.iconCls}`]: {
        marginInlineStart: paddingInline,
      },
    },
    [`${componentCls}-borderless`]: {
      borderColor: 'transparent',
      background: token.tagBorderlessBg,
    },
  };
};

// ============================== Export ==============================
export const prepareToken: (token: Parameters<GenStyleFn<'Tag'>>[0]) => TagToken = (token) => {
  const { lineWidth, fontSizeIcon } = token;

  const tagFontSize = token.fontSizeSM;
  const tagLineHeight = `${token.lineHeightSM * tagFontSize}px`;

  const tagToken = mergeToken<TagToken>(token, {
    tagFontSize,
    tagLineHeight,
    tagIconSize: fontSizeIcon - 2 * lineWidth, // Tag icon is much smaller
    tagPaddingHorizontal: 8, // Fixed padding.
    tagBorderlessBg: token.colorFillTertiary,
  });
  return tagToken;
};

export const prepareCommonToken: (token: GlobalToken) => ComponentToken = (token) => ({
  defaultBg: token.colorFillQuaternary,
  defaultColor: token.colorText,
});

export default genComponentStyleHook(
  'Tag',
  (token) => {
    const tagToken = prepareToken(token);

    return genBaseStyle(tagToken);
  },
  prepareCommonToken,
);
