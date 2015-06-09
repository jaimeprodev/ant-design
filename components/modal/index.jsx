'use strict';

var React = require('react');
var Dialog = require('rc-dialog');

function noop() {
}

var div;

module.exports = function (props) {
  props = props || {};

  props.animation = 'zoom';
  props.maskAnimation = 'fade';
  props.width = props.width || 500;

  props.onClose = props.onCancel || noop;

  function onCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
    close();
  }

  function close() {
    d.setState({
      visible: false
    });
  }

  function onOk() {
    var onOk = props.onOk;
    if (onOk) {
      onOk(close);
    } else {
      close();
    }
  }

  var footer = [
    <button type="button" className="ant-btn-default ant-btn" onClick={onCancel}>取 消</button>,
    <button type="button" className="ant-btn-primary ant-btn" onClick={onOk}>确 定</button>
  ];
  if (!div) {
    div = document.createElement('div');
    document.body.appendChild(div);
  }
  props.visible = true;
  props.children = props.content;
  props.footer = footer;
  props.renderToBody = false;
  var d;
  React.render(<Dialog {...props}/>, div, function () {
    d = this;
  });
};
