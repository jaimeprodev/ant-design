import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import { polyfill } from 'react-lifecycles-compat';
import Icon from '../icon';
import CheckableTag from './CheckableTag';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import { PresetColorTypes } from '../_util/colors';
import Wave from '../_util/wave';

export { CheckableTagProps } from './CheckableTag';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefixCls?: string;
  className?: string;
  color?: string;
  closable?: boolean;
  visible?: boolean;
  onClose?: Function;
  style?: React.CSSProperties;
}

interface TagState {
  visible: boolean;
}

const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);

class Tag extends React.Component<TagProps, TagState> {
  static CheckableTag = CheckableTag;
  static defaultProps = {
    closable: false,
  };

  static getDerivedStateFromProps(nextProps: TagProps) {
    if ('visible' in nextProps) {
      return {
        visible: nextProps.visible,
      };
    }
    return null;
  }

  state = {
    visible: true,
  };

  setVisible(visible: boolean, e: React.MouseEvent<HTMLElement>) {
    const { onClose } = this.props;
    if (onClose) {
      onClose(e);
    }

    if (e.defaultPrevented) {
      return;
    }
    if (!('visible' in this.props)) {
      this.setState({ visible });
    }
  }

  handleIconClick = (e: React.MouseEvent<HTMLElement>) => {
    this.setVisible(false, e);
  };

  isPresetColor(color?: string): boolean {
    if (!color) {
      return false;
    }
    return PresetColorRegex.test(color);
  }

  getTagStyle() {
    const { color, style } = this.props;
    const isPresetColor = this.isPresetColor(color);
    return {
      backgroundColor: color && !isPresetColor ? color : undefined,
      ...style,
    };
  }

  getTagClassName({ getPrefixCls }: ConfigConsumerProps) {
    const { prefixCls: customizePrefixCls, className, color } = this.props;
    const { visible } = this.state;
    const isPresetColor = this.isPresetColor(color);
    const prefixCls = getPrefixCls('tag', customizePrefixCls);
    return classNames(
      prefixCls,
      {
        [`${prefixCls}-${color}`]: isPresetColor,
        [`${prefixCls}-has-color`]: color && !isPresetColor,
        [`${prefixCls}-hidden`]: !visible,
      },
      className,
    );
  }

  renderCloseIcon() {
    const { closable } = this.props;
    return closable ? <Icon type="close" onClick={this.handleIconClick} /> : null;
  }

  renderTag = (configProps: ConfigConsumerProps) => {
    const { prefixCls: customizePrefixCls, children, ...otherProps } = this.props;
    const isNeedWave =
      'onClick' in otherProps || (children && (children as React.ReactElement<any>).type === 'a');
    const tagProps = omit(otherProps, ['onClose', 'afterClose', 'color', 'visible', 'closable']);
    return isNeedWave ? (
      <Wave>
        <span
          {...tagProps}
          className={this.getTagClassName(configProps)}
          style={this.getTagStyle()}
        >
          {children}
          {this.renderCloseIcon()}
        </span>
      </Wave>
    ) : (
      <span {...tagProps} className={this.getTagClassName(configProps)} style={this.getTagStyle()}>
        {children}
        {this.renderCloseIcon()}
      </span>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderTag}</ConfigConsumer>;
  }
}

polyfill(Tag);

export default Tag;
