require('ant-style/index.less');

var antd = {
  datepicker: require('./components/datepicker'),
  tooltip: require('./components/tooltip'),
  tab: require('./components/tabs'),
  modal: require('./components/modal')
};

module.exports = window.antd = antd;
