import React from 'react';
import classNames from 'classnames';
import Input, { InputProps } from './Input';
import Icon from '../icon';

export interface SearchProps extends InputProps {
  onSearch?: (value: string) => any;
}

export default class Search extends React.Component<SearchProps, any> {
  static defaultProps = {
    prefixCls: 'ant-input-search',
  };

  input: Input;

  onSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(this.input.input.value);
    }
    this.input.focus();
  }

  saveInput = (node) => {
    this.input = node;
  }

  render() {
    const { className, prefixCls, ...others } = this.props;
    delete (others as any).onSearch;
    const searchSuffix = (
      <Icon
        className={`${prefixCls}-icon`}
        onClick={this.onSearch}
        type="search"
      />
    );
    return (
      <Input
        onPressEnter={this.onSearch}
        {...others}
        className={classNames(prefixCls, className)}
        suffix={searchSuffix}
        ref={this.saveInput}
      />
    );
  }
}
