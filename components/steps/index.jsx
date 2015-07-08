'use strict';

var React = require('react');
var Steps = require('rc-steps');

var AntSteps = React.createClass({
  getDefaultProps() {
    return {
      prefixCls: 'ant-steps',
      iconPrefix: 'ant',
      size: 'default',
      maxDescriptionWidth: 100
    };
  },
  render() {
    return (<Steps size={this.props.size}
                   iconPrefix={this.props.iconPrefix}
                   maxDescriptionWidth={this.props.maxDescriptionWidth}
                   prefixCls={this.props.prefixCls}>
      {this.props.children}
    </Steps>);
  }
});
AntSteps.Step = Steps.Step;

module.exports = AntSteps;
