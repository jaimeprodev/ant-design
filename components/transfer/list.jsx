import React, { Component, PropTypes } from 'react';
import Checkbox from '../checkbox';
import Search from './search.jsx';
import {classSet} from 'rc-util';
function noop() {
}

class TransferList extends Component {

  constructor(props) {
    super(props);
  }

  handleSelectALl() {
    this.props.handleSelectAll();
  }

  handleSelect(selectedItem) {
    const { checkedKeys } = this.props;
    const result = checkedKeys.some((key) => key === selectedItem.key);
    this.props.handleSelect(selectedItem, !result);
  }

  handleFilter(e) {
    this.props.handleFilter(e);
  }

  handleClear() {
    this.props.handleClear();
  }

  renderCheckbox(props) {
    const { prefixCls } = props;
    const checkboxCls = {
      [`${prefixCls}-checkbox`]: true,
    };
    if (props.checkPart) {
      checkboxCls[`${prefixCls}-checkbox-indeterminate`] = true;
    } else if (props.checked) {
      checkboxCls[`${prefixCls}-checkbox-checked`] = true;
    }
    let customEle = null;
    if (typeof props.checkable !== 'boolean') {
      customEle = props.checkable;
    }
    if (props.disabled) {
      checkboxCls[`${prefixCls}-checkbox-disabled`] = true;
      return <span ref="checkbox" className={classSet(checkboxCls)}>{customEle}</span>;
    }
    return (<span ref="checkbox" className={classSet(checkboxCls)} onClick={this.handleSelectALl.bind(this)}>{customEle}</span>);
  }

  matchFilter(text, filterText) {
    const regex = new RegExp(filterText);
    return text.match(regex);
  }

  render() {
    let self = this;
    const { prefixCls, dataSource, titleText, filter, height, width, checkedKeys, checkStatus, body, footer, showSearch } = this.props;

    // Custom Layout
    const footerDom = footer({...this.props});
    const bodyDom = body({...this.props});

    return (<div className={prefixCls} {...this.props} style={{width: width}}>
      <div className={`${prefixCls}-header`}>
        {this.renderCheckbox({
          prefixCls: 'ant-transfer',
          checked: checkStatus === 'all',
          checkPart: checkStatus === 'part',
          checkable: <span className={`ant-transfer-checkbox-inner`}></span>
        })}<span className={`${prefixCls}-header-selected`}><span>{(checkedKeys.length > 0 ? checkedKeys.length + '/' : '') + dataSource.length} 条</span>
        <span className={`${prefixCls}-header-title`}>{titleText}</span></span>
      </div>
      { bodyDom ? bodyDom :
      <div className={ showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`} style={{height: height}}>
        { showSearch ? <div className={`${prefixCls}-body-search-wrapper`}>
          <Search className={`${prefixCls}-body-search-bar`} onChange={this.handleFilter.bind(this)} handleClear={this.handleClear.bind(this)} value={filter} />
        </div> : null }
        <ul>
          { dataSource.length > 0 ?
            dataSource.map((item)=> {
              // apply filter
              const itemText = self.props.render(item);
              const filterResult = self.matchFilter(itemText, filter);

              const renderedText = self.props.render(item);

              if ( filterResult ) {
                return <li onClick={this.handleSelect.bind(this, item)} key={item.key} title={renderedText}>
                  <Checkbox checked={checkedKeys.some((key) => key === item.key)} />
                  { renderedText }
                </li>;
              }
            }) : <div className={`${prefixCls}-body-not-found`}>
            Not Found
          </div>
            }
        </ul>
      </div>}
      { footerDom ? <div className={`${prefixCls}-footer`}>
        { footerDom }
      </div> : null }
    </div>);
  }
}

TransferList.defaultProps = {
  prefixCls: 'ant-transfer-list',
  dataSource: [],
  titleText: '',
  showSearch: false,
  searchPlaceholder: '',
  width: 160,
  handleFilter: noop,
  handleSelect: noop,
  handleSelectAll: noop,
  render: noop,
  //advanced
  body: noop,
  footer: noop,
};

TransferList.propTypes = {
  prefixCls: PropTypes.string,
  dataSource: PropTypes.array,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  titleText: PropTypes.string,
  width: PropTypes.number,
  handleFilter: PropTypes.func,
  handleSelect: PropTypes.func,
  handleSelectAll: PropTypes.func,
  render: PropTypes.func,
  body: PropTypes.func,
  footer: PropTypes.func,
};

export default TransferList;
