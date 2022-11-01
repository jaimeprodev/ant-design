import type { CSSObject } from '@ant-design/cssinjs';
import type * as React from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme';
import { genComponentStyleHook, mergeToken } from '../../theme';
import { resetComponent } from '../../style';

// Direction naming standard:
// Horizontal base:
// -0-------------
// vertical: part   (水平时，垂直方向命名为 part)
// horizontal: full (水平时，水平方向命名为 full)

export interface ComponentToken {
  controlSize: number;
  railSize: number;
  handleSize: number;
  handleSizeHover: number;
  handleLineWidth: number;
  handleLineWidthHover: number;
  dotSize: number;
}

interface SliderToken extends FullToken<'Slider'> {
  marginFull: number;
  marginPart: number;
  marginPartWithMark: number;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<SliderToken> = token => {
  const {
    componentCls,
    controlSize,
    dotSize,
    marginFull,
    marginPart,
    colorFillContentHover,
    antCls,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      position: 'relative',
      height: controlSize,
      margin: `${marginPart}px ${marginFull}px`,
      padding: 0,
      cursor: 'pointer',
      touchAction: 'none',

      [`&-vertical`]: {
        margin: `${marginFull}px ${marginPart}px`,
      },

      [`${componentCls}-rail`]: {
        position: 'absolute',
        backgroundColor: token.colorFillTertiary,
        borderRadius: token.borderRadiusXS,
        transition: `background-color ${token.motionDurationFast}`,
      },

      [`${componentCls}-track`]: {
        position: 'absolute',
        backgroundColor: token.colorPrimaryBorder,
        borderRadius: token.borderRadiusXS,
        transition: `background-color ${token.motionDurationFast}`,
      },

      [`${componentCls}-handle`]: {
        position: 'absolute',
        width: token.handleSize,
        height: token.handleSize,

        [`${componentCls}-dragging`]: {
          zIndex: 1,
        },

        // 扩大选区
        '&::before': {
          content: '""',
          position: 'absolute',
          insetInlineStart: 0,
          insetBlockStart: 0,
          width: token.handleSize + token.handleLineWidth * 2,
          height: token.handleSize + token.handleLineWidth * 2,
          backgroundColor: 'transparent',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: token.handleSize,
          height: token.handleSize,
          backgroundColor: token.colorBgContainer,
          boxShadow: `0 0 0 ${token.handleLineWidth}px ${token.colorPrimaryBorder}`,
          borderRadius: '50%',
          cursor: 'pointer',
          transition: `
            inset-inline-start ${token.motionDurationFast},
            inset-block-start ${token.motionDurationFast},
            width ${token.motionDurationFast},
            height ${token.motionDurationFast},
            box-shadow ${token.motionDurationFast}
          `,
        },

        '&:hover, &:active, &:focus-visible': {
          '&::before': {
            insetInlineStart: (token.handleSize - token.handleSizeHover) / 2,
            insetBlockStart: (token.handleSize - token.handleSizeHover) / 2,
            width: token.handleSizeHover + token.handleLineWidthHover * 2,
            height: token.handleSizeHover + token.handleLineWidthHover * 2,
          },

          '&::after': {
            boxShadow: `0 0 0 ${token.handleLineWidthHover}px ${token.colorPrimary}`,
            width: token.handleSizeHover,
            height: token.handleSizeHover,
            insetInlineStart: (token.handleSize - token.handleSizeHover) / 2,
            insetBlockStart: (token.handleSize - token.handleSizeHover) / 2,
          },
        },
      },

      '&:hover': {
        [`${componentCls}-rail`]: {
          backgroundColor: token.colorFillSecondary,
        },

        [`${componentCls}-track`]: {
          backgroundColor: token.colorPrimaryBorderHover,
        },

        [`${componentCls}-dot`]: {
          borderColor: colorFillContentHover,
        },

        [`${componentCls}-handle${antCls}-tooltip-open::after`]: {
          boxShadow: `0 0 0 ${token.handleLineWidthHover}px ${token.colorPrimary}`,
        },

        [`${componentCls}-handle::after`]: {
          boxShadow: `0 0 0 ${token.handleLineWidthHover}px ${token.colorPrimary}`,
        },

        [`${componentCls}-dot-active`]: {
          borderColor: token.colorPrimary,
        },
      },

      [`${componentCls}-mark`]: {
        position: 'absolute',
        fontSize: token.fontSize,
      },

      [`${componentCls}-mark-text`]: {
        position: 'absolute',
        display: 'inline-block',
        color: token.colorTextDescription,
        textAlign: 'center',
        wordBreak: 'keep-all',
        cursor: 'pointer',
        userSelect: 'none',

        '&-active': {
          color: token.colorText,
        },
      },

      [`${componentCls}-step`]: {
        position: 'absolute',
        background: 'transparent',
        pointerEvents: 'none',
      },

      [`${componentCls}-dot`]: {
        position: 'absolute',
        width: dotSize,
        height: dotSize,
        backgroundColor: token.colorBgContainer,
        border: `${token.handleLineWidth}px solid ${token.colorSplit}`,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: `border-color ${token.motionDurationSlow}`,

        '&-active': {
          borderColor: token.colorPrimaryBorder,
        },
      },

      '&&-disabled': {
        cursor: 'not-allowed',

        [`${componentCls}-rail`]: {
          backgroundColor: `${token.colorFillSecondary} !important`,
        },

        [`${componentCls}-track`]: {
          backgroundColor: `${token.colorTextDisabled} !important`,
        },

        [`
          ${componentCls}-dot
        `]: {
          backgroundColor: token.colorBgContainer,
          borderColor: token.colorTextDisabled,
          boxShadow: 'none',
          cursor: 'not-allowed',
        },

        [`${componentCls}-handle::after`]: {
          backgroundColor: token.colorBgContainer,
          cursor: 'not-allowed',
          width: token.handleSize,
          height: token.handleSize,
          boxShadow: `0 0 0 ${token.handleLineWidth}px ${new TinyColor(token.colorTextDisabled)
            .onBackground(token.colorBgContainer)
            .toHexString()}`,
          insetInlineStart: 0,
          insetBlockStart: 0,
        },

        [`
          ${componentCls}-mark-text,
          ${componentCls}-dot
        `]: {
          cursor: `not-allowed !important`,
        },
      },
    },
  };
};

