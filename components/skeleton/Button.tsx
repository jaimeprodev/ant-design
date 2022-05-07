import * as React from 'react';
import omit from 'rc-util/lib/omit';
import classNames from 'classnames';
import type { SkeletonElementProps } from './Element';
import Element from './Element';
import { ConfigContext } from '../config-provider';

export interface SkeletonButtonProps extends Omit<SkeletonElementProps, 'size'> {
  size?: 'large' | 'small' | 'default';
  block?: boolean;
}

const SkeletonButton = (props: SkeletonButtonProps) => {
  const { prefixCls: customizePrefixCls, className, active, block = false } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);

  const otherProps = omit(props, ['prefixCls']);
  const cls = classNames(
    prefixCls,
    `${prefixCls}-element`,
    {
      [`${prefixCls}-active`]: active,
      [`${prefixCls}-block`]: block,
    },
    className,
  );
  return (
    <div className={cls}>
      <Element prefixCls={`${prefixCls}-button`} {...otherProps} />
    </div>
  );
};

SkeletonButton.defaultProps = {
  size: 'default',
};

export default SkeletonButton;
