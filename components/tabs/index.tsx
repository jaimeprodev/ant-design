import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RcTabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import TabBar from './TabBar';
import classNames from 'classnames';
import Icon from '../icon';
import warning from '../_util/warning';
import isFlexSupported from '../_util/isFlexSupported';

export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TabsProps {
  activeKey?: string;
  defaultActiveKey?: string;
  hideAdd?: boolean;
  onChange?: (activeKey: string) => void;
  onTabClick?: Function;
  onPrevClick?: React.MouseEventHandler<any>;
  onNextClick?: React.MouseEventHandler<any>;
  tabBarExtraContent?: React.ReactNode | null;
  tabBarStyle?: React.CSSProperties;
  type?: TabsType;
  tabPosition?: TabsPosition;
  onEdit?: (targetKey: string | React.MouseEvent<HTMLElement>, action: any) => void;
  size?: 'large' | 'default' | 'small';
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  animated?: boolean | { inkBar: boolean; tabPane: boolean; };
  tabBarGutter?: number;
  renderTabBar?: (props: TabsProps, DefaultTabBar: React.ReactNode) => React.ReactElement<any>;
}

// Tabs
export interface TabPaneProps {
  /** 选项卡头显示文字 */
  tab?: React.ReactNode | string;
  style?: React.CSSProperties;
  closable?: boolean;
  className?: string;
  disabled?: boolean;
  forceRender?: boolean;
  key?: string;
}

export default class Tabs extends React.Component<TabsProps, any> {
  static TabPane = TabPane as React.ClassicComponentClass<TabPaneProps>;

  static defaultProps = {
    prefixCls: 'ant-tabs',
    hideAdd: false,
  };

  removeTab = (targetKey: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!targetKey) {
      return;
    }

    const onEdit = this.props.onEdit;
    if (onEdit) {
      onEdit(targetKey, 'remove');
    }
  }

  handleChange = (activeKey: string) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(activeKey);
    }
  }

  createNewTab = (targetKey: React.MouseEvent<HTMLElement>) => {
    const { onEdit } = this.props;
    if (onEdit) {
      onEdit(targetKey, 'add');
    }
  }

  componentDidMount() {
    const NO_FLEX = ' no-flex';
    const tabNode = ReactDOM.findDOMNode(this) as Element;
    if (tabNode && !isFlexSupported() && tabNode.className.indexOf(NO_FLEX) === -1) {
      tabNode.className += NO_FLEX;
    }
  }

  render() {
    let {
      prefixCls,
      className = '',
      size,
      type = 'line',
      tabPosition,
      children,
      animated = true,
      tabBarExtraContent,
      hideAdd,
    } = this.props;

    let tabPaneAnimated = typeof animated === 'object' ? animated.tabPane : animated;

    // card tabs should not have animation
    if (type !== 'line') {
      tabPaneAnimated = 'animated' in this.props ? tabPaneAnimated : false;
    }

    warning(
      !(type.indexOf('card') >= 0 && (size === 'small' || size === 'large')),
      'Tabs[type=card|editable-card] doesn\'t have small or large size, it\'s by design.',
    );
    const cls = classNames(className, {
      [`${prefixCls}-vertical`]: tabPosition === 'left' || tabPosition === 'right',
      [`${prefixCls}-${size}`]: !!size,
      [`${prefixCls}-card`]: type.indexOf('card') >= 0,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-no-animation`]: !tabPaneAnimated,
    });
    // only card type tabs can be added and closed
    let childrenWithClose: React.ReactElement<any>[] = [];
    if (type === 'editable-card') {
      childrenWithClose = [];
      React.Children.forEach(children as React.ReactNode, (child: React.ReactElement<any>, index) => {
        let closable = child.props.closable;
        closable = typeof closable === 'undefined' ? true : closable;
        const closeIcon = closable ? (
          <Icon
            type="close"
            className={`${prefixCls}-close-x`}
            onClick={e => this.removeTab(child.key as string, e)}
          />
        ) : null;
        childrenWithClose.push(React.cloneElement(child, {
          tab: (
            <div className={closable ? undefined : `${prefixCls}-tab-unclosable`}>
              {child.props.tab}
              {closeIcon}
            </div>
          ),
          key: child.key || index,
        }));
      });
      // Add new tab handler
      if (!hideAdd) {
        tabBarExtraContent = (
          <span>
            <Icon type="plus" className={`${prefixCls}-new-tab`} onClick={this.createNewTab} />
            {tabBarExtraContent}
          </span>
        );
      }
    }

    tabBarExtraContent = tabBarExtraContent ? (
      <div className={`${prefixCls}-extra-content`}>
        {tabBarExtraContent}
      </div>
    ) : null;

    const { className: dropped, ...tabBarProps } = this.props;

    return (
      <RcTabs
        {...this.props}
        className={cls}
        tabBarPosition={tabPosition}
        renderTabBar={() => <TabBar {...tabBarProps} tabBarExtraContent={tabBarExtraContent}/>}
        renderTabContent={() => <TabContent animated={tabPaneAnimated} animatedWithMargin />}
        onChange={this.handleChange}
      >
        {childrenWithClose.length > 0 ? childrenWithClose : children}
      </RcTabs>
    );
  }
}
