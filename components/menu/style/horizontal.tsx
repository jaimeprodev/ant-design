import type { MenuToken } from '.';
import type { GenerateStyle } from '../../theme';

const getHorizontalStyle: GenerateStyle<MenuToken> = token => {
  const {
    componentCls,
    motionDurationSlow,
    menuHorizontalHeight,
    colorBorderSecondary,
    lineWidth,
    lineType,
    menuItemPaddingInline,
    menuItemMarginInline,
  } = token;

  return {
    [`${componentCls}-horizontal`]: {
      lineHeight: `${menuHorizontalHeight}px`,
      border: 0,
      borderBottom: `${lineWidth}px ${lineType} ${colorBorderSecondary}`,
      boxShadow: 'none',

      '&::after': {
        display: 'block',
        clear: 'both',
        height: 0,
        content: '"\\20"',
      },

      // ======================= Item =======================
      [`${componentCls}-item, ${componentCls}-submenu`]: {
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'bottom',
        paddingInline: menuItemPaddingInline,
        marginInline: menuItemMarginInline,
      },

      [`> ${componentCls}-item:hover,
        > ${componentCls}-item-active,
        > ${componentCls}-submenu ${componentCls}-submenu-title:hover`]: {
        backgroundColor: 'transparent',
      },

      [`${componentCls}-item, ${componentCls}-submenu-title`]: {
        transition: [`border-color ${motionDurationSlow}`, `background ${motionDurationSlow}`].join(
          ',',
        ),
      },

      // ===================== Sub Menu =====================
      [`${componentCls}-submenu-arrow`]: {
        display: 'none',
      },
    },
  };
};

export default getHorizontalStyle;
