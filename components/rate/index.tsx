import * as React from 'react';
import RcRate from 'rc-rate';
import StarFilled from '@ant-design/icons/StarFilled';
import type { RateProps as RcRateProps } from 'rc-rate/lib/Rate';

import Tooltip from '../tooltip';
import { ConfigContext } from '../config-provider';

export interface RateProps extends RcRateProps {
  tooltips?: Array<string>;
}

interface RateNodeProps {
  index: number;
}

const Rate = React.forwardRef<unknown, RateProps>(({ prefixCls, tooltips, ...props }, ref) => {
  const characterRender = (node: React.ReactElement, { index }: RateNodeProps) => {
    if (!tooltips) return node;
    return <Tooltip title={tooltips[index]}>{node}</Tooltip>;
  };

  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const ratePrefixCls = getPrefixCls('rate', prefixCls);

  return (
    <RcRate
      ref={ref}
      characterRender={characterRender}
      {...props}
      prefixCls={ratePrefixCls}
      direction={direction}
    />
  );
});

Rate.displayName = 'Rate';

Rate.defaultProps = {
  character: <StarFilled />,
};

export default Rate;
