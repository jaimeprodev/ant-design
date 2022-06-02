// deps-lint-skip-all
import type { CSSObject } from '@ant-design/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../_util/theme';
import { clearFix, genComponentStyleHook, mergeToken, resetComponent } from '../../_util/theme';
import genBorderedStyle from './bordered';
import genEllipsisStyle from './ellipsis';
import genEmptyStyle from './empty';
import genExpandStyle from './expand';
import genFilterStyle from './filter';
import genFixedStyle from './fixed';
import genPaginationStyle from './pagination';
import genRadiusStyle from './radius';
import genRtlStyle from './rtl';
import genSelectionStyle from './selection';
import genSizeStyle from './size';
import genSorterStyle from './sorter';
import genStickyStyle from './sticky';
import genSummaryStyle from './summary';

export interface TableToken extends FullToken<'Table'> {
  tableFontSize: number;
  tableBg: string;
  tableRadius: number;
  tablePaddingHorizontal: number;
  tablePaddingVertical: number;
  tablePaddingHorizontalMiddle: number;
  tablePaddingVerticalMiddle: number;
  tablePaddingHorizontalSmall: number;
  tablePaddingVerticalSmall: number;
  tableBorderColor: string;
  tableHeaderTextColor: string;
  tableHeaderBg: string;
  tableFooterTextColor: string;
  tableFooterBg: string;
  tableHeaderCellSplitColor: string;
  tableHeaderSortBg: string;
  tableHeaderSortHoverBg: string;
  tableHeaderIconColor: string;
  tableHeaderIconColorHover: string;
  tableBodySortBg: string;
  tableFixedHeaderSortActiveBg: string;
  tableHeaderFilterActiveBg: string;
  tableFilterDropdownBg: string;
  tableFilterDropdownHeight: number;
  tableRowHoverBg: string;
  tableSelectedRowBg: string;
  tableSelectedRowHoverBg: string;

  tableFontSizeMiddle: number;
  tableFontSizeSmall: number;
  tableSelectionColumnWidth: number;
  tableExpandIconBg: string;
  tableExpandedRowBg: string;
  tableFilterDropdownWidth: number;
  tableFilterDropdownSearchWidth: number;

  // Z-Index
  zIndexTableFixed: number;
  zIndexTableSticky: number;

  // Virtual Scroll Bar
  tableScrollThumbSize: number;
  tableScrollThumbBg: string;
  tableScrollThumbBgHover: string;
  tableScrollBg: string;
}

const genTableStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const {
    componentCls,
    fontWeightStrong,
    tablePaddingVertical,
    tablePaddingHorizontal,
    controlLineWidth,
    controlLineType,
    tableBorderColor,
    tableFontSize,
    tableBg,
    tableRadius,
    tableHeaderTextColor,
    motionDurationSlow,
    tableHeaderBg,
    tableHeaderCellSplitColor,
    tableRowHoverBg,
    tableSelectedRowBg,
    tableSelectedRowHoverBg,
    tableFooterTextColor,
    tableFooterBg,
  } = token;
  const tableBorder = `${controlLineWidth}px ${controlLineType} ${tableBorderColor}`;
  return {
    [`${componentCls}-wrapper`]: {
      clear: 'both',
      maxWidth: '100%',
      ...clearFix(),

      [componentCls]: {
        ...resetComponent(token),
        fontSize: tableFontSize,
        background: tableBg,
        borderRadius: tableRadius,
      },
      // https://github.com/ant-design/ant-design/issues/17611
      table: {
        width: '100%',
        textAlign: 'start',
        borderRadius: `${tableRadius}px ${tableRadius}px 0 0`,
        borderCollapse: 'separate',
        borderSpacing: 0,
      },

      // ============================= Cell =============================
      [`
          ${componentCls}-thead > tr > th,
          ${componentCls}-tbody > tr > td,
          tfoot > tr > th,
          tfoot > tr > td
        `]: {
        position: 'relative',
        padding: `${tablePaddingVertical}px ${tablePaddingHorizontal}px`,
        overflowWrap: 'break-word',
      },

      // ============================ Title =============================
      [`${componentCls}-title`]: {
        padding: `${tablePaddingVertical}px ${tablePaddingHorizontal}px`,
      },

      // ============================ Header ============================
      [`${componentCls}-thead`]: {
        '> tr > th': {
          position: 'relative',
          color: tableHeaderTextColor,
          fontWeight: fontWeightStrong,
          textAlign: 'start',
          background: tableHeaderBg,
          borderBottom: tableBorder,
          transition: `background ${motionDurationSlow} ease`,

          "&[colspan]:not([colspan='1'])": {
            textAlign: 'center',
          },

          [`&:not(:last-child):not(${componentCls}-selection-column):not(${componentCls}-row-expand-icon-cell):not([colspan])::before`]:
            {
              position: 'absolute',
              top: '50%',
              insetInlineEnd: 0,
              width: 1,
              height: '1.6em',
              backgroundColor: tableHeaderCellSplitColor,
              transform: 'translateY(-50%)',
              transition: `background-color ${motionDurationSlow}`,
              content: '""',
            },
        },

        '> tr:not(:last-child) > th[colspan]': {
          borderBottom: 0,
        },
      },

      // ============================ Body ============================
      [`${componentCls}-tbody`]: {
        '> tr': {
          '> td': {
            borderBottom: tableBorder,
            transition: `background ${motionDurationSlow}`,

            // ========================= Nest Table ===========================
            [`
              > ${componentCls}-wrapper:only-child,
              > ${componentCls}-expanded-row-fixed > ${componentCls}-wrapper:only-child
            `]: {
              [componentCls]: {
                marginBlock: `-${tablePaddingVertical}px`,
                marginInline: `${tablePaddingHorizontal * 2}px -${tablePaddingHorizontal}px`,
                [`${componentCls}-tbody > tr:last-child > td`]: {
                  borderBottom: 0,
                  '&:first-child, &:last-child': {
                    borderRadius: 0,
                  },
                },
              },
            },
          },

          [`
            &${componentCls}-row:hover > td,
            > td${componentCls}-cell-row-hover
          `]: {
            background: tableRowHoverBg,
          },

          [`&${componentCls}-row-selected`]: {
            '> td': {
              background: tableSelectedRowBg,
            },

            '&:hover > td': {
              background: tableSelectedRowHoverBg,
            },
          },
        },
      },

      // ============================ Footer ============================
      [`${componentCls}-footer`]: {
        padding: `${tablePaddingVertical}px ${tablePaddingHorizontal}px`,
        color: tableFooterTextColor,
        background: tableFooterBg,
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Table', token => {
  const {
    controlItemBgActive,
    controlItemBgActiveHover,
    colorPlaceholder,
    colorTextHeading,
    colorSplit,
    fontSize,
    padding,
    paddingXS,
    paddingSM,
    controlHeight,
    colorBgComponentSecondary,
    colorAction,
    colorActionHover,
    colorLoadingOpacity,
    colorBgComponent,
    colorBgContainer,
    radiusBase,
  } = token;

  const baseColorAction = new TinyColor(colorAction);
  const baseColorActionHover = new TinyColor(colorActionHover);

  const tableSelectedRowBg = controlItemBgActive;
  const zIndexTableFixed: number = 2;

  const tableToken = mergeToken<TableToken>(token, {
    tableFontSize: fontSize,
    tableBg: colorBgComponent,
    tableRadius: radiusBase,

    tablePaddingVertical: padding,
    tablePaddingHorizontal: padding,
    tablePaddingVerticalMiddle: paddingSM,
    tablePaddingHorizontalMiddle: paddingXS,
    tablePaddingVerticalSmall: paddingXS,
    tablePaddingHorizontalSmall: paddingXS,
    tableBorderColor: colorSplit,
    tableHeaderTextColor: colorTextHeading,
    tableHeaderBg: colorBgComponentSecondary,
    tableFooterTextColor: colorTextHeading,
    tableFooterBg: colorBgComponentSecondary,
    tableHeaderCellSplitColor: colorSplit,
    tableHeaderSortBg: colorBgContainer,
    tableHeaderSortHoverBg: colorBgContainer,
    tableHeaderIconColor: baseColorAction
      .clone()
      .setAlpha(baseColorAction.getAlpha() * colorLoadingOpacity)
      .toRgbString(),
    tableHeaderIconColorHover: baseColorActionHover
      .clone()
      .setAlpha(baseColorActionHover.getAlpha() * colorLoadingOpacity)
      .toRgbString(),
    tableBodySortBg: colorBgComponentSecondary,
    tableFixedHeaderSortActiveBg: colorBgContainer,
    tableHeaderFilterActiveBg: colorBgContainer,
    tableFilterDropdownBg: colorBgComponent,
    tableRowHoverBg: colorBgComponentSecondary,
    tableSelectedRowBg,
    tableSelectedRowHoverBg: controlItemBgActiveHover,
    zIndexTableFixed,
    zIndexTableSticky: zIndexTableFixed + 1,
    tableFontSizeMiddle: fontSize,
    tableFontSizeSmall: fontSize,
    tableSelectionColumnWidth: controlHeight,
    tableExpandIconBg: colorBgComponent,
    tableExpandedRowBg: colorBgComponentSecondary,

    // Dropdown
    tableFilterDropdownWidth: 120,
    tableFilterDropdownHeight: 264,
    tableFilterDropdownSearchWidth: 140,

    // Virtual Scroll Bar
    tableScrollThumbSize: 8, // Mac scroll bar size
    tableScrollThumbBg: colorPlaceholder,
    tableScrollThumbBgHover: colorTextHeading,
    tableScrollBg: colorSplit,
  });

  return [
    genTableStyle(tableToken),
    genPaginationStyle(tableToken),
    genSummaryStyle(tableToken),
    genSorterStyle(tableToken),
    genFilterStyle(tableToken),
    genBorderedStyle(tableToken),
    genRadiusStyle(tableToken),
    genExpandStyle(tableToken),
    genSummaryStyle(tableToken),
    genEmptyStyle(tableToken),
    genSelectionStyle(tableToken),
    genFixedStyle(tableToken),
    genStickyStyle(tableToken),
    genEllipsisStyle(tableToken),
    genSizeStyle(tableToken),
    genRtlStyle(tableToken),
  ];
});
