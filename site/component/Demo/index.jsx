import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import antd, { Collapse } from '../../../';
import BrowserDemo from '../BrowserDemo';
import * as utils from '../utils';
import hljs from 'highlight.js';

export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: '',
    };
  }

  handleChange(activeKey) {
    this.setState({
      activeKey: this.state.activeKey === activeKey ?
        '' : activeKey
    });
  }

  render() {
    const { id, parentId, preview, title,
            intro, code, style, expand, pathname } = this.props;
    const demoId = `${parentId}-${id}`;
    const introChildren = intro.map(utils.objectToComponent.bind(null, pathname));
    const highlightedCode = hljs.highlight('javascript', code).value;

    return (
      <section className="code-box" id={demoId}>
        <section className="code-box-demo">
        { preview(React, ReactDOM, antd, BrowserDemo) }
          {
            !!style ?
              <style dangerouslySetInnerHTML={{ __html: style }} /> :
              null
          }
        </section>
        <section className="code-box-meta markdown">
          <div className="code-box-title">
        <Link to={{ pathname, query: { scrollTo: demoId } }}>{ title }</Link>
          </div>
          <Collapse activeKey={expand ? 'code' : this.state.activeKey}
            onChange={this.handleChange.bind(this)}>
            <Collapse.Panel key="code" header={introChildren}>
              <div className="highlight">
                <pre>
                  <code className="javascript" dangerouslySetInnerHTML={{
                    __html: highlightedCode,
                  }} />
                </pre>
              </div>
              {
                !!style ?
                  <div className="highlight">
                    <pre>
                      <code className="css" dangerouslySetInnerHTML={{
                        __html: hljs.highlight('css', style).value,
                      }} />
                    </pre>
                  </div> :
                  null
              }
            </Collapse.Panel>
          </Collapse>
        </section>
      </section>
    );
  }
}
