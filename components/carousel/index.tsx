// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
import assign from 'object-assign';
if (typeof window !== 'undefined') {
  const matchMediaPolyfill = function matchMediaPolyfill() {
    return {
      matches: false,
      addListener() {
      },
      removeListener() {
      },
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
}

import SlickCarousel from 'react-slick';
import * as React from 'react';

export type CarouselEffect = 'scrollx' | 'fade'
// Carousel
export interface CarouselProps {
  /** 动画效果函数，可取 scrollx, fade */
  effect?: CarouselEffect;
  /** 是否显示面板指示点 */
  dots?: SlickCarouselboolean;
  /** 垂直显示 */
  vertical?: boolean;
  /** 是否自动切换 */
  autoplay?: boolean;
  /** 动画效果 */
  easing?: string;
  /** 切换面板的回调 */
  beforeChange?: (from: number, to: number) => void;
  /** 切换面板的回调 */
  afterChange?: (current: number) => void;
  /** 行内样式 */
  style?: React.CSSProperties;
}

export default class Carousel extends React.Component<CarouselProps, any> {
  static defaultProps = {
    dots: true,
    arrows: false,
  };

  render() {
    let props = assign({}, this.props);

    if (props.effect === 'fade') {
      props.fade = true;
      props.draggable = false;
    }

    let className = 'ant-carousel';
    if (props.vertical) {
      className = `${className} ant-carousel-vertical`;
    }

    return (
      <div className={className}>
        <SlickCarousel {...props} />
      </div>
    );
  }
}
