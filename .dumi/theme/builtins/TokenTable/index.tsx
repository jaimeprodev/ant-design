import type { FC } from 'react';
import React, { useMemo } from 'react';
/* eslint import/no-unresolved: 0 */
import tokenMeta from 'antd/es/version/token-meta.json';
import { getDesignToken } from 'antd-token-previewer';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { css } from '@emotion/react';
import useLocale from '../../../hooks/useLocale';
import useSiteToken from '../../../hooks/useSiteToken';
import ColorChunk from '../ColorChunk';

type TokenTableProps = {
  type: 'seed' | 'map' | 'alias';
  lang: 'zh' | 'en';
};

type TokenData = {
  name: string;
  desc: string;
  type: string;
  value: any;
};

const defaultToken = getDesignToken();

const locales = {
  cn: {
    token: 'Token 名称',
    description: '描述',
    type: '类型',
    value: '默认值',
  },
  en: {
    token: 'Token Name',
    description: 'Description',
    type: 'Type',
    value: 'Default Value',
  },
};

const useStyle = () => {
  const { token } = useSiteToken();

  return {
    codeSpan: css`
      margin: 0 1px;
      padding: 0.2em 0.4em;
      font-size: 0.9em;
      background: ${token.siteMarkdownCodeBg};
      border: 1px solid ${token.colorSplit};
      border-radius: 3px;
      font-family: monospace;
    `,
  };
};

const TokenTable: FC<TokenTableProps> = ({ type }) => {
  const styles = useStyle();
  const [locale, lang] = useLocale(locales);
  const columns: Exclude<TableProps<TokenData>['columns'], undefined> = [
    {
      title: locale.token,
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: locale.description,
      key: 'desc',
      dataIndex: 'desc',
    },
    {
      title: locale.type,
      key: 'type',
      dataIndex: 'type',
      render: (_, record) => <span css={styles.codeSpan}>{record.type}</span>,
    },
    {
      title: locale.value,
      key: 'value',
      render: (_, record) => {
        const isColor =
          typeof record.value === 'string' &&
          (record.value.startsWith('#') || record.value.startsWith('rgb'));
        if (isColor) {
          return <ColorChunk color={record.value}>{record.value}</ColorChunk>;
        }
        return typeof record.value !== 'string' ? JSON.stringify(record.value) : record.value;
      },
    },
  ];

  const data = useMemo<TokenData[]>(
    () =>
      Object.entries(tokenMeta)
        .filter(([, meta]) => meta.source === type)
        .map(([token, meta]) => ({
          name: token,
          desc: lang === 'cn' ? meta.desc : meta.descEn,
          type: meta.type,
          value: (defaultToken as any)[token],
        })),
    [type, lang],
  );

  return <Table dataSource={data} columns={columns} pagination={false} bordered />;
};

export default TokenTable;
