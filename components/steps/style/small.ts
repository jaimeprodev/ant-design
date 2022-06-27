import type { CSSObject } from '@ant-design/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme';

const genStepsSmallStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const {
    componentCls,
    stepsSmallIconSize,
    // stepsSmallIconMargin,
    fontSizeSM,
    fontSizeBase,
    colorTextSecondary,
  } = token;

  return {
    [`&${componentCls}-small`]: {
      [`&${componentCls}-horizontal:not(${componentCls}-label-vertical) ${componentCls}-item`]: {
        paddingInlineStart: token.paddingSM,
        '&:first-child': {
          paddingInlineStart: 0,
        },
      },

      [`${componentCls}-item-icon`]: {
        width: stepsSmallIconSize,
        height: stepsSmallIconSize,
        // margin: stepsSmallIconMargin,
        marginTop: 0,
        marginBottom: 0,
        marginInline: `0 ${token.marginXS}px`,
        fontSize: fontSizeSM,
        lineHeight: `${stepsSmallIconSize}px`,
        textAlign: 'center',
        borderRadius: stepsSmallIconSize,
      },
      [`${componentCls}-item-title`]: {
        paddingInlineEnd: token.paddingSM,
        fontSize: fontSizeBase,
        lineHeight: `${stepsSmallIconSize}px`,

        '&::after': {
          top: stepsSmallIconSize / 2,
        },
      },
      [`${componentCls}-item-description`]: {
        color: colorTextSecondary,
        fontSize: fontSizeBase,
      },
      [`${componentCls}-item-tail`]: {
        top: token.marginXS,
      },
      [`${componentCls}-item-custom ${componentCls}-item-icon`]: {
        width: 'inherit',
        height: 'inherit',
        lineHeight: 'inherit',
        background: 'none',
        border: 0,
        borderRadius: 0,
        [`> ${componentCls}-icon`]: {
          fontSize: stepsSmallIconSize,
          lineHeight: `${stepsSmallIconSize}px`,
          transform: 'none',
        },
      },
    },
  };
};
export default genStepsSmallStyle;
