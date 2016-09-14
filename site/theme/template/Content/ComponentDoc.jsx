import React from 'react';
import DocumentTitle from 'react-document-title';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Row, Col, Icon, Affix } from 'antd';
import { getChildren } from 'jsonml.js/lib/utils';
import Demo from './Demo';
import EditButton from './EditButton';

export default class ComponentDoc extends React.Component {
  static contextTypes = {
    intl: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      expandAll: false,
    };
  }

  handleExpandToggle = () => {
    this.setState({
      expandAll: !this.state.expandAll,
    });
  }

  render() {
    const props = this.props;
    const { doc, location } = props;
    const { content, meta } = doc;
    const locale = this.context.intl.locale;
    const demos = Object.keys(props.demos).map((key) => props.demos[key])
      .filter((demoData) => !demoData.meta.hidden);
    const expand = this.state.expandAll;

    const isSingleCol = meta.cols === 1;
    const leftChildren = [];
    const rightChildren = [];
    demos.sort((a, b) => a.meta.order - b.meta.order)
      .forEach((demoData, index) => {
        if (index % 2 === 0 || isSingleCol) {
          leftChildren.push(
            <Demo {...demoData}
              key={index} utils={props.utils}
              expand={expand} pathname={location.pathname}
            />
          );
        } else {
          rightChildren.push(
            <Demo {...demoData}
              key={index} utils={props.utils}
              expand={expand} pathname={location.pathname}
            />
          );
        }
      });
    const expandTriggerClass = classNames({
      'code-box-expand-trigger': true,
      'code-box-expand-trigger-active': expand,
    });

    const jumper = demos.map((demo) => {
      const title = demo.meta.title;
      const localizeTitle = title[locale] || title;
      return (
        <li key={demo.meta.id} title={localizeTitle}>
          <a href={`#${demo.meta.id}`}>
            {localizeTitle}
          </a>
        </li>
      );
    });

    const { title, subtitle, chinese, english, filename } = meta;
    return (
      <DocumentTitle title={`${subtitle || chinese || ''} ${title || english} - Ant Design`}>
        <article>
          <Affix className="toc-affix" offsetTop={16}>
            <ul className="toc demos-anchor">
              {jumper}
            </ul>
          </Affix>
          <section className="markdown">
            <h1>
              {title || english}
              {
                (!subtitle && !chinese) ? null :
                  <span className="subtitle">{subtitle || chinese}</span>
              }
              <EditButton title="在 Github 上编辑此页！" filename={filename} />
            </h1>
            {
              props.utils.toReactComponent(
                ['section', { className: 'markdown' }]
                  .concat(getChildren(content))
              )
            }
            <h2>
              <FormattedMessage id="app.component.examples" />
              <Icon type="appstore" className={expandTriggerClass}
                title="展开全部代码" onClick={this.handleExpandToggle}
              />
            </h2>
          </section>
          <Row gutter={16}>
            <Col span={isSingleCol ? '24' : '12'}
              className={isSingleCol ?
                'code-boxes-col-1-1' :
                'code-boxes-col-2-1'
              }
            >
              {leftChildren}
            </Col>
            {
              isSingleCol ? null :
                <Col className="code-boxes-col-2-1" span="12">{rightChildren}</Col>
            }
          </Row>
          {
            props.utils.toReactComponent(
              ['section', {
                className: 'markdown api-container',
              }].concat(getChildren(doc.api || ['placeholder']))
            )
          }
        </article>
      </DocumentTitle>
    );
  }
}
