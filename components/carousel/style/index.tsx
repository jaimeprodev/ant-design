// deps-lint-skip-all
import type { CSSObject } from '@ant-design/cssinjs';
import { genComponentStyleHook, resetComponent } from '../../_util/theme';
import type { GenerateStyle, FullToken } from '../../_util/theme';

export interface ComponentToken {
  carouselDotWidth: CSSObject['width'];
  carouselDotHeight: CSSObject['height'];
  carouselDotActiveWidth: CSSObject['width'];
}

const genCarouselStyle: GenerateStyle<FullToken<'Carousel'>> = token => {
  const { componentCls, antCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      '.slick-slider': {
        position: 'relative',
        display: 'block',
        boxSizing: 'border-box',
        touchAction: 'pan-y',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',

        '.slick-track, .slick-list': {
          transform: 'translate3d(0, 0, 0)',
          touchAction: 'pan-y',
        },
      },

      '.slick-list': {
        position: 'relative',
        display: 'block',
        margin: 0,
        padding: 0,
        overflow: 'hidden',

        '&:focus': {
          outline: 'none',
        },

        '&.dragging': {
          cursor: 'pointer',
        },

        '.slick-slide': {
          pointerEvents: 'none',

          // https://github.com/ant-design/ant-design/issues/23294
          [`input${antCls}-radio-input, input${antCls}-checkbox-input`]: {
            visibility: 'hidden',
          },

          '&.slick-active': {
            pointerEvents: 'auto',

            [`input${antCls}-radio-input, input${antCls}-checkbox-input`]: {
              visibility: 'visible',
            },
          },

          // fix Carousel content height not match parent node
          // when children is empty node
          // https://github.com/ant-design/ant-design/issues/25878
          '> div > div': {
            verticalAlign: 'bottom',
          },
        },
      },

      '.slick-track': {
        position: 'relative',
        top: 0,
        insetInlineStart: 0,
        display: 'block',

        '&::before, &::after': {
          display: 'table',
          content: '""',
        },

        '&::after': {
          clear: 'both',
        },
      },

      '.slick-slide': {
        display: 'none',
        float: 'left',
        height: '100%',
        minHeight: 1,

        img: {
          display: 'block',
        },

        '&.dragging img': {
          pointerEvents: 'none',
        },
      },

      '.slick-initialized .slick-slide': {
        display: 'block',
      },

      '.slick-vertical .slick-slide': {
        display: 'block',
        height: 'auto',
      },

      '.slick-arrow.slick-hidden': {
        display: 'none',
      },

      // Arrows
      '.slick-prev, .slick-next': {
        position: 'absolute',
        top: '50%',
        display: 'block',
        // FIXME hardcode in v4
        width: 20,
        height: 20,
        marginTop: -10,
        padding: 0,
        color: 'transparent',
        fontSize: 0,
        lineHeight: 0,
        background: 'transparent',
        border: 0,
        outline: 'none',
        cursor: 'pointer',

        '&:hover, &:focus': {
          color: 'transparent',
          background: 'transparent',
          outline: 'none',

          '&::before': {
            opacity: 1,
          },
        },

        '&.slick-disabled::before': {
          opacity: 0.25,
        },
      },

      '.slick-prev': {
        // FIXME hardcode in v4
        insetInlineStart: -25,

        '&::before': {
          content: '"←"',
        },
      },

      '.slick-next': {
        // FIXME hardcode in v4
        insetInlineEnd: -25,

        '&::before': {
          content: '"→"',
        },
      },

      // Dots
      '.slick-dots': {
        position: 'absolute',
        insetInlineEnd: 0,
        bottom: 0,
        insetInlineStart: 0,
        zIndex: 15,
        display: 'flex !important',
        justifyContent: 'center',
        marginInlineEnd: '15%',
        marginInlineStart: '15%',
        paddingInlineStart: 0,
        listStyle: 'none',

        '&-bottom': {
          // FIXME hardcode in v4
          bottom: 12,
        },

        '&-top': {
          // FIXME hardcode in v4
          top: 12,
          bottom: 'auto',
        },

        li: {
          position: 'relative',
          display: 'inline-block',
          flex: '0 1 auto',
          boxSizing: 'content-box',
          width: token.carouselDotWidth,
          height: token.carouselDotHeight,
          margin: '0 2px',
          // FIXME hardcode in v4
          marginInlineEnd: 3,
          marginInlineStart: 3,
          padding: 0,
          textAlign: 'center',
          textIndent: '-999px',
          verticalAlign: 'top',
          transition: `all ${token.motionDurationSlow}`,

          button: {
            display: 'block',
            width: '100%',
            height: token.carouselDotHeight,
            padding: 0,
            color: 'transparent',
            fontSize: 0,
            background: token.colorBgComponent,
            border: 0,
            borderRadius: 1,
            outline: 'none',
            cursor: 'pointer',
            opacity: 0.3,
            transition: `all ${token.motionDurationSlow}`,

            '&: hover, &:focus': {
              opacity: 0.75,
            },
          },

          '&.slick-active': {
            width: token.carouselDotActiveWidth,

            '& button': {
              background: token.colorBgComponent,
              opacity: 1,
            },

            '&: hover, &:focus': {
              opacity: 1,
            },
          },
        },
      },
    },
  };
};

const genCarouselVerticalStyle: GenerateStyle<FullToken<'Carousel'>> = token => {
  const { componentCls } = token;

  const reverseSizeOfDot = {
    width: token.carouselDotHeight,
    height: token.carouselDotWidth,
  };

  return {
    [`${componentCls}-vertical`]: {
      '.slick-dots': {
        top: '50%',
        bottom: 'auto',
        flexDirection: 'column',
        width: token.carouselDotHeight,
        height: 'auto',
        margin: 0,
        transform: 'translateY(-50%)',

        '&-left': {
          insetInlineEnd: 'auto',
          insetInlineStart: '12px',
        },

        '&-right': {
          insetInlineEnd: '12px',
          insetInlineStart: 'auto',
        },

        li: {
          // reverse width and height in vertical situation
          ...reverseSizeOfDot,
          margin: '4px 2px',
          verticalAlign: 'baseline',

          button: reverseSizeOfDot,

          '&.slick-active': {
            ...reverseSizeOfDot,

            button: reverseSizeOfDot,
          },
        },
      },
    },
  };
};

const genCarouselRtlStyle: GenerateStyle<FullToken<'Carousel'>> = token => {
  const { componentCls } = token;

  return [
    {
      [`${componentCls}-rtl`]: {
        direction: 'rtl',

        // Dots
        '.slick-dots': {
          [`${componentCls}-rtl&`]: {
            flexDirection: 'row-reverse',
          },
        },
      },
    },
    {
      [`${componentCls}-vertical`]: {
        '.slick-dots': {
          [`${componentCls}-rtl&`]: {
            flexDirection: 'column',
          },
        },
      },
    },
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Carousel',
  token => [genCarouselStyle(token), genCarouselVerticalStyle(token), genCarouselRtlStyle(token)],
  {
    // FIXME
    carouselDotWidth: 16,
    carouselDotHeight: 3,
    carouselDotActiveWidth: 24,
  },
);
