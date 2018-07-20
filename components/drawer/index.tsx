import * as React from 'react';
import RcDrawer from 'rc-drawer';
import PropTypes from 'prop-types';
import createReactContext, { Context } from 'create-react-context';

const DrawerContext: Context<Drawer | null> = createReactContext(null);

type EventType =
  | React.MouseEvent<HTMLDivElement>
  | React.MouseEvent<HTMLButtonElement>;

type getContainerfunc = () => HTMLElement;

export interface DrawerProps {
  closable?: boolean;
  destroyOnClose?: boolean;
  getContainer?: string | HTMLElement | getContainerfunc;
  maskClosable?: boolean;
  mask?: boolean;
  maskStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  visible?: boolean;
  width?: number | string;
  wrapClassName?: string;
  zIndex?: number;
  prefixCls?: string;
  push?: boolean;
  placement?: 'left' | 'right';
  onClose?: (e: EventType) => void;
}

export interface IDrawerState {
  push?: boolean;
}

export default class Drawer extends React.Component<DrawerProps, IDrawerState> {
  static propTypes = {
    closable: PropTypes.bool,
    destroyOnClose: PropTypes.bool,
    getContainer: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.func,
      PropTypes.bool,
    ]),
    maskClosable: PropTypes.bool,
    mask: PropTypes.bool,
    maskStyle: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.node,
    visible: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    wrapClassName: PropTypes.string,
    zIndex: PropTypes.number,
    prefixCls: PropTypes.string,
    placement: PropTypes.string,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'ant-drawer',
    width: 256,
    closable: true,
    placement: 'right',
    maskClosable: true,
    level: null,
  };

  readonly state = {
    push: false,
  };

  praentDrawer: Drawer;
  destoryClose: boolean;
  public componentDidUpdate(preProps: DrawerProps) {
    if (preProps.visible !== this.props.visible && this.praentDrawer) {
      if (this.props.visible) {
        this.praentDrawer.push();
      } else {
        this.praentDrawer.pull();
      }
    }
  }
  close = (e: EventType) => {
    if (this.props.visible !== undefined) {
      if (this.props.onClose) {
        this.props.onClose(e);
      }
      return;
    }
  }
  onMaskClick = (e: EventType) => {
    if (!this.props.maskClosable) {
      return;
    }
    this.close(e);
  }
  push = () => {
    this.setState({
      push: true,
    });
  }
  pull = () => {
    this.setState({
      push: false,
    });
  }
  onDestoryTransitionEnd = () => {
    const { destroyOnClose, visible } = this.props;
    const isDestroyOnClose = destroyOnClose && !visible;
    if (!isDestroyOnClose) {
      return;
    }
    if (!this.props.visible) {
      this.destoryClose = true;
      this.forceUpdate();
    }
  }
  renderBody = () => {
    if (this.destoryClose && !this.props.visible) {
      return null;
    }
    this.destoryClose = false;
    const { destroyOnClose, visible, placement } = this.props;
    const containerStyle: React.CSSProperties = placement === 'left'
      || placement === 'right' ? {
        overflow: 'auto',
        height: '100%',
      } : {};
    const isDestroyOnClose = destroyOnClose && !visible;
    if (isDestroyOnClose) {
      // 增加透明渐变，跟关闭的动画时间相同，在关闭后删除子元素；
      containerStyle.opacity = 0;
      containerStyle.transition = 'opacity .3s';
    }
    const { prefixCls, title, closable } = this.props;
    let header;
    if (title) {
      header = (
        <div className={`${prefixCls}-header`}>
          <div className={`${prefixCls}-title`}>{title}</div>
        </div>
      );
    }
    let closer;
    if (closable) {
      closer = (
        <button
          onClick={this.close}
          aria-label="Close"
          className={`${prefixCls}-close`}
        >
          <span className={`${prefixCls}-close-x`} />
        </button>
      );
    }

    return (
      <div
        style={containerStyle}
        onTransitionEnd={this.onDestoryTransitionEnd}
      >
        {header}
        {closer}
        <div className={`${prefixCls}-body`} style={this.props.style}>
          {this.props.children}
        </div>
      </div>
    );
  }
  renderProvider = (value: Drawer) => {
    let { zIndex, style, placement, ...rest } = this.props;
    const RcDrawerStyle = this.state.push
      ? {
        zIndex,
        transform: `translateX(${placement === 'left' ? 180 : -180}px)`,
      }
      : { zIndex };
    this.praentDrawer = value;
    return (
      <DrawerContext.Provider value={this}>
        <RcDrawer
          {...rest}
          handler={false}
          open={this.props.visible}
          onMaskClick={this.onMaskClick}
          showMask={this.props.mask}
          placement={placement}
          style={RcDrawerStyle}
          class={this.props.wrapClassName}
        >
          {this.renderBody()}
        </RcDrawer>
      </DrawerContext.Provider>
    );
  }
  render() {
    return (
      <DrawerContext.Consumer>{this.renderProvider}</DrawerContext.Consumer>
    );
  }
}
