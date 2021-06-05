import * as React from 'react';
import classNames from 'classnames';
import CSSMotion, { CSSMotionList } from 'rc-motion';
import { FormItemPrefixContext } from './context';
import { ConfigContext } from '../config-provider';
import { ValidateStatus } from './FormItem';
import collapseMotion from '../_util/motion';

const EMPTY_LIST: React.ReactNode[] = [];

interface ErrorEntity {
  error: React.ReactNode;
  errorStatus?: ValidateStatus;
  key: string;
}

function toErrorEntity(
  error: React.ReactNode,
  errorStatus: ValidateStatus | undefined,
  prefix: string,
  index: number = 0,
): ErrorEntity {
  return {
    key: typeof error === 'string' ? error : `${prefix}-${index}`,
    error,
    errorStatus,
  };
}

export interface ErrorListProps {
  help?: React.ReactNode;
  helpStatus?: ValidateStatus;
  errors?: React.ReactNode[];
  warnings?: React.ReactNode[];
}

export default function ErrorList({
  help,
  helpStatus,
  errors = EMPTY_LIST,
  warnings = EMPTY_LIST,
}: ErrorListProps) {
  const { prefixCls } = React.useContext(FormItemPrefixContext);
  const { getPrefixCls } = React.useContext(ConfigContext);

  const baseClassName = `${prefixCls}-item-explain`;
  const rootPrefixCls = getPrefixCls();

  const fullKeyList = React.useMemo(() => {
    if (help !== undefined && help !== null) {
      return [toErrorEntity(help, helpStatus, 'help')];
    }

    return [
      ...errors.map((error, index) => toErrorEntity(error, 'error', 'error', index)),
      ...warnings.map((warning, index) => toErrorEntity(warning, 'warning', 'warning', index)),
    ];
  }, [help, helpStatus, errors, warnings]);

  return (
    <CSSMotion
      {...collapseMotion}
      motionName={`${rootPrefixCls}-show-help`}
      motionAppear={false}
      motionEnter={false}
      motionLeave
      visible={!!fullKeyList.length}
      removeOnLeave
      onLeaveStart={node => {
        // Force disable css override style in index.less configured
        node.style.height = 'auto';
        return { height: node.offsetHeight };
      }}
    >
      {holderProps => {
        const { className: holderClassName, style: holderStyle } = holderProps;

        return (
          <div className={classNames(baseClassName, holderClassName)} style={holderStyle}>
            <CSSMotionList
              keys={fullKeyList}
              {...collapseMotion}
              motionName={`${rootPrefixCls}-show-help-item`}
              component={false}
            >
              {itemProps => {
                const {
                  key,
                  error,
                  errorStatus,
                  className: itemClassName,
                  style: itemStyle,
                } = itemProps;

                return (
                  <div
                    key={key}
                    role="alert"
                    className={classNames(itemClassName, {
                      [`${baseClassName}-${errorStatus}`]: errorStatus,
                    })}
                    style={itemStyle}
                  >
                    {error}
                  </div>
                );
              }}
            </CSSMotionList>
          </div>
        );
      }}
    </CSSMotion>
  );
}
