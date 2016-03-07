import React from 'react';
import classNames from 'classnames';
import { Row, Col, Icon } from '../../../';
import Demo from '../Demo';
import * as utils from '../utils';
import demosList from '../../../_site/data/demos-list';

export default class ComponentDoc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandAll: false,
    };
  }

  handleExpandToggle() {
    this.setState({
      expandAll: !this.state.expandAll,
    });
  }

  render() {
    const { doc } = this.props;
    const { description, meta } = doc;
    const demos = demosList[meta.fileName] || [];
    const expand = this.state.expandAll;

    const parentId = meta.fileName.split('/').slice(0, 2).join('-');
    const isSingleCol = meta.cols === '1';
    const leftChildren = [];
    const rightChildren = [];
    demos.sort((a, b) => {
      return a.order - b.order;
    }).forEach((demoData, index) => {
      if (index % 2 === 0 || isSingleCol) {
        leftChildren.push(<Demo {...demoData} expand={expand} key={index} parentId={parentId} />);
      } else {
        rightChildren.push(<Demo {...demoData} expand={expand} key={index} parentId={parentId} />);
      }
    });
    const expandTriggerClass = classNames({
      'code-box-expand-trigger': true,
      'code-box-expand-trigger-active': expand,
    });

    const jumper = demos.map((demo) => {
      return (
        <li key={demo.id}>
          <a href={`#${parentId}-${demo.id}`}>{ demo.title }</a>
        </li>
      );
    });

    return (
      <article>
        <ul className="toc demos-anchor">
          { jumper }
        </ul>
        <section className="markdown">
          <h1>{meta.chinese || meta.english}</h1>
          { description.map(utils.objectToComponent) }
          <h2>
            代码演示
            <Icon type="appstore" className={expandTriggerClass}
              title="展开全部代码" onClick={this.handleExpandToggle.bind(this)} />
          </h2>
        </section>
        <Row>
          <Col span={ isSingleCol ? '24' : '12' } className={ isSingleCol ? '' : 'demo-list-left'}>
            { leftChildren }
          </Col>
          { isSingleCol ? null : <Col className="demo-list-right" span="12">{ rightChildren }</Col> }
        </Row>
        <section className="markdown">
          { (doc.api || []).map(utils.objectToComponent) }
        </section>
      </article>
    );
  }
}
