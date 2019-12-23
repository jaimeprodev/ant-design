#!/usr/bin/env node
const path = require('path');
const genCss = require('antd-pro-merge-less');
const dark = require('./dark-vars');
const { generateTheme } = require('antd-theme-generator');

genCss(
  path.join(__dirname, '..'),
  [
    {
      theme: 'dark',
      fileName: './_site/dark.css',
      modifyVars: {
        ...dark,
        '@site-markdown-code-bg': '@input-bg',
      },
    },
  ],
  {
    ignoreAntd: true,
    isModule: false,
    cache: false,
    loadAny: true,
    ignoreProLayout: true,
  },
);

const options = {
  stylesDir: path.join(__dirname, '../site/theme/static'),
  antdStylesDir: path.join(__dirname, '../components'),
  varFile: path.join(__dirname, '../components/style/themes/default.less'),
  mainLessFile: path.join(__dirname, '../site/theme/static/index.less'),
  themeVariables: ['@primary-color'],
  outputFilePath: path.join(__dirname, '../_site/color.less'),
};

generateTheme(options);
