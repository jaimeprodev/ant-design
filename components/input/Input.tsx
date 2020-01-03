import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import Group from './Group';
import Search from './Search';
import TextArea from './TextArea';
import Password from './Password';
import { Omit } from '../_util/type';
import ClearableLabeledInput, { hasPrefixSuffix } from './ClearableLabeledInput';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import SizeContext, { SizeType } from '../config-provider/SizeContext';
import warning from '../_util/warning';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  prefixCls?: string;
  size?: SizeType;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
}

export function fixControlledValue<T>(value: T) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export function resolveOnChange(
  target: HTMLInputElement | HTMLTextAreaElement,
  e:
    | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>,
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
) {
  if (onChange) {
    let event = e;
    if (e.type === 'click') {
      // click clear icon
      event = Object.create(e);
      event.target = target;
      event.currentTarget = target;
      const originalInputValue = target.value;
      // change target ref value cause e.target.value should be '' when clear input
      target.value = '';
      onChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
      // reset target ref value
      target.value = originalInputValue;
      return;
    }
    onChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
  }
}

export function getInputClassName(
  prefixCls: string,
  size?: SizeType,
  disabled?: boolean,
  direction?: any,
) {
  return classNames(prefixCls, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });
}

export interface InputState {
  value: any;
}

class Input extends React.Component<InputProps, InputState> {
  static Group: typeof Group;

  static Search: typeof Search;

  static TextArea: typeof TextArea;

  static Password: typeof Password;

  static defaultProps = {
    type: 'text',
  };

  input: HTMLInputElement;

  clearableInput: ClearableLabeledInput;

  removePasswordTimeout: number;

  direction: any = 'ltr';

  constructor(props: InputProps) {
    super(props);
    const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    this.state = {
      value,
    };
  }

  static getDerivedStateFromProps(nextProps: InputProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  componentDidMount() {
    this.clearPasswordValueAttribute();
  }

  // Since polyfill `getSnapshotBeforeUpdate` need work with `componentDidUpdate`.
  // We keep an empty function here.
  componentDidUpdate() {}

  getSnapshotBeforeUpdate(prevProps: InputProps) {
    if (hasPrefixSuffix(prevProps) !== hasPrefixSuffix(this.props)) {
      warning(
        this.input !== document.activeElement,
        'Input',
        `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change. Read more: https://ant.design/components/input/#FAQ`,
      );
    }
    return null;
  }

  componentWillUnmount() {
    if (this.removePasswordTimeout) {
      clearTimeout(this.removePasswordTimeout);
    }
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }

  saveClearableInput = (input: ClearableLabeledInput) => {
    this.clearableInput = input;
  };

  saveInput = (input: HTMLInputElement) => {
    this.input = input;
  };

  setValue(value: string, callback?: () => void) {
    if (!('value' in this.props)) {
      this.setState({ value }, callback);
    }
  }

  handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setValue('', () => {
      this.focus();
    });
    resolveOnChange(this.input, e, this.props.onChange);
  };

  renderInput = (prefixCls: string, size?: SizeType) => {
    const { className, addonBefore, addonAfter, size: customizeSize, disabled } = this.props;
    // Fix https://fb.me/react-unknown-prop
    const otherProps = omit(this.props, [
      'prefixCls',
      'onPressEnter',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
      'allowClear',
      // Input elements must be either controlled or uncontrolled,
      // specify either the value prop, or the defaultValue prop, but not both.
      'defaultValue',
      'size',
      'inputType',
    ]);
    return (
      <input
        {...otherProps}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        className={classNames(
          getInputClassName(prefixCls, customizeSize || size, disabled, this.direction),
          {
            [className!]: className && !addonBefore && !addonAfter,
          },
        )}
        ref={this.saveInput}
      />
    );
  };

  clearPasswordValueAttribute = () => {
    // https://github.com/ant-design/ant-design/issues/20541
    this.removePasswordTimeout = setTimeout(() => {
      if (
        this.input &&
        this.input.getAttribute('type') === 'password' &&
        this.input.hasAttribute('value')
      ) {
        this.input.removeAttribute('value');
      }
    });
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setValue(e.target.value, this.clearPasswordValueAttribute);
    resolveOnChange(this.input, e, this.props.onChange);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onPressEnter, onKeyDown } = this.props;
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  renderComponent = ({ getPrefixCls, direction }: ConfigConsumerProps) => {
    const { value } = this.state;
    const { prefixCls: customizePrefixCls } = this.props;
    const prefixCls = getPrefixCls('input', customizePrefixCls);
    this.direction = direction;
    return (
      <SizeContext.Consumer>
        {size => (
          <ClearableLabeledInput
            {...this.props}
            prefixCls={prefixCls}
            inputType="input"
            value={fixControlledValue(value)}
            element={this.renderInput(prefixCls, size)}
            handleReset={this.handleReset}
            ref={this.saveClearableInput}
            direction={direction}
          />
        )}
      </SizeContext.Consumer>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderComponent}</ConfigConsumer>;
  }
}

export default Input;
