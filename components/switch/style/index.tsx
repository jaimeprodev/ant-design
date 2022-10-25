import type { CSSObject } from '@ant-design/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme';
import { genComponentStyleHook, mergeToken } from '../../theme';
import { genFocusStyle, resetComponent } from '../../style';

interface SwitchToken extends FullToken<'Switch'> {
  switchMinWidth: number;
  switchHeight: number;
  switchDuration: string;
  switchColor: string;
  switchDisabledOpacity: number;
  switchInnerMarginMin: number;
  switchInnerMarginMax: number;
  switchPadding: number;
  switchPinSize: number;
  switchBg: string;
  switchMinWidthSM: number;
  switchHeightSM: number;
  switchInnerMarginMinSM: number;
  switchInnerMarginMaxSM: number;
  switchPinSizeSM: number;
  switchHandleShadow: string;
  switchLoadingIconSize: number;
  switchLoadingIconColor: string;
  switchHandleActiveInset: string;
}

const genSwitchSmallStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;
  const switchInnerCls = `${componentCls}-inner`;

  return {
    [componentCls]: {
      [`&${componentCls}-small`]: {
        minWidth: token.switchMinWidthSM,
        height: token.switchHeightSM,
        lineHeight: `${token.switchHeightSM}px`,

        [`${componentCls}-inner`]: {
          [`${switchInnerCls}-checked`]: {
            marginInlineStart: `calc(${token.switchInnerMarginMinSM}px - 100% + ${
              token.switchPinSizeSM + token.switchPadding * 2
            }px)`,
            marginInlineEnd: `calc(${token.switchInnerMarginMaxSM}px + 100% - ${
              token.switchPinSizeSM + token.switchPadding * 2
            }px)`,
          },

          [`${switchInnerCls}-unchecked`]: {
            marginTop: -token.switchHeightSM,
            marginInlineStart: token.switchInnerMarginMaxSM,
            marginInlineEnd: token.switchInnerMarginMinSM,
          },
        },

        [`${componentCls}-handle`]: {
          width: token.switchPinSizeSM,
          height: token.switchPinSizeSM,
        },

        [`${componentCls}-loading-icon`]: {
          top: (token.switchPinSizeSM - token.switchLoadingIconSize) / 2,
          fontSize: token.switchLoadingIconSize,
        },

        [`&${componentCls}-checked`]: {
          [`${componentCls}-inner`]: {
            [`${switchInnerCls}-checked`]: {
              marginInlineStart: token.switchInnerMarginMinSM,
              marginInlineEnd: token.switchInnerMarginMaxSM,
            },

            [`${switchInnerCls}-unchecked`]: {
              marginInlineStart: `calc(${token.switchInnerMarginMaxSM}px + 100% - ${
                token.switchPinSizeSM + token.switchPadding * 2
              }px)`,
              marginInlineEnd: `calc(${token.switchInnerMarginMinSM}px - 100% + ${
                token.switchPinSizeSM + token.switchPadding * 2
              }px)`,
            },
          },

          [`${componentCls}-handle`]: {
            insetInlineStart: `calc(100% - ${token.switchPinSizeSM + token.switchPadding}px)`,
          },
        },

        [`&:not(${componentCls}-disabled):active`]: {
          [`&:not(${componentCls}-checked) ${switchInnerCls}`]: {
            [`${switchInnerCls}-unchecked`]: {
              marginInlineStart: token.switchInnerMarginMaxSM + token.marginXXS / 2,
              marginInlineEnd: token.switchInnerMarginMinSM - token.marginXXS / 2,
            },
          },

          [`&${componentCls}-checked ${switchInnerCls}`]: {
            [`${switchInnerCls}-checked`]: {
              marginInlineStart: token.switchInnerMarginMinSM - token.marginXXS / 2,
              marginInlineEnd: token.switchInnerMarginMaxSM + token.marginXXS / 2,
            },
          },
        },
      },
    },
  };
};

const genSwitchLoadingStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      [`${componentCls}-loading-icon${token.iconCls}`]: {
        position: 'relative',
        top: (token.switchPinSize - token.fontSize) / 2,
        color: token.switchLoadingIconColor,
        verticalAlign: 'top',
      },

      [`&${componentCls}-checked ${componentCls}-loading-icon`]: {
        color: token.switchColor,
      },
    },
  };
};

const genSwitchHandleStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;
  const switchHandleCls = `${componentCls}-handle`;

  return {
    [componentCls]: {
      [switchHandleCls]: {
        position: 'absolute',
        top: token.switchPadding,
        insetInlineStart: token.switchPadding,
        width: token.switchPinSize,
        height: token.switchPinSize,
        transition: `all ${token.switchDuration} ease-in-out`,

        '&::before': {
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          backgroundColor: token.switchBg,
          borderRadius: token.switchPinSize / 2,
          boxShadow: token.switchHandleShadow,
          transition: `all ${token.switchDuration} ease-in-out`,
          content: '""',
        },
      },

      [`&${componentCls}-checked ${switchHandleCls}`]: {
        insetInlineStart: `calc(100% - ${token.switchPinSize + token.switchPadding}px)`,
      },

      [`&:not(${componentCls}-disabled):active`]: {
        [`${switchHandleCls}::before`]: {
          insetInlineEnd: token.switchHandleActiveInset,
          insetInlineStart: 0,
        },

        [`&${componentCls}-checked ${switchHandleCls}::before`]: {
          insetInlineEnd: 0,
          insetInlineStart: token.switchHandleActiveInset,
        },
      },
    },
  };
};

const genSwitchInnerStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;
  const switchInnerCls = `${componentCls}-inner`;

  return {
    [componentCls]: {
      [switchInnerCls]: {
        display: 'block',
        overflow: 'hidden',
        borderRadius: 100,

        [`${switchInnerCls}-checked, ${switchInnerCls}-unchecked`]: {
          display: 'block',
          color: token.colorTextLightSolid,
          fontSize: token.fontSizeSM,
          transition: `margin-inline-start ${token.switchDuration} ease-in-out, margin-inline-end ${token.switchDuration} ease-in-out`,
          pointerEvents: 'none',
        },

        [`${switchInnerCls}-checked`]: {
          marginInlineStart: `calc(${token.switchInnerMarginMin}px - 100% + ${
            token.switchPinSize + token.switchPadding * 2
          }px)`,
          marginInlineEnd: `calc(${token.switchInnerMarginMax}px + 100% - ${
            token.switchPinSize + token.switchPadding * 2
          }px)`,
        },

        [`${switchInnerCls}-unchecked`]: {
          marginTop: -token.switchHeight,
          marginInlineStart: token.switchInnerMarginMax,
          marginInlineEnd: token.switchInnerMarginMin,
        },
      },

      [`&${componentCls}-checked ${switchInnerCls}`]: {
        [`${switchInnerCls}-checked`]: {
          marginInlineStart: token.switchInnerMarginMin,
          marginInlineEnd: token.switchInnerMarginMax,
        },

        [`${switchInnerCls}-unchecked`]: {
          marginInlineStart: `calc(${token.switchInnerMarginMax}px + 100% - ${
            token.switchPinSize + token.switchPadding * 2
          }px)`,
          marginInlineEnd: `calc(${token.switchInnerMarginMin}px - 100% + ${
            token.switchPinSize + token.switchPadding * 2
          }px)`,
        },
      },

      [`&:not(${componentCls}-disabled):active`]: {
        [`&:not(${componentCls}-checked) ${switchInnerCls}`]: {
          [`${switchInnerCls}-unchecked`]: {
            marginInlineStart: token.switchInnerMarginMax + token.switchPadding * 2,
            marginInlineEnd: token.switchInnerMarginMin - token.switchPadding * 2,
          },
        },

        [`&${componentCls}-checked ${switchInnerCls}`]: {
          [`${switchInnerCls}-checked`]: {
            marginInlineStart: token.switchInnerMarginMin - token.switchPadding * 2,
            marginInlineEnd: token.switchInnerMarginMax + token.switchPadding * 2,
          },
        },
      },
    },
  };
};

const genSwitchStyle = (token: SwitchToken): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      position: 'relative',
      display: 'inline-block',
      boxSizing: 'border-box',
      minWidth: token.switchMinWidth,
      height: token.switchHeight,
      lineHeight: `${token.switchHeight}px`,
      verticalAlign: 'middle',
      background: token.colorTextQuaternary,
      border: '0',
      borderRadius: 100,
      cursor: 'pointer',
      transition: `all ${token.motionDurationFast}`,
      userSelect: 'none',

      [`&:hover:not(${componentCls}-disabled)`]: {
        background: token.colorTextTertiary,
      },

      ...genFocusStyle(token),

      [`&${componentCls}-checked`]: {
        background: token.switchColor,

        [`&:hover:not(${componentCls}-disabled)`]: {
          background: token.colorPrimaryHover,
        },
      },

      [`&${componentCls}-loading, &${componentCls}-disabled`]: {
        cursor: 'not-allowed',
        opacity: token.switchDisabledOpacity,

        '*': {
          boxShadow: 'none',
          cursor: 'not-allowed',
        },
      },

      // rtl style
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Switch', token => {
  const switchHeight = token.fontSize * token.lineHeight;
  const switchHeightSM = token.controlHeight / 2;
  const switchPadding = 2; // This is magic
  const switchPinSize = switchHeight - switchPadding * 2;
  const switchPinSizeSM = switchHeightSM - switchPadding * 2;

  const switchToken = mergeToken<SwitchToken>(token, {
    switchMinWidth: switchPinSize * 2 + switchPadding * 4,
    switchHeight,
    switchDuration: token.motionDurationMid,
    switchColor: token.colorPrimary,
    switchDisabledOpacity: token.opacityLoading,
    switchInnerMarginMin: switchPinSize / 2,
    switchInnerMarginMax: switchPinSize + switchPadding + switchPadding * 2,
    switchPadding,
    switchPinSize,
    switchBg: token.colorBgContainer,
    switchMinWidthSM: switchPinSizeSM * 2 + switchPadding * 2,
    switchHeightSM,
    switchInnerMarginMinSM: switchPinSizeSM / 2,
    switchInnerMarginMaxSM: switchPinSizeSM + switchPadding + switchPadding * 2,
    switchPinSizeSM,
    switchHandleShadow: `0 2px 4px 0 ${new TinyColor('#00230b').setAlpha(0.2).toRgbString()}`,
    switchLoadingIconSize: token.fontSizeIcon * 0.75,
    switchLoadingIconColor: `rgba(0, 0, 0, ${token.opacityLoading})`,
    switchHandleActiveInset: '-30%',
  });

  return [
    genSwitchStyle(switchToken),

    // inner style
    genSwitchInnerStyle(switchToken),

    // handle style
    genSwitchHandleStyle(switchToken),

    // loading style
    genSwitchLoadingStyle(switchToken),

    // small style
    genSwitchSmallStyle(switchToken),
  ];
});
