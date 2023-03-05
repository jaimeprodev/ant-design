import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import { cloneElement } from '../_util/reactNode';
import warning from '../_util/warning';
import type { BreadcrumbItemProps } from './BreadcrumbItem';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';

import useStyle from './style';
import useItems from './useItems';

/** @deprecated New of Breadcrumb using `items` instead of `routes` */
export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, 'children'>[];
}

export interface BreadcrumbItemType {
  key?: React.Key;
  /**
   * Different with `path`. Directly set the link of this item.
   */
  href?: string;
  /**
   * Different with `href`. It will concat all prev `path` to the current one.
   */
  path?: string;
  title: React.ReactNode;
  menu?: BreadcrumbItemProps['menu'];
  /** @deprecated Please use `menu` instead */
  overlay?: React.ReactNode;
}
export interface BreadcrumbSeparatorType {
  type: 'separator';
  separator?: React.ReactNode;
}

export type ItemType = BreadcrumbItemType | BreadcrumbSeparatorType;

type InternalRouteType = Partial<BreadcrumbItemType & BreadcrumbSeparatorType>;

export interface BaseBreadcrumbProps {
  prefixCls?: string;
  params?: any;
  separator?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  rootClassName?: string;
  children?: React.ReactNode;
}

export interface LegacyBreadcrumbProps extends BaseBreadcrumbProps {
  /** @deprecated Please use `items` instead */
  routes: Route[];

  itemRender?: (route: Route, params: any, routes: Route[], paths: string[]) => React.ReactNode;
}

export interface NewBreadcrumbProps extends BaseBreadcrumbProps {
  items: ItemType[];

  itemRender?: (
    route: ItemType,
    params: any,
    routes: ItemType[],
    paths: string[],
  ) => React.ReactNode;
}

export type BreadcrumbProps = BaseBreadcrumbProps | LegacyBreadcrumbProps | NewBreadcrumbProps;

function getBreadcrumbName(route: InternalRouteType, params: any) {
  if (route.title === undefined) {
    return null;
  }
  const paramsKeys = Object.keys(params).join('|');
  return typeof route.title === 'object'
    ? route.title
    : String(route.title).replace(
        new RegExp(`:(${paramsKeys})`, 'g'),
        (replacement, key) => params[key] || replacement,
      );
}

const getPath = (params: any, path?: string) => {
  if (path === undefined) {
    return path;
  }

  let mergedPath = (path || '').replace(/^\//, '');
  Object.keys(params).forEach((key) => {
    mergedPath = mergedPath.replace(`:${key}`, params[key]!);
  });
  return mergedPath;
};

type CompoundedComponent = React.FC<BreadcrumbProps> & {
  Item: typeof BreadcrumbItem;
  Separator: typeof BreadcrumbSeparator;
};

const Breadcrumb: CompoundedComponent = (props) => {
  const {
    prefixCls: customizePrefixCls,
    separator = '/',
    style,
    className,
    rootClassName,
    routes: legacyRoutes,
    items,
    children,
    itemRender,
    params = {},
    ...restProps
  } = props as LegacyBreadcrumbProps & NewBreadcrumbProps;

  const { getPrefixCls, direction } = React.useContext(ConfigContext);

  let crumbs: React.ReactNode;
  const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);

  const mergedItems = useItems(items, legacyRoutes);

  if (process.env.NODE_ENV !== 'production') {
    warning(!legacyRoutes, 'Breadcrumb', '`routes` is deprecated. Please use `items` instead.');
  }

  const mergedItemRender =
    itemRender ||
    ((route: BreadcrumbItemType) => {
      const name = getBreadcrumbName(route, params);

      return name;
    });

  if (mergedItems && mergedItems.length > 0) {
    // generated by route
    const paths: string[] = [];

    const itemRenderRoutes: any = items || legacyRoutes;

    crumbs = mergedItems.map((item, index) => {
      const { path, key, type, menu, overlay, separator: itemSeparator } = item;
      const mergedPath = getPath(params, path);

      if (mergedPath !== undefined) {
        paths.push(mergedPath);
      }

      const mergedKey = key ?? index;

      if (type === 'separator') {
        return <BreadcrumbSeparator key={mergedKey}>{itemSeparator}</BreadcrumbSeparator>;
      }

      const itemProps: BreadcrumbItemProps = {};
      const isLastItem = index === mergedItems.length - 1;

      if (menu) {
        itemProps.menu = menu;
      } else if (overlay) {
        itemProps.overlay = overlay as any;
      }

      let { href } = item;
      if (paths.length && mergedPath !== undefined) {
        href = `#/${paths.join('/')}`;
      }

      return (
        <BreadcrumbItem
          key={mergedKey}
          {...itemProps}
          {...pickAttrs(item, {
            data: true,
            aria: true,
          })}
          href={href}
          separator={isLastItem ? '' : separator}
        >
          {mergedItemRender(item as BreadcrumbItemType, params, itemRenderRoutes, paths)}
        </BreadcrumbItem>
      );
    });
  } else if (children) {
    const childrenLength = toArray(children).length;
    crumbs = toArray(children).map((element: any, index) => {
      if (!element) {
        return element;
      }
      // =================== Warning =====================
      if (process.env.NODE_ENV !== 'production') {
        warning(
          !element,
          'Breadcrumb',
          '`Breadcrumb.Item and Breadcrumb.Separator` is deprecated. Please use `items` instead.',
        );
      }
      warning(
        element.type &&
          (element.type.__ANT_BREADCRUMB_ITEM === true ||
            element.type.__ANT_BREADCRUMB_SEPARATOR === true),
        'Breadcrumb',
        "Only accepts Breadcrumb.Item and Breadcrumb.Separator as it's children",
      );
      const isLastItem = index === childrenLength - 1;
      return cloneElement(element, {
        separator: isLastItem ? '' : separator,
        key: index,
      });
    });
  }

  const breadcrumbClassName = classNames(
    prefixCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    className,
    rootClassName,
    hashId,
  );

  return wrapSSR(
    <nav className={breadcrumbClassName} style={style} {...restProps}>
      <ol>{crumbs}</ol>
    </nav>,
  );
};

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

if (process.env.NODE_ENV !== 'production') {
  Breadcrumb.displayName = 'Breadcrumb';
}

export default Breadcrumb;
