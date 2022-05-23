import classNames from 'classnames';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import type { AbstractTooltipProps, TooltipPlacement } from '../tooltip';
import Tooltip from '../tooltip';
import type { RenderFunction } from '../_util/getRenderPropValue';
import { getRenderPropValue } from '../_util/getRenderPropValue';
import { getTransitionName } from '../_util/motion';
// CSSINJS
import useStyle from './style';

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  content?: React.ReactNode | RenderFunction;
  /** @private Used for Popconfirm. Safe to remove. */
  _overlay?: React.ReactNode;
}

const Popover = React.forwardRef<unknown, PopoverProps>(
  (
    { prefixCls: customizePrefixCls, title, content, overlayClassName, _overlay, ...otherProps },
    ref,
  ) => {
    const { getPrefixCls } = React.useContext(ConfigContext);

    const getOverlay = (prefixCls: string) => {
      if (!title && !content) return undefined;
      return (
        <>
          {title && <div className={`${prefixCls}-title`}>{getRenderPropValue(title)}</div>}
          <div className={`${prefixCls}-inner-content`}>{getRenderPropValue(content)}</div>
        </>
      );
    };

    const prefixCls = getPrefixCls('popover', customizePrefixCls);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootPrefixCls = getPrefixCls();

    const overlayCls = classNames(overlayClassName, hashId);

    return wrapSSR(
      <Tooltip
        {...otherProps}
        prefixCls={prefixCls}
        overlayClassName={overlayCls}
        ref={ref as any}
        overlay={_overlay || getOverlay(prefixCls)}
        transitionName={getTransitionName(rootPrefixCls, 'zoom-big', otherProps.transitionName)}
      />,
    );
  },
);

Popover.displayName = 'Popover';

Popover.defaultProps = {
  placement: 'top' as TooltipPlacement,
  trigger: 'hover',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
  overlayStyle: {},
};

export default Popover;
