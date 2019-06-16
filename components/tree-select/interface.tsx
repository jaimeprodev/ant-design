import * as React from 'react';
import { AbstractSelectProps } from '../select';

export type TreeNode = TreeNodeNormal | TreeNodeSimpleMode;

export type TreeNodeValue = string | number | string[] | number[];

export interface TreeNodeNormal {
  value: TreeNodeValue;
  /**
   * @deprecated Please use `title` instead.
   */
  label?: React.ReactNode;
  title?: React.ReactNode;
  key: string;
  isLeaf?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  children?: TreeNodeNormal[];
}

export interface TreeNodeSimpleMode {
  /* It is possible to change `id` and `pId` prop keys using TreeDataSimpleMode so those keys can be anything */
  [key: string]: string | boolean | React.ReactNode;
}

export interface TreeDataSimpleMode {
  id?: string;
  pId?: string;
  rootPId?: string;
}

export interface TreeSelectProps<T extends TreeNodeValue> extends AbstractSelectProps {
  autoFocus?: boolean;
  defaultValue?: T;
  dropdownStyle?: React.CSSProperties;
  filterTreeNode?: (inputValue: string, treeNode: unknown) => boolean | boolean;
  labelInValue?: boolean;
  loadData?: (node: unknown) => void;
  maxTagCount?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: unknown[]) => React.ReactNode);
  multiple?: boolean;
  notFoundContent?: React.ReactNode;
  onChange?: (value: T, label: unknown, extra: unknown) => void;
  onSearch?: (value: unknown) => void;
  onSelect?: (value: unknown) => void;
  onTreeExpand?: (keys: Array<string>) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  searchPlaceholder?: string;
  searchValue?: string;
  showCheckedStrategy?: 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD';
  suffixIcon?: React.ReactNode;
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  treeData?: Array<TreeNode>;
  treeDataSimpleMode?: boolean | TreeDataSimpleMode;
  treeDefaultExpandAll?: boolean;
  treeDefaultExpandedKeys?: Array<string>;
  treeExpandedKeys?: Array<string>;
  treeIcon?: boolean;
  treeNodeFilterProp?: string;
  treeNodeLabelProp?: string;
  value?: T;
}
