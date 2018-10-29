import * as React from 'react';
import classNames from 'classnames';

export interface CommentProps {
  /** List of action items rendered below the comment content */
  actions?: Array<React.ReactNode>;
  /** The element to display as the comment author. */
  author?: string;
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar?: React.ReactNode;
  /** className of comment */
  className?: string;
  /** The main content of the comment */
  content: React.ReactNode;
  /** Nested comments should be provided as children of the Comment */
  children?: any;
  /** Optional ID for the comment */
  id?: string;
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls?: string;
  /** Additional style for the comment */
  style?: React.CSSProperties;
  /** A datetime element containing the time to be displayed */
  datetime?: React.ReactNode;
  /** Direction of the comment left or right */
  direction?: 'left' | 'right';
}

export default class Comment extends React.Component<CommentProps, {}> {
  getAction(actions: React.ReactNode[]) {
    if (!actions || !actions.length) {
      return null;
    }
    const actionList = actions.map((action, index) => (
        <li key={`action-${index}`}>
          <span>{action}</span>
        </li>
      ),
    );
    return actionList;
  }

  renderNested = (child: any) => {
    const { prefixCls = 'ant-comment' } = this.props;
    const classString = classNames(`${prefixCls}-nested`);

    return (
      <div key={child.key} className={classString}>
        {child}
      </div>
    )
  }

  render() {
    const {
      actions,
      author,
      avatar,
      children,
      className,
      content,
      direction = 'left',
      prefixCls = 'ant-comment',
      style = {},
      datetime,
      ...otherProps
    } = this.props;

    const classString = classNames(prefixCls, className, {
      [`${prefixCls}-rtl`]: direction === 'left',
      [`${prefixCls}-ltr`]: direction === 'right',
    });

    const authorElements = [];

    if (author) {
      authorElements.push(
        <span key="name" className={`${prefixCls}-content-author-name`}>
          {author}
        </span>,
      );
    }

    if (datetime) {
      authorElements.push(
        <span key="time" className={`${prefixCls}-content-author-time`}>{datetime}</span>,
      );
    }

    const avatarDom = (
      <div key="avatar" className={`${prefixCls}-avatar`}>
        {typeof avatar === 'string' ? <img src={avatar} /> : avatar}
      </div>
    );

    const actionDom = actions && actions.length
      ? <ul className={`${prefixCls}-actions`}>{this.getAction(actions)}</ul>
      : null;

    const authorContent = (
      <div className={`${prefixCls}-content-author`}>
        {direction === 'left' ? authorElements : authorElements.reverse()}
      </div>
    );

    const contentDom = (
      <div key="content" className={`${prefixCls}-content`}>
        {authorContent}
        <div className={`${prefixCls}-content-detail`}>
          {content}
        </div>
        {actionDom}
      </div>
    );

    const comment = (
      <div {...otherProps} className={classString} style={style}>
        <div className={`${prefixCls}-inner`}>
          {direction === 'left'
            ? [avatarDom, contentDom]
            : [contentDom, avatarDom]
          }
        </div>
      </div>
    )

    const nestedComments =
      React.Children
        .toArray(children)
        .map((child: React.ReactElement<any>) => this.renderNested(child))

    return (
      <div>
        {comment}
        {nestedComments}
      </div>
    );
  }
}
