import * as React from 'react';
import classNames from 'classnames';
import Tooltip, { AbstractTooltipProps, TooltipPlacement } from '../tooltip';
import { ConfigContext } from '../config-provider';
import { getRenderPropValue, RenderFunction } from '../_util/getRenderPropValue';
import { getTransitionName } from '../_util/motion';

// CSSINJS
import useStyle from './style';

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  content?: React.ReactNode | RenderFunction;
}

const Popover = React.forwardRef<unknown, PopoverProps>(
  ({ prefixCls: customizePrefixCls, title, content, overlayClassName, ...otherProps }, ref) => {
    const { getPrefixCls, iconPrefixCls } = React.useContext(ConfigContext);

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
    const [wrapSSR, hashId] = useStyle(prefixCls, iconPrefixCls);
    const rootPrefixCls = getPrefixCls();

    const overlayCls = classNames(overlayClassName, hashId);

    return wrapSSR(
      <Tooltip
        {...otherProps}
        prefixCls={prefixCls}
        overlayClassName={overlayCls}
        ref={ref as any}
        overlay={getOverlay(prefixCls)}
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
