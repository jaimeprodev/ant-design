import classNames from 'classnames';
import RcTable, { Summary } from 'rc-table';
import { convertChildrenToColumns } from 'rc-table/lib/hooks/useColumns';
import type { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { INTERNAL_HOOKS } from 'rc-table/lib/Table';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { ConfigContext } from '../config-provider/context';
import defaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import useBreakpoint from '../grid/hooks/useBreakpoint';
import defaultLocale from '../locale/en_US';
import Pagination from '../pagination';
import type { SpinProps } from '../spin';
import Spin from '../spin';
import type { TooltipProps } from '../tooltip';
import type { Breakpoint } from '../_util/responsiveObserve';
import scrollTo from '../_util/scrollTo';
import warning from '../_util/warning';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import renderExpandIcon from './ExpandIcon';
import type { FilterState } from './hooks/useFilter';
import useFilter, { getFilterData } from './hooks/useFilter';
import useLazyKVMap from './hooks/useLazyKVMap';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useSelection, {
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './hooks/useSelection';
import type { SortState } from './hooks/useSorter';
import useSorter, { getSortData } from './hooks/useSorter';
import useTitleColumns from './hooks/useTitleColumns';
import type {
  ColumnTitleProps,
  ColumnType,
  ExpandableConfig,
  ExpandType,
  FilterValue,
  GetPopupContainer,
  GetRowKey,
  SorterResult,
  SortOrder,
  TableAction,
  TableCurrentDataSource,
  TableLocale,
  TableRowSelection,
} from './interface';
import { ColumnsType, TablePaginationConfig } from './interface';

export { ColumnsType, TablePaginationConfig };

const EMPTY_LIST: any[] = [];

interface ChangeEventInfo<RecordType> {
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];

  filterStates: FilterState<RecordType>[];
  sorterStates: SortState<RecordType>[];

  resetPagination: Function;
}

export interface TableProps<RecordType>
  extends Omit<
    RcTableProps<RecordType>,
    | 'transformColumns'
    | 'internalHooks'
    | 'internalRefs'
    | 'data'
    | 'columns'
    | 'scroll'
    | 'emptyText'
  > {
  dropdownPrefixCls?: string;
  dataSource?: RcTableProps<RecordType>['data'];
  columns?: ColumnsType<RecordType>;
  pagination?: false | TablePaginationConfig;
  loading?: boolean | SpinProps;
  size?: SizeType;
  bordered?: boolean;
  locale?: TableLocale;

  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;
  rowSelection?: TableRowSelection<RecordType>;

  getPopupContainer?: GetPopupContainer;
  scroll?: RcTableProps<RecordType>['scroll'] & {
    scrollToFirstRowOnChange?: boolean;
  };
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | TooltipProps;
}

function InternalTable<RecordType extends object = any>(
  props: TableProps<RecordType>,
  ref: React.MutableRefObject<HTMLDivElement>,
) {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    size: customizeSize,
    bordered,
    dropdownPrefixCls: customizeDropdownPrefixCls,
    dataSource,
    pagination,
    rowSelection,
    rowKey = 'key',
    rowClassName,
    columns,
    children,
    childrenColumnName: legacyChildrenColumnName,
    onChange,
    getPopupContainer,
    loading,
    expandIcon,
    expandable,
    expandedRowRender,
    expandIconColumnIndex,
    indentSize,
    scroll,
    sortDirections,
    locale,
    showSorterTooltip = true,
  } = props;

  warning(
    !(typeof rowKey === 'function' && rowKey.length > 1),
    'Table',
    '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
  );

  [
    ['filterDropdownVisible', 'filterDropdownOpen'],
    ['onFilterDropdownVisibleChange', 'onFilterDropdownOpenChange'],
  ].forEach(([deprecatedName, newName]) => {
    warning(
      !(deprecatedName in props),
      'Table',
      `\`${deprecatedName}\` is deprecated which will be removed in next major version.Please use \`${newName}\` instead. `,
    );
  });

  const baseColumns = React.useMemo(
    () => columns || (convertChildrenToColumns(children) as ColumnsType<RecordType>),
    [columns, children],
  );
  const needResponsive = React.useMemo(
    () => baseColumns.some((col: ColumnType<RecordType>) => col.responsive),
    [baseColumns],
  );

  const screens = useBreakpoint(needResponsive);

  const mergedColumns = React.useMemo(() => {
    const matched = new Set(Object.keys(screens).filter((m: Breakpoint) => screens[m]));

    return baseColumns.filter(
      c => !c.responsive || c.responsive.some((r: Breakpoint) => matched.has(r)),
    );
  }, [baseColumns, screens]);

  const tableProps = omit(props, ['className', 'style', 'columns']) as TableProps<RecordType>;

  const size = React.useContext(SizeContext);
  const {
    locale: contextLocale = defaultLocale,
    renderEmpty,
    direction,
  } = React.useContext(ConfigContext);
  const mergedSize = customizeSize || size;
  const tableLocale = { ...contextLocale.Table, ...locale } as TableLocale;
  const rawData: readonly RecordType[] = dataSource || EMPTY_LIST;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('table', customizePrefixCls);
  const dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);

  const mergedExpandable: ExpandableConfig<RecordType> = {
    childrenColumnName: legacyChildrenColumnName,
    expandIconColumnIndex,
    ...expandable,
  };
  const { childrenColumnName = 'children' } = mergedExpandable;

  const expandType = React.useMemo<ExpandType>(() => {
    if (rawData.some(item => (item as any)?.[childrenColumnName])) {
      return 'nest';
    }

    if (expandedRowRender || (expandable && expandable.expandedRowRender)) {
      return 'row';
    }

    return null;
  }, [rawData]);

  const internalRefs = {
    body: React.useRef<HTMLDivElement>(),
  };

  // ============================ RowKey ============================
  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }

    return (record: RecordType) => (record as any)?.[rowKey as string];
  }, [rowKey]);

  const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);

  // ============================ Events =============================
  const changeEventInfo: Partial<ChangeEventInfo<RecordType>> = {};

  const triggerOnChange = (
    info: Partial<ChangeEventInfo<RecordType>>,
    action: TableAction,
    reset: boolean = false,
  ) => {
    const changeInfo = {
      ...changeEventInfo,
      ...info,
    };

    if (reset) {
      changeEventInfo.resetPagination!();

      // Reset event param
      if (changeInfo.pagination!.current) {
        changeInfo.pagination!.current = 1;
      }

      // Trigger pagination events
      if (pagination && pagination.onChange) {
        pagination.onChange(1, changeInfo.pagination!.pageSize!);
      }
    }

    if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body.current) {
      scrollTo(0, {
        getContainer: () => internalRefs.body.current!,
      });
    }

    onChange?.(changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
      currentDataSource: getFilterData(
        getSortData(rawData, changeInfo.sorterStates!, childrenColumnName),
        changeInfo.filterStates!,
      ),
      action,
    });
  };

  /**
   * Controlled state in `columns` is not a good idea that makes too many code (1000+ line?) to read
   * state out and then put it back to title render. Move these code into `hooks` but still too
   * complex. We should provides Table props like `sorter` & `filter` to handle control in next big
   * version.
   */

  // ============================ Sorter =============================
  const onSorterChange = (
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    sorterStates: SortState<RecordType>[],
  ) => {
    triggerOnChange(
      {
        sorter,
        sorterStates,
      },
      'sort',
      false,
    );
  };
  const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSorter<RecordType>({
    prefixCls,
    mergedColumns,
    onSorterChange,
    sortDirections: sortDirections || ['ascend', 'descend'],
    tableLocale,
    showSorterTooltip,
  });
  const sortedData = React.useMemo(
    () => getSortData(rawData, sortStates, childrenColumnName),
    [rawData, sortStates],
  );

  changeEventInfo.sorter = getSorters();
  changeEventInfo.sorterStates = sortStates;

  // ============================ Filter ============================
  const onFilterChange = (
    filters: Record<string, FilterValue>,
    filterStates: FilterState<RecordType>[],
  ) => {
    triggerOnChange(
      {
        filters,
        filterStates,
      },
      'filter',
      true,
    );
  };

  const [transformFilterColumns, filterStates, filters] = useFilter<RecordType>({
    prefixCls,
    locale: tableLocale,
    dropdownPrefixCls,
    mergedColumns,
    onFilterChange,
    getPopupContainer,
  });
  const mergedData = getFilterData(sortedData, filterStates);

  changeEventInfo.filters = filters;
  changeEventInfo.filterStates = filterStates;

  // ============================ Column ============================
  const columnTitleProps = React.useMemo<ColumnTitleProps<RecordType>>(() => {
    const mergedFilters: Record<string, FilterValue> = {};
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] !== null) {
        mergedFilters[filterKey] = filters[filterKey]!;
      }
    });
    return {
      ...sorterTitleProps,
      filters: mergedFilters,
    };
  }, [sorterTitleProps, filters]);

  const [transformTitleColumns] = useTitleColumns(columnTitleProps);

  // ========================== Pagination ==========================
  const onPaginationChange = (current: number, pageSize: number) => {
    triggerOnChange(
      {
        pagination: { ...changeEventInfo.pagination, current, pageSize },
      },
      'paginate',
    );
  };

  const [mergedPagination, resetPagination] = usePagination(
    mergedData.length,
    pagination,
    onPaginationChange,
  );

  changeEventInfo.pagination =
    pagination === false ? {} : getPaginationParam(pagination, mergedPagination);

  changeEventInfo.resetPagination = resetPagination;

  // ============================= Data =============================
  const pageData = React.useMemo<RecordType[]>(() => {
    if (pagination === false || !mergedPagination.pageSize) {
      return mergedData;
    }

    const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination;
    warning(current > 0, 'Table', '`current` should be positive number.');

    // Dynamic table data
    if (mergedData.length < total!) {
      if (mergedData.length > pageSize) {
        warning(
          false,
          'Table',
          '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
        );
        return mergedData.slice((current - 1) * pageSize, current * pageSize);
      }
      return mergedData;
    }

    return mergedData.slice((current - 1) * pageSize, current * pageSize);
  }, [
    !!pagination,
    mergedData,
    mergedPagination && mergedPagination.current,
    mergedPagination && mergedPagination.pageSize,
    mergedPagination && mergedPagination.total,
  ]);

  // ========================== Selections ==========================
  const [transformSelectionColumns, selectedKeySet] = useSelection<RecordType>(rowSelection, {
    prefixCls,
    data: mergedData,
    pageData,
    getRowKey,
    getRecordByKey,
    expandType,
    childrenColumnName,
    locale: tableLocale,
    getPopupContainer,
  });

  const internalRowClassName = (record: RecordType, index: number, indent: number) => {
    let mergedRowClassName: string;
    if (typeof rowClassName === 'function') {
      mergedRowClassName = classNames(rowClassName(record, index, indent));
    } else {
      mergedRowClassName = classNames(rowClassName);
    }

    return classNames(
      {
        [`${prefixCls}-row-selected`]: selectedKeySet.has(getRowKey(record, index)),
      },
      mergedRowClassName,
    );
  };

  // ========================== Expandable ==========================

  // Pass origin render status into `rc-table`, this can be removed when refactor with `rc-table`
  (mergedExpandable as any).__PARENT_RENDER_ICON__ = mergedExpandable.expandIcon;

  // Customize expandable icon
  mergedExpandable.expandIcon =
    mergedExpandable.expandIcon || expandIcon || renderExpandIcon(tableLocale!);

  // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
  if (expandType === 'nest' && mergedExpandable.expandIconColumnIndex === undefined) {
    mergedExpandable.expandIconColumnIndex = rowSelection ? 1 : 0;
  } else if (mergedExpandable.expandIconColumnIndex! > 0 && rowSelection) {
    mergedExpandable.expandIconColumnIndex! -= 1;
  }

  // Indent size
  if (typeof mergedExpandable.indentSize !== 'number') {
    mergedExpandable.indentSize = typeof indentSize === 'number' ? indentSize : 15;
  }

  // ============================ Render ============================
  const transformColumns = React.useCallback(
    (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> =>
      transformTitleColumns(
        transformSelectionColumns(transformFilterColumns(transformSorterColumns(innerColumns))),
      ),
    [transformSorterColumns, transformFilterColumns, transformSelectionColumns],
  );

  let topPaginationNode: React.ReactNode;
  let bottomPaginationNode: React.ReactNode;
  if (pagination !== false && mergedPagination?.total) {
    let paginationSize: TablePaginationConfig['size'];
    if (mergedPagination.size) {
      paginationSize = mergedPagination.size;
    } else {
      paginationSize = mergedSize === 'small' || mergedSize === 'middle' ? 'small' : undefined;
    }

    const renderPagination = (position: string) => (
      <Pagination
        {...mergedPagination}
        className={classNames(
          `${prefixCls}-pagination ${prefixCls}-pagination-${position}`,
          mergedPagination.className,
        )}
        size={paginationSize}
      />
    );
    const defaultPosition = direction === 'rtl' ? 'left' : 'right';
    const { position } = mergedPagination;
    if (position !== null && Array.isArray(position)) {
      const topPos = position.find(p => p.indexOf('top') !== -1);
      const bottomPos = position.find(p => p.indexOf('bottom') !== -1);
      const isDisable = position.every(p => `${p}` === 'none');
      if (!topPos && !bottomPos && !isDisable) {
        bottomPaginationNode = renderPagination(defaultPosition);
      }
      if (topPos) {
        topPaginationNode = renderPagination(topPos!.toLowerCase().replace('top', ''));
      }
      if (bottomPos) {
        bottomPaginationNode = renderPagination(bottomPos!.toLowerCase().replace('bottom', ''));
      }
    } else {
      bottomPaginationNode = renderPagination(defaultPosition);
    }
  }

  // >>>>>>>>> Spinning
  let spinProps: SpinProps | undefined;
  if (typeof loading === 'boolean') {
    spinProps = {
      spinning: loading,
    };
  } else if (typeof loading === 'object') {
    spinProps = {
      spinning: true,
      ...loading,
    };
  }

  const wrapperClassNames = classNames(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-wrapper-rtl`]: direction === 'rtl',
    },
    className,
  );
  return (
    <div ref={ref} className={wrapperClassNames} style={style}>
      <Spin spinning={false} {...spinProps}>
        {topPaginationNode}
        <RcTable<RecordType>
          {...tableProps}
          columns={mergedColumns as RcTableProps<RecordType>['columns']}
          direction={direction}
          expandable={mergedExpandable}
          prefixCls={prefixCls}
          className={classNames({
            [`${prefixCls}-middle`]: mergedSize === 'middle',
            [`${prefixCls}-small`]: mergedSize === 'small',
            [`${prefixCls}-bordered`]: bordered,
            [`${prefixCls}-empty`]: rawData.length === 0,
          })}
          data={pageData}
          rowKey={getRowKey}
          rowClassName={internalRowClassName}
          emptyText={(locale && locale.emptyText) || (renderEmpty || defaultRenderEmpty)('Table')}
          // Internal
          internalHooks={INTERNAL_HOOKS}
          internalRefs={internalRefs as any}
          transformColumns={transformColumns as RcTableProps<RecordType>['transformColumns']}
        />
        {bottomPaginationNode}
      </Spin>
    </div>
  );
}

const ForwardTable = React.forwardRef(InternalTable) as <RecordType extends object = any>(
  props: React.PropsWithChildren<TableProps<RecordType>> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

type InternalTableType = typeof ForwardTable;

interface TableInterface extends InternalTableType {
  SELECTION_COLUMN: typeof SELECTION_COLUMN;
  EXPAND_COLUMN: typeof RcTable.EXPAND_COLUMN;
  SELECTION_ALL: 'SELECT_ALL';
  SELECTION_INVERT: 'SELECT_INVERT';
  SELECTION_NONE: 'SELECT_NONE';
  Column: typeof Column;
  ColumnGroup: typeof ColumnGroup;
  Summary: typeof Summary;
}

const Table = ForwardTable as TableInterface;

Table.SELECTION_COLUMN = SELECTION_COLUMN;
Table.EXPAND_COLUMN = RcTable.EXPAND_COLUMN;
Table.SELECTION_ALL = SELECTION_ALL;
Table.SELECTION_INVERT = SELECTION_INVERT;
Table.SELECTION_NONE = SELECTION_NONE;
Table.Column = Column;
Table.ColumnGroup = ColumnGroup;
Table.Summary = Summary;

export default Table;
