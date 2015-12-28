import React from 'react';
import TreeSelect, { TreeNode } from 'rc-tree-select';
import classNames from 'classnames';
import assign from 'object-assign';
import animation from '../common/openAnimation';

const AntTreeSelect = React.createClass({
  getDefaultProps() {
    return {
      prefixCls: 'ant-select',
      transitionName: 'slide-up',
      optionLabelProp: 'value',
      choiceTransitionName: 'zoom',
      showSearch: false,
      size: 'default'
    };
  },
  render() {
    const props = this.props;
    let {
      size, className, combobox, notFoundContent
    } = this.props;

    const cls = classNames({
      'ant-select-lg': size === 'large',
      'ant-select-sm': size === 'small',
      [className]: !!className,
    });

    if (combobox) {
      notFoundContent = null;
    }

    const treeProps = {
      prefixCls: 'ant-tree',
      checkable: false,
      showIcon: false,
      openAnimation: animation
    };
    assign(treeProps, props.treeProps);

    let checkable = treeProps.checkable;
    if (checkable) {
      treeProps.checkable = <span className={`${treeProps.prefixCls}-checkbox-inner`}></span>;
    }

    return (
      <TreeSelect {...this.props}
        treeProps={treeProps}
        className={cls}
        notFoundContent={notFoundContent} />
    );
  }
});

AntTreeSelect.TreeNode = TreeNode;
export default AntTreeSelect;
