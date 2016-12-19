import React from 'react';
import classNames from 'classnames';

export interface CardProps {
  prefixCls?: string;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  loading?: boolean;
  children?: any;
  id?: string;
  className?: string;
}

export default (props: CardProps) => {
  const {
    prefixCls = 'ant-card', className, extra, bodyStyle,
    title, loading, bordered = true, ...others,
  } = props;
  let children = props.children;
  const classString = classNames(prefixCls, className, {
    [`${prefixCls}-loading`]: loading,
    [`${prefixCls}-bordered`]: bordered,
  });

  if (loading) {
    children = (
      <div>
        <p>████████████████████████</p>
        <p>██████　███████████████████</p>
        <p>██████████████　██████████</p>
        <p>█████　██████　█████████████</p>
        <p>███████████　██████████　███</p>
      </div>
    );
  }

  let head;
  if (!title) {
    head = null;
  } else {
    head = typeof title === 'string' ? (
      <div className={`${prefixCls}-head`}>
        <h3 className={`${prefixCls}-head-title`}>{title}</h3>
      </div>
    ) : (
      <div className={`${prefixCls}-head`}>
        <div className={`${prefixCls}-head-title`}>{title}</div>
      </div>
    );
  }

  return (
    <div {...others} className={classString}>
      {head}
      {extra ? <div className={`${prefixCls}-extra`}>{extra}</div> : null}
      <div className={`${prefixCls}-body`} style={bodyStyle}>{children}</div>
    </div>
  );
};
