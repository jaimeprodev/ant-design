import type { CSSObject } from '@ant-design/cssinjs';
import { resetComponent, textEllipsis } from '../../style';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {
  itemColor: string;
  itemHoverColor: string;
  itemHoverBg: string;
  itemActiveBg: string;
  itemSelectedBg: string;
}

interface SegmentedToken extends FullToken<'Segmented'> {
  padding: number;
  bgColor: string;
  segmentedPaddingHorizontal: number;
  segmentedPaddingHorizontalSM: number;
}

// ============================== Mixins ==============================
function getItemDisabledStyle(cls: string, token: SegmentedToken): CSSObject {
  return {
    [`${cls}, ${cls}:hover, ${cls}:focus`]: {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
    },
  };
}

function getItemSelectedStyle(token: SegmentedToken): CSSObject {
  return {
    backgroundColor: token.itemSelectedBg,
    boxShadow: token.boxShadowTertiary,
  };
}

const segmentedTextEllipsisCss: CSSObject = {
  overflow: 'hidden',
  // handle text ellipsis
  ...textEllipsis,
};

// ============================== Styles ==============================
const genSegmentedStyle: GenerateStyle<SegmentedToken> = (token: SegmentedToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      display: 'inline-block',
      padding: token.padding,
      color: token.itemColor,
      backgroundColor: token.bgColor,
      borderRadius: token.borderRadius,
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,

      [`${componentCls}-group`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyItems: 'flex-start',
        width: '100%',
      },

      // RTL styles
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      // block styles
      [`&${componentCls}-block`]: {
        display: 'flex',
      },

      [`&${componentCls}-block ${componentCls}-item`]: {
        flex: 1,
        minWidth: 0,
      },

      // item styles
      [`${componentCls}-item`]: {
        position: 'relative',
        textAlign: 'center',
        cursor: 'pointer',
        transition: `color ${token.motionDurationMid} ${token.motionEaseInOut}`,
        borderRadius: token.borderRadiusSM,

        '&-selected': {
          ...getItemSelectedStyle(token),
          color: token.itemHoverColor,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          insetInlineStart: 0,
          borderRadius: 'inherit',
          transition: `background-color ${token.motionDurationMid}`,
          // This is mandatory to make it not clickable or hoverable
          // Ref: https://github.com/ant-design/ant-design/issues/40888
          pointerEvents: 'none',
        },

        [`&:hover:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.itemHoverColor,
          '&::after': {
            backgroundColor: token.itemHoverBg,
          },
        },
        [`&:active:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.itemHoverColor,
          '&::after': {
            backgroundColor: token.itemActiveBg,
          },
        },

        '&-label': {
          minHeight: token.controlHeight - token.padding * 2,
          lineHeight: `${token.controlHeight - token.padding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontal}px`,
          ...segmentedTextEllipsisCss,
        },

        // syntactic sugar to add `icon` for Segmented Item
        '&-icon + *': {
          marginInlineStart: token.marginSM / 2,
        },

        '&-input': {
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        },
      },

      // thumb styles
      [`${componentCls}-thumb`]: {
        ...getItemSelectedStyle(token),

        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: 0,
        height: '100%',
        padding: `${token.paddingXXS}px 0`,
        borderRadius: token.borderRadiusSM,

        [`& ~ ${componentCls}-item:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)::after`]:
          {
            backgroundColor: 'transparent',
          },
      },

      // size styles
      [`&${componentCls}-lg`]: {
        borderRadius: token.borderRadiusLG,
        [`${componentCls}-item-label`]: {
          minHeight: token.controlHeightLG - token.padding * 2,
          lineHeight: `${token.controlHeightLG - token.padding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontal}px`,
          fontSize: token.fontSizeLG,
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadius,
        },
      },

      [`&${componentCls}-sm`]: {
        borderRadius: token.borderRadiusSM,
        [`${componentCls}-item-label`]: {
          minHeight: token.controlHeightSM - token.padding * 2,
          lineHeight: `${token.controlHeightSM - token.padding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontalSM}px`,
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadiusXS,
        },
      },

      // disabled styles
      ...getItemDisabledStyle(`&-disabled ${componentCls}-item`, token),
      ...getItemDisabledStyle(`${componentCls}-item-disabled`, token),

      // transition effect when `appear-active`
      [`${componentCls}-thumb-motion-appear-active`]: {
        transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOut}, width ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        willChange: 'transform, width',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Segmented',
  (token) => {
    const { lineWidth, lineWidthBold } = token;

    const segmentedToken = mergeToken<SegmentedToken>(token, {
      padding: lineWidthBold,
      segmentedPaddingHorizontal: token.controlPaddingHorizontal - lineWidth,
      segmentedPaddingHorizontalSM: token.controlPaddingHorizontalSM - lineWidth,
    });
    return [genSegmentedStyle(segmentedToken)];
  },
  (token) => {
    const { colorTextLabel, colorText, colorFillSecondary, colorBgElevated, colorFill } = token;
    return {
      itemColor: colorTextLabel,
      itemHoverColor: colorText,
      itemHoverBg: colorFillSecondary,
      itemSelectedBg: colorBgElevated,
      itemActiveBg: colorFill,
    };
  },
);