// ============================ Horizontal ============================
const genDirectionStyle = (token: SliderToken, horizontal: boolean): CSSObject => {
  const { componentCls, railSize, handleSize, dotSize } = token;

  const railPadding: keyof React.CSSProperties = horizontal ? 'paddingBlock' : 'paddingInline';
  const full: keyof React.CSSProperties = horizontal ? 'width' : 'height';
  const part: keyof React.CSSProperties = horizontal ? 'height' : 'width';
  const handlePos: keyof React.CSSProperties = horizontal ? 'insetBlockStart' : 'insetInlineStart';
  const markInset: keyof React.CSSProperties = horizontal ? 'top' : 'insetInlineStart';

  return {
    [railPadding]: railSize,
    [part]: railSize * 3,

    [`${componentCls}-rail`]: {
      [full]: '100%',
      [part]: railSize,
    },

    [`${componentCls}-track`]: {
      [part]: railSize,
    },

    [`${componentCls}-handle`]: {
      [handlePos]: (railSize * 3 - handleSize) / 2,
    },

    [`${componentCls}-mark`]: {
      // Reset all
      insetInlineStart: 0,
      top: 0,
      [markInset]: handleSize,
      [full]: '100%',
    },

    [`${componentCls}-step`]: {
      // Reset all
      insetInlineStart: 0,
      top: 0,
      [markInset]: railSize,
      [full]: '100%',
      [part]: railSize,
    },

    [`${componentCls}-dot`]: {
      position: 'absolute',
      [handlePos]: (railSize - dotSize) / 2,
    },
  };
};
// ============================ Horizontal ============================
const genHorizontalStyle: GenerateStyle<SliderToken> = token => {
  const { componentCls, marginPartWithMark } = token;

  return {
    [`${componentCls}-horizontal`]: {
      ...genDirectionStyle(token, true),

      [`&${componentCls}-with-marks`]: {
        marginBottom: marginPartWithMark,
      },
    },
  };
};

// ============================= Vertical =============================
const genVerticalStyle: GenerateStyle<SliderToken> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}-vertical`]: {
      ...genDirectionStyle(token, false),
      height: '100%',
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Slider',
  token => {
    const sliderToken = mergeToken<SliderToken>(token, {
      marginPart: (token.controlHeight - token.controlSize) / 2,
      marginFull: token.controlSize / 2,
      marginPartWithMark: token.controlHeightLG - token.controlSize,
    });
    return [
      genBaseStyle(sliderToken),
      genHorizontalStyle(sliderToken),
      genVerticalStyle(sliderToken),
    ];
  },
  token => {
    // Handle line width is always width-er 1px
    const increaseHandleWidth = 1;
    const controlSize = token.controlHeightLG / 4;
    const controlSizeHover = token.controlHeightSM / 2;
    const handleLineWidth = token.lineWidth + increaseHandleWidth;
    const handleLineWidthHover = token.lineWidth + increaseHandleWidth * 3;
    return {
      controlSize,
      railSize: 4,
      handleSize: controlSize,
      handleSizeHover: controlSizeHover,
      dotSize: (controlSize / 3) * 2,
      handleLineWidth,
      handleLineWidthHover,
    };
  },
);
