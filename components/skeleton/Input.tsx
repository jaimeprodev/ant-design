import * as React from 'react';
import omit from 'rc-util/lib/omit';
import classNames from 'classnames';
import Element, { SkeletonElementProps } from './Element';
import { ConfigContext } from '../config-provider';
import useStyle from './style';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default';
  block?: boolean;
}

const SkeletonInput = (props: SkeletonInputProps) => {
  const { prefixCls: customizePrefixCls, className, active, block } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);

  const otherProps = omit(props, ['prefixCls']);
  const cls = classNames(
    prefixCls,
    `${prefixCls}-element`,
    {
      [`${prefixCls}-active`]: active,
      [`${prefixCls}-block`]: block,
    },
    className,
    hashId,
  );

  return wrapSSR(
    <div className={cls}>
      <Element prefixCls={`${prefixCls}-input`} {...otherProps} />
    </div>,
  );
};

SkeletonInput.defaultProps = {
  size: 'default',
};

export default SkeletonInput;
