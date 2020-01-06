const $ = require('dekko');
const chalk = require('chalk');

$('dist')
  .isDirectory()
  .hasFile('antd-with-locales.js')
  .hasFile('antd-with-locales.min.js')
  .hasFile('antd.css')
  .hasFile('antd.min.css')
  .hasFile('antd.js')
  .hasFile('antd.min.js')
  .hasFile('antd.less')
  .hasFile('antd.dark.less')
  .hasFile('antd.dark.css')
  .hasFile('dark-theme.js');

// eslint-disable-next-line
console.log(chalk.green('✨ `dist` directory is valid.'));
