import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Menu } from '../../../';
import config from '../../website.config';
const SubMenu = Menu.SubMenu;

function dashed(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
}

export default class MainContent extends React.Component {
  constructor(props) {
    super(props);

    this.generateMenuItem = this.generateMenuItem.bind(this);
  }

  getActiveMenuItem(props, index) {
    const routes = props.routes;
    return routes[routes.length - 1].path || index;
  }

  generateMenuItem(item) {
    const key = dashed(item.english);
    const text = item.chinese || item.english;
    const disabled = item.disabled === 'true';

    const child = !item.link ?
            <Link to={`/${this.props.category}/${key}`} disabled={disabled}>
              { text }
            </Link> :
            <a href={item.link} target="_blank" disabled={disabled}>
              { text }
            </a>;

    return (
      <Menu.Item key={key} disabled={disabled}>
        { child }
      </Menu.Item>
    );
  }

  isNotTopLevel(level) {
    return level !== 'topLevel';
  }

  generateSubMenuItems(obj) {
    const topLevel = (obj.topLevel || []).map(this.generateMenuItem);
    const itemGroups = Object.keys(obj).filter(this.isNotTopLevel)
            .sort((a, b) => {
              return config.typeOrder[a] - config.typeOrder[b];
            })
            .map((type, index) => {
              const groupItems = obj[type].map(this.generateMenuItem);

              return (
                <Menu.ItemGroup title={type} key={index}>
                  { groupItems }
                </Menu.ItemGroup>
              );
            });
    return [...topLevel, ...itemGroups];
  }

  getMenuItems() {
    const props = this.props;
    const menuItems = props.menuItems;
    const topLevel = this.generateSubMenuItems(menuItems.topLevel);
    const subMenu = Object.keys(menuItems).filter(this.isNotTopLevel)
            .sort((a, b) => {
              return config.categoryOrder[a] - config.categoryOrder[b];
            })
            .map((category) => {
              const subMenuItems = this.generateSubMenuItems(menuItems[category]);

              return (
                <SubMenu title={<h4>{category}</h4>} key={category}>
                  { subMenuItems }
                </SubMenu>
              );
            });

    return [...topLevel, ...subMenu];
  }

  flattenMenu(menu) {
    if (menu.type === Menu.Item) {
      return menu;
    }

    if (Array.isArray(menu)) {
      return menu.reduce((acc, item) => {
        return acc.concat(this.flattenMenu(item));
      }, []);
    }

    return this.flattenMenu(menu.props.children);
  }

  getFooterNav(menuItems, activeMenuItem) {
    const menuItemsList = this.flattenMenu(menuItems);
    const activeMenuItemIndex = menuItemsList.findIndex((menuItem) => {
      return menuItem.key === activeMenuItem;
    });
    const prev = menuItemsList[activeMenuItemIndex - 1];
    const next = menuItemsList[activeMenuItemIndex + 1];
    return { prev, next };
  }

  render() {
    const activeMenuItem = this.getActiveMenuItem(this.props);
    const menuItems = this.getMenuItems();
    const { prev, next } = this.getFooterNav(menuItems, activeMenuItem);

    return (
      <div className="main-wrapper">
        <Row>
          <Col span="4">
            <Menu className="sidebar" mode="inline"
                  defaultOpenKeys={Object.keys(this.props.menuItems)}
              selectedKeys={[activeMenuItem]}>
              { menuItems }
            </Menu>
          </Col>
          <Col span="20" className="main-container">
            { this.props.children }
          </Col>
        </Row>

        <Row>
          <Col span="20" offset="4">
            <section className="prev-next-nav">
              {
                !!prev ?
                  React.cloneElement(prev.props.children, { className: 'prev-page' }) :
                  null
              }
              {
                !!next ?
                  React.cloneElement(next.props.children, { className: 'next-page' }) :
                  null
              }
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}
