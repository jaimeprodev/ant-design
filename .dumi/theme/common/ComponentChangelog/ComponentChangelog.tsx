/* eslint-disable global-require */
import React from 'react';
import { createStyles } from 'antd-style';
import { HistoryOutlined } from '@ant-design/icons';
import { Timeline, Button, Drawer, Typography } from 'antd';
import useLocale from '../../../hooks/useLocale';

const useStyle = createStyles(({ token, css }) => ({
  history: css`
    position: absolute;
    top: 0;
    inset-inline-end: 0;
  `,

  li: css`
    // white-space: pre;
  `,

  ref: css`
    margin-left: ${token.marginXS}px;
  `,
}));

export interface ComponentChangelogProps {
  pathname: string;
}

const locales = {
  cn: {
    changelog: '更新日志',
    loading: '加载中...',
    empty: '暂无更新',
  },
  en: {
    changelog: 'Changelog',
    loading: 'loading...',
    empty: 'Nothing update',
  },
};

function ParseChangelog(props: { changelog: string; refs: string[]; styles: any }) {
  const { changelog = '', refs = [], styles } = props;

  const parsedChangelog = React.useMemo(() => {
    const nodes: React.ReactElement[] = [];

    let isQuota = false;
    let lastStr = '';

    for (let i = 0; i < changelog.length; i += 1) {
      const char = changelog[i];

      if (char !== '`') {
        lastStr += char;
      } else {
        let node = lastStr;
        if (isQuota) {
          node = <code>{node}</code>;
        }

        nodes.push(node);
        lastStr = '';
        isQuota = !isQuota;
      }
    }

    nodes.push(lastStr);

    return nodes;
  }, [changelog]);

  return (
    <>
      {/* Changelog */}
      <span>{parsedChangelog}</span>

      {/* Refs */}
      {refs?.map((ref) => (
        <a className={styles.ref} key={ref} href={ref} target="_blank" rel="noreferrer">
          #{ref.match(/^.*\/(\d+)$/)?.[1]}
        </a>
      ))}
    </>
  );
}

function useChangelog(componentPath, lang) {
  const [list, setList] =
    React.useState<{ version: string; changelog: string; refs: string[] }[]>(null);

  React.useEffect(() => {
    const cnData = require('../../../preset/components-changelog-cn.json');
    const enData = require('../../../preset/components-changelog-en.json');

    const component = componentPath.replace(/-/g, '');

    const mergedData = lang === 'cn' ? cnData : enData;
    const componentName = Object.keys(mergedData).find(
      (name) => name.toLowerCase() === component.toLowerCase(),
    );

    const componentChangelog = mergedData[componentName];

    setList(componentChangelog || []);
  }, [componentPath]);

  return list || [];
}

export default function ComponentChangelog(props: ComponentChangelogProps) {
  const { pathname = '' } = props;
  const [locale, lang] = useLocale(locales);
  const [show, setShow] = React.useState(false);

  const { styles } = useStyle();

  const componentPath = pathname.match(/\/components\/([^/]+)/)?.[1] || '';

  const list = useChangelog(componentPath, lang);

  const timelineItems = React.useMemo(() => {
    const changelogMap = {};

    list?.forEach((info) => {
      changelogMap[info.version] = changelogMap[info.version] || [];
      changelogMap[info.version].push(info);
    });

    return Object.keys(changelogMap).map((version) => {
      const changelogList = changelogMap[version];

      return {
        children: (
          <Typography>
            <h4>{version}</h4>
            <ul>
              {changelogList.map((info, index) => (
                <li key={index} className={styles.li}>
                  <ParseChangelog {...info} styles={styles} />
                </li>
              ))}
            </ul>
          </Typography>
        ),
      };
    });
  }, [list]);

  if (!list || !list.length) {
    return null;
  }

  return (
    <>
      <Button
        className={styles.history}
        icon={<HistoryOutlined />}
        onClick={() => {
          setShow(true);
        }}
      >
        {locale.changelog}
      </Button>
      <Drawer
        title={locale.changelog}
        open={show}
        width={520}
        onClose={() => {
          setShow(false);
        }}
        destroyOnClose
      >
        <Timeline items={timelineItems} />
      </Drawer>
    </>
  );
}
