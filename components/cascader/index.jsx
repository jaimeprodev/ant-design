import React from 'react';
import Cascader from 'rc-cascader';
import Input from '../input';
import arrayTreeFilter from 'array-tree-filter';
import classNames from 'classnames';

class AntCascader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
    };
    [
      'handleChange',
      'getLabel',
    ].forEach((method) => this[method] = this[method].bind(this));
  }
  handleChange(value, selectedOptions) {
    this.setState({ value });
    this.props.onChange(value, selectedOptions);
  }
  getLabel() {
    const { options, displayRender } = this.props;
    const label = arrayTreeFilter(options, (o, level) => o.value === this.state.value[level])
      .map(o => o.label);
    return displayRender(label);
  }
  render() {
    const { prefixCls, children, placeholder, style, size } = this.props;
    const sizeCls = classNames({
      'ant-input-lg': size === 'large',
      'ant-input-sm': size === 'small',
    });
    return (
      <Cascader {...this.props} onChange={this.handleChange}>
        {children ||
          <Input placeholder={placeholder}
            className={`${prefixCls}-input ant-input ${sizeCls}`}
            style={style}
            value={this.getLabel()}
            readOnly />}
      </Cascader>
    );
  }
}

AntCascader.defaultProps = {
  prefixCls: 'ant-cascader',
  placeholder: '请选择',
  transitionName: 'slide-up',
  onChange() {},
  options: [],
  displayRender(label) {
    return label.join(' / ');
  },
  size: 'default',
};

export default AntCascader;
