import { defineConfig } from 'dumi';
import path from 'path';
import rehypeAntd from './.dumi/rehypeAntd';
import { version } from './package.json';

export default defineConfig({
  conventionRoutes: {
    // to avoid generate routes for .dumi/pages/index/components/xx
    exclude: [new RegExp('index/components/')],
  },
  ssr: process.env.NODE_ENV === 'production' ? {} : false,
  hash: true,
  outputPath: '_site',
  favicons: ['https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png'],
  resolve: {
    docDirs: [{ type: 'doc', dir: 'docs' }],
    atomDirs: [{ type: 'component', dir: 'components' }],
    codeBlockMode: 'passive',
  },
  locales: [
    { id: 'en-US', name: 'English', suffix: '' },
    { id: 'zh-CN', name: '中文', suffix: '-cn' },
  ],
  define: {
    antdReproduceVersion: version,
  },
  alias: {
    'antd/lib': path.join(__dirname, 'components'),
    'antd/es': path.join(__dirname, 'components'),
    'antd/locale': path.join(__dirname, 'components/locale'),
    // Change antd from `index.js` to `.dumi/theme/antd.js` to remove deps of root style
    antd: require.resolve('./.dumi/theme/antd.js'),
  },
  extraRehypePlugins: [rehypeAntd],
  extraBabelPresets: ['@emotion/babel-preset-css-prop'],
  mfsu: false,
  headScripts: [
    `
    (function () {
      function isLocalStorageNameSupported() {
        var testKey = 'test';
        var storage = window.localStorage;
        try {
          storage.setItem(testKey, '1');
          storage.removeItem(testKey);
          return true;
        } catch (error) {
          return false;
        }
      }
      // 优先级提高到所有静态资源的前面，语言不对，加载其他静态资源没意义
      var pathname = location.pathname;

      function isZhCN(pathname) {
        return /-cn\\/?$/.test(pathname);
      }
      function getLocalizedPathname(path, zhCN) {
        var pathname = path.indexOf('/') === 0 ? path : '/' + path;
        if (!zhCN) {
          // to enUS
          return /\\/?index(-cn)?/.test(pathname) ? '/' : pathname.replace('-cn', '');
        } else if (pathname === '/') {
          return '/index-cn';
        } else if (pathname.indexOf('/') === pathname.length - 1) {
          return pathname.replace(/\\/$/, '-cn/');
        }
        return pathname + '-cn';
      }

      // 兼容旧的 URL， \`?locale=...\`
      var queryString = location.search;
      if (queryString) {
        var isZhCNConfig = queryString.indexOf('zh-CN') > -1;
        if (isZhCNConfig && !isZhCN(pathname)) {
          location.pathname = getLocalizedPathname(pathname, isZhCNConfig);
        }
      }

      // 首页无视链接里面的语言设置 https://github.com/ant-design/ant-design/issues/4552
      if (isLocalStorageNameSupported() && (pathname === '/' || pathname === '/index-cn')) {
        var lang =
          (window.localStorage && localStorage.getItem('locale')) ||
          ((navigator.language || navigator.browserLanguage).toLowerCase() === 'zh-cn'
            ? 'zh-CN'
            : 'en-US');
        // safari is 'zh-cn', while other browser is 'zh-CN';
        if ((lang === 'zh-CN') !== isZhCN(pathname)) {
          location.pathname = getLocalizedPathname(pathname, lang === 'zh-CN');
        }
      }
      document.documentElement.className += isZhCN(pathname) ? 'zh-cn' : 'en-us';
    })();
    `,
  ],
});
