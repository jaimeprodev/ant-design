// import '../../style/index.less';
// import './index.less';

// // style dependencies
// // deps-lint-skip: tree, form
// import '../../select/style';
// import '../../empty/style';

// deps-lint-skip-all
import { GenerateStyle, genComponentStyleHook, FullToken, mergeToken } from '../../_util/theme';
import { getStyle as getCheckboxStyle } from '../../checkbox/style';
import { genTreeStyle } from '../../tree/style';

interface TreeSelectToken extends FullToken<'TreeSelect'> {
  treePrefixCls: string;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<TreeSelectToken> = (token, hashId) => {
  const { componentCls, treePrefixCls } = token;
  const treeCls = `.${treePrefixCls}`;

  return [
    // ======================================================
    // ==                     Dropdown                     ==
    // ======================================================
    {
      [`${componentCls}-dropdown`]: [
        {
          padding: `${token.paddingXS}px ${token.paddingXS / 2}px`,
        },

        // ====================== Tree ======================
        genTreeStyle(treePrefixCls, token, hashId!),
        {
          [treeCls]: {
            borderRadius: 0,
            '&-list-holder-inner': {
              alignItems: 'stretch',

              [`${treeCls}-treenode`]: {
                [`${treeCls}-node-content-wrapper`]: {
                  flex: 'auto',
                },
              },
            },
          },
        },

        // ==================== Checkbox ====================
        getCheckboxStyle(`${treePrefixCls}-checkbox`, token, hashId!),

        // ====================== RTL =======================
        {
          '&-rtl': {
            direction: 'rtl',

            [`${treeCls}-switcher${treeCls}-switcher_close`]: {
              [`${treeCls}-switcher-icon svg`]: {
                transform: 'rotate(90deg)',
              },
            },
          },
        },
      ],
    },
  ];
};

// ============================== Export ==============================
export default function useTreeSelectStyle(prefixCls: string, treePrefixCls: string) {
  return genComponentStyleHook('TreeSelect', (token, { hashId }) => {
    const treeSelectToken = mergeToken<TreeSelectToken>(token, {
      treePrefixCls,
    });
    return [genBaseStyle(treeSelectToken, hashId)];
  })(prefixCls);
}
