// import '../../style/index.less';
// import './index.less';

// // style dependencies
// import '../../tooltip/style';

// deps-lint-skip-all
import * as React from 'react';
import { CSSObject } from '@ant-design/cssinjs';
import { GenerateStyle, resetComponent, FullToken, genComponentStyleHook } from '../../_util/theme';

// Direction naming standard:
// Horizontal base:
// -0-------------
// vertical: part   (水平时，垂直方向命名为 part)
// horizontal: full (水平时，水平方向命名为 full)

export interface ComponentToken {
  controlSize: number;
  railSize: number;
  handleSize: number;
  lineHandleWidth: number;
  dotSize: number;
}

interface SliderToken extends FullToken<'Slider'> {
  marginFull: number;
  marginPart: number;
  marginPartWithMark: number;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<SliderToken> = token => {
  const { componentCls, controlSize, dotSize, marginFull, marginPart, colorBgContainerSecondary } =
    token;

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
        backgroundColor: token.colorBgContainer,
        borderRadius: token.controlRadius,
        transition: `background-color ${token.motionDurationSlow}`,
      },

      [`${componentCls}-track`]: {
        position: 'absolute',
        backgroundColor: token.colorPrimarySecondary,
        borderRadius: token.controlRadius,
        transition: `background-color ${token.motionDurationSlow}`,
      },

      [`${componentCls}-handle`]: {
        position: 'absolute',
        width: token.handleSize,
        height: token.handleSize,
        backgroundColor: token.colorBgComponent,
        border: `${token.lineHandleWidth}px solid ${token.colorPrimarySecondary}`,
        borderRadius: '50%',
        boxShadow: 'none',
        cursor: 'pointer',
        transition: `
          border-color ${token.motionDurationSlow},
          box-shadow ${token.motionDurationSlow},
          transform ${token.motionDurationSlow} cubic-bezier(0.18, 0.89, 0.32, 1.28)
        `,
        outline: 'none',

        [`${componentCls}-dragging`]: {
          zIndex: 1,
        },

        '&:focus': {
          borderColor: token.colorPrimaryHover,
          boxShadow: 'none',
        },

        '&:focus-visible': {
          boxShadow: `0 0 0 ${token.controlOutlineWidth}px ${token.colorPrimarySecondary}`,
        },

        // Seems useless?
        //     &.@{ant-prefix}-tooltip-open {
        //       border-color: @slider-handle-color-tooltip-open;
        //     }
      },

      '&:hover': {
        [`${componentCls}-rail`]: {
          backgroundColor: colorBgContainerSecondary,
        },

        [`${componentCls}-track`]: {
          backgroundColor: token.colorPrimaryHover,
        },

        [`${componentCls}-dot`]: {
          borderColor: colorBgContainerSecondary,
        },

        // We use below style instead
        //     ${sliderCls}-handle:not(.@{ant-prefix}-tooltip-open) {
        //       border-color: @slider-handle-color-hover;
        //     }

        [`
          ${componentCls}-handle,
          ${componentCls}-dot-active
        `]: {
          borderColor: token.colorPrimaryHover,
        },
      },

      [`${componentCls}-mark`]: {
        position: 'absolute',
        fontSize: token.fontSize,
      },

      [`${componentCls}-mark-text`]: {
        position: 'absolute',
        display: 'inline-block',
        color: token.colorTextSecondary,
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
        backgroundColor: token.colorBgComponent,
        border: `${token.lineHandleWidth}px solid ${token.colorSplit}`,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: `border-color ${token.motionDurationSlow}`,

        '&-active': {
          borderColor: token.colorPrimarySecondary,
        },
      },

      '&-disabled': {
        cursor: 'not-allowed',

        [`${componentCls}-rail`]: {
          backgroundColor: `${token.colorBgContainer} !important`,
        },

        [`${componentCls}-track`]: {
          backgroundColor: `${token.colorTextDisabled} !important`,
        },

        [`
          ${componentCls}-handle,
          ${componentCls}-dot
        `]: {
          backgroundColor: token.colorBgComponent,
          borderColor: `${token.colorTextDisabled} !important`,
          boxShadow: 'none',
          cursor: 'not-allowed',
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
  const { componentCls, railSize, controlSize, handleSize, dotSize } = token;

  const railPadding: keyof React.CSSProperties = horizontal ? 'paddingBlock' : 'paddingInline';
  const full: keyof React.CSSProperties = horizontal ? 'width' : 'height';
  const part: keyof React.CSSProperties = horizontal ? 'height' : 'width';
  const handlePos: keyof React.CSSProperties = horizontal ? 'insetBlockStart' : 'insetInlineStart';
  const markInset: keyof React.CSSProperties = horizontal ? 'top' : 'insetInlineStart';

  return {
    [railPadding]: railSize,
    [part]: controlSize,

    [`${componentCls}-rail`]: {
      [full]: '100%',
      [part]: railSize,
    },

    [`${componentCls}-track`]: {
      [part]: railSize,
    },

    [`${componentCls}-handle`]: {
      [handlePos]: (controlSize - handleSize) / 2,
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
  (token, { hashId }) => {
    const sliderToken: SliderToken = {
      ...token,
      marginPart: (token.controlHeight - token.controlSize) / 2,
      marginFull: token.controlSize / 2,
      marginPartWithMark: token.controlHeightLG - token.controlSize,
    };
    return [
      genBaseStyle(sliderToken, hashId),
      genHorizontalStyle(sliderToken),
      genVerticalStyle(sliderToken),
    ];
  },
  token => {
    // Handle line width is always width-er 1px
    const increaseHandleWidth = 1;
    const controlSize = token.controlHeightSM / 2;
    const lineHandleWidth = token.lineWidth + increaseHandleWidth;
    return {
      controlSize,
      railSize: controlSize / 3,
      handleSize: controlSize + lineHandleWidth,
      dotSize: (controlSize / 3) * 2,
      lineHandleWidth,
    };
  },
);
