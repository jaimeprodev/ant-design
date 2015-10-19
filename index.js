require('./style/index.less');

// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

const antd = {
  Affix: require('./components/affix'),
  Datepicker: require('./components/datepicker'),
  Tooltip: require('./components/tooltip'),
  Carousel: require('./components/carousel'),
  Tabs: require('./components/tabs'),
  Modal: require('./components/modal'),
  Dropdown: require('./components/dropdown'),
  Progress: require('./components/progress'),
  Popover: require('./components/popover'),
  Select: require('./components/select'),
  Breadcrumb: require('./components/breadcrumb'),
  Popconfirm: require('./components/popconfirm'),
  Pagination: require('./components/pagination'),
  Steps: require('./components/steps'),
  InputNumber: require('./components/input-number'),
  Switch: require('./components/switch'),
  Checkbox: require('./components/checkbox'),
  Table: require('./components/table'),
  Tag: require('./components/tag'),
  Collapse: require('./components/collapse'),
  message: require('./components/message'),
  Slider: require('./components/slider'),
  EnterAnimation: require('./components/enter-animation'),
  QueueAnim: require('./components/queue-anim'),
  Radio: require('./components/radio'),
  Notification: require('./components/notification'),
  Alert: require('./components/alert'),
  Validation: require('./components/validation'),
  Tree: require('./components/tree'),
  Upload: require('./components/upload'),
  Badge: require('./components/badge'),
  Menu: require('./components/menu'),
  Timeline: require('./components/timeline'),
  Button: require('./components/button').Button,
  ButtonGroup: require('./components/button').ButtonGroup,
  Icon: require('./components/iconfont')
};

// deprecate
antd.EnterAnimation.prototype.render = require('util-deprecate')(antd.EnterAnimation.prototype.render, 'antd.EnterAnimation is deprecated, use antd.QueueAnim instead: http://ant.design/components/queue-anim');

module.exports = antd;

antd.version = require('./package.json').version;
