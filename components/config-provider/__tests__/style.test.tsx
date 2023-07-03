import React from 'react';
import ConfigProvider from '..';
import { render } from '../../../tests/utils';
import Anchor from '../../anchor';
import Avatar from '../../avatar';
import Badge from '../../badge';
import Breadcrumb from '../../breadcrumb';
import Card from '../../card';
import Cascader from '../../cascader';
import Checkbox from '../../checkbox';
import Descriptions from '../../descriptions';
import Divider from '../../divider';
import Empty from '../../empty';
import Form from '../../form';
import Image from '../../image';
import Input from '../../input';
import Layout from '../../layout';
import Mentions from '../../mentions';
import Modal from '../../modal';
import Pagination from '../../pagination';
import Radio from '../../radio';
import Rate from '../../rate';
import Result from '../../result';
import Segmented from '../../segmented';
import Select from '../../select';
import Slider from '../../slider';
import Space from '../../space';
import Spin from '../../spin';
import Steps from '../../steps';
import Switch from '../../switch';
import Table from '../../table';
import Tabs from '../../tabs';
import Tag from '../../tag';
import Typography from '../../typography';
import Upload from '../../upload';

describe('ConfigProvider support style and className props', () => {
  it('Should Space classNames works', () => {
    const { container } = render(
      <ConfigProvider
        space={{
          classNames: {
            item: 'test-classNames',
          },
        }}
      >
        <Space>
          <span>Text1</span>
          <span>Text2</span>
        </Space>
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-space-item')).toHaveClass('test-classNames');
  });

  it('Should Space className works', () => {
    const { container } = render(
      <ConfigProvider
        space={{
          className: 'test-classNames',
        }}
      >
        <Space>
          <span>Text1</span>
          <span>Text2</span>
        </Space>
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-space')).toHaveClass('test-classNames');
  });

  it('Should Space styles works', () => {
    const { container } = render(
      <ConfigProvider
        space={{
          styles: {
            item: {
              color: 'red',
            },
          },
        }}
      >
        <Space>
          <span>Text1</span>
          <span>Text2</span>
        </Space>
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-space-item')).toHaveStyle(
      'margin-right: 8px; color: red;',
    );
  });

  it('Should Space style works', () => {
    const { container } = render(
      <ConfigProvider
        space={{
          style: {
            color: 'red',
          },
        }}
      >
        <Space>
          <span>Text1</span>
          <span>Text2</span>
        </Space>
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-space')).toHaveStyle('color: red;');
  });

  it('Should Divider className works', () => {
    const { container } = render(
      <ConfigProvider
        divider={{
          className: 'config-provider-className',
        }}
      >
        <Divider />
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-divider')).toHaveClass('config-provider-className');
  });

  it('Should Divider style works', () => {
    const { container } = render(
      <ConfigProvider
        divider={{
          style: {
            color: 'red',
            height: 80,
          },
        }}
      >
        <Divider />
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-divider'))?.toHaveStyle({ color: 'red', height: '80px' });
  });

  it('Should Cascader className & style works', () => {
    const options = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ];

    const { container } = render(
      <ConfigProvider cascader={{ className: 'cp-cascader', style: { backgroundColor: 'red' } }}>
        <Cascader open options={options} />
      </ConfigProvider>,
    );

    const element = container.querySelector<HTMLElement>('.ant-cascader');
    expect(element).toHaveClass('cp-cascader');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Typography className & style works', () => {
    const { container } = render(
      <ConfigProvider
        typography={{ className: 'cp-typography', style: { backgroundColor: 'red' } }}
      >
        <Typography>test</Typography>
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLElement>('.ant-typography');
    expect(element).toHaveClass('cp-typography');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Spin className & style works', () => {
    const { container } = render(
      <ConfigProvider
        spin={{ className: 'config-provider-spin', style: { backgroundColor: 'red' } }}
      >
        <Spin />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-spin');
    expect(element).toHaveClass('config-provider-spin');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Segmented className & style works', () => {
    const { container } = render(
      <ConfigProvider
        segmented={{ className: 'config-provider-segmented', style: { backgroundColor: 'red' } }}
      >
        <Segmented options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-segmented');
    expect(element).toHaveClass('config-provider-segmented');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Select className & style works', () => {
    const { container } = render(
      <ConfigProvider select={{ className: 'cp-select', style: { backgroundColor: 'red' } }}>
        <Select
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
          ]}
        />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-select');
    expect(element).toHaveClass('cp-select');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Steps className & style works', () => {
    const { container } = render(
      <ConfigProvider
        steps={{ className: 'config-provider-steps', style: { backgroundColor: 'red' } }}
      >
        <Steps items={[{ title: 'title', description: 'description' }]} />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-steps');
    expect(element).toHaveClass('config-provider-steps');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Form className & style works', () => {
    const { container } = render(
      <ConfigProvider form={{ className: 'cp-form', style: { backgroundColor: 'red' } }}>
        <Form name="basic">
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
        </Form>
      </ConfigProvider>,
    );

    const element = container.querySelector<HTMLDivElement>('.ant-form');
    expect(element).toHaveClass('cp-form');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Image className & style works', () => {
    const { container } = render(
      <ConfigProvider
        image={{ className: 'config-provider-image', style: { backgroundColor: 'red' } }}
      >
        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
      </ConfigProvider>,
    );
    const element = container
      ?.querySelector<HTMLDivElement>('.ant-image')
      ?.querySelector<HTMLImageElement>('img');
    expect(element).toHaveClass('config-provider-image');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Input className & style & classNames & styles works', () => {
    const { container } = render(
      <ConfigProvider
        input={{
          className: 'cp-input',
          style: { backgroundColor: 'red' },
          classNames: {
            input: 'cp-classNames-input',
            prefix: 'cp-classNames-prefix',
          },
          styles: {
            input: {
              color: 'blue',
            },
            prefix: {
              color: 'black',
            },
          },
        }}
      >
        <Input placeholder="Basic usage" prefix="￥" />
      </ConfigProvider>,
    );

    const wrapperElement = container.querySelector<HTMLDivElement>('.ant-input-affix-wrapper');
    expect(wrapperElement).toHaveClass('cp-input');
    expect(wrapperElement).toHaveStyle({ backgroundColor: 'red' });

    const prefixElement = container.querySelector<HTMLDivElement>('.ant-input-prefix');
    expect(prefixElement).toHaveClass('cp-classNames-prefix');
    expect(prefixElement).toHaveStyle({ color: 'black' });

    const inputElement = container.querySelector<HTMLDivElement>('.ant-input');
    expect(inputElement).toHaveClass('cp-classNames-input');
    expect(inputElement).toHaveStyle({ color: 'blue' });
  });

  it('Should Layout className & style works', () => {
    const { baseElement } = render(
      <ConfigProvider
        layout={{
          className: 'cp-layout',
          style: {
            background: 'red',
          },
        }}
      >
        <Layout>
          <Layout.Header>Header</Layout.Header>
          <Layout.Content>Content</Layout.Content>
          <Layout.Footer>Footer</Layout.Footer>
        </Layout>
      </ConfigProvider>,
    );

    const element = baseElement.querySelector<HTMLDivElement>('.ant-layout');
    expect(element).toHaveClass('cp-layout');
    expect(element).toHaveStyle({ background: 'red' });
  });

  it('Should Mentions className & style works', () => {
    const { container } = render(
      <ConfigProvider
        mentions={{
          className: 'cp-className',
          style: {
            background: 'red',
          },
        }}
      >
        <Mentions
          defaultValue="@afc163"
          options={[
            {
              value: 'afc163',
              label: 'afc163',
            },
            {
              value: 'zombieJ',
              label: 'zombieJ',
            },
            {
              value: 'yesmeck',
              label: 'yesmeck',
            },
          ]}
        />
      </ConfigProvider>,
    );

    expect(container.querySelector('.ant-mentions')).toHaveClass('cp-className');
    expect(container.querySelector('.ant-mentions')).toHaveStyle({ background: 'red' });
  });

  it('Should Modal className & style works', () => {
    const { baseElement } = render(
      <ConfigProvider
        modal={{
          className: 'cp-modal',
          style: {
            background: 'red',
          },
        }}
      >
        <Modal title="Basic Modal" open>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </ConfigProvider>,
    );

    const element = baseElement.querySelector<HTMLDivElement>('.ant-modal');
    expect(element).toHaveClass('cp-modal');
    expect(element).toHaveStyle({ background: 'red' });
  });

  it('Should Result className & style works', () => {
    const { container } = render(
      <ConfigProvider result={{ className: 'cp-result', style: { backgroundColor: 'red' } }}>
        <Result />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-result');
    expect(element).toHaveClass('cp-result');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Radio className & style works', () => {
    const { container } = render(
      <ConfigProvider
        radio={{
          className: 'cp-className',
          style: {
            background: 'red',
          },
        }}
      >
        <Radio>Radio</Radio>
      </ConfigProvider>,
    );

    expect(container.querySelector('.ant-radio-wrapper')).toHaveClass('cp-className');
    expect(container.querySelector('.ant-radio-wrapper')).toHaveStyle({ background: 'red' });
  });

  it('Should Slider className & style works', () => {
    const { container } = render(
      <ConfigProvider slider={{ className: 'cp-slider', style: { backgroundColor: 'red' } }}>
        <Slider />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-slider');
    expect(element).toHaveClass('cp-slider');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Anchor className & style works', () => {
    const { container } = render(
      <ConfigProvider
        anchor={{
          className: 'cp-className',
          style: {
            background: 'red',
          },
        }}
      >
        <Anchor
          items={[
            {
              key: 'part-1',
              href: '#part-1',
              title: 'Part 1',
            },
            {
              key: 'part-2',
              href: '#part-2',
              title: 'Part 2',
            },
          ]}
        />
      </ConfigProvider>,
    );

    expect(container.querySelector('.ant-anchor-wrapper')).toHaveClass('cp-className');
    expect(container.querySelector('.ant-anchor-wrapper')).toHaveStyle({ background: 'red' });
  });

  it('Should Breadcrumb className & style works', () => {
    const { container } = render(
      <ConfigProvider
        breadcrumb={{ className: 'cp-breadcrumb', style: { backgroundColor: 'red' } }}
      >
        <Breadcrumb />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLElement>('.ant-breadcrumb');
    expect(element).toHaveClass('cp-breadcrumb');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Checkbox className & style works', () => {
    const { container } = render(
      <ConfigProvider
        checkbox={{
          className: 'cp-checkbox',
          style: {
            background: 'red',
          },
        }}
      >
        <Checkbox>Checkbox</Checkbox>
      </ConfigProvider>,
    );

    expect(container.querySelector('.ant-checkbox-wrapper')).toHaveClass('cp-checkbox');
    expect(container.querySelector('.ant-checkbox-wrapper')).toHaveStyle({ background: 'red' });
  });

  it('Should Pagination className & style works', () => {
    const { container } = render(
      <ConfigProvider
        pagination={{ className: 'cp-pagination', style: { backgroundColor: 'blue' } }}
      >
        <Pagination />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLUListElement>('.ant-pagination');
    expect(element).toHaveClass('cp-pagination');
    expect(element).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('Should Descriptions className & style works', () => {
    const { container } = render(
      <ConfigProvider
        descriptions={{
          className: 'cp-className',
          style: {
            background: 'red',
          },
        }}
      >
        <Descriptions title="User Info">
          <Descriptions.Item label="UserName">muxin</Descriptions.Item>
        </Descriptions>
      </ConfigProvider>,
    );

    expect(container.querySelector('.ant-descriptions')).toHaveClass('cp-className');
    expect(container.querySelector('.ant-descriptions')).toHaveStyle({ background: 'red' });
  });

  it('Should Empty className & style works', () => {
    const { container } = render(
      <ConfigProvider
        empty={{
          className: 'cp-className',
          style: {
            background: 'red',
          },
        }}
      >
        <Empty />
      </ConfigProvider>,
    );

    expect(container.querySelector('.ant-empty')).toHaveClass('cp-className');
    expect(container.querySelector('.ant-empty')).toHaveStyle({ background: 'red' });
  });

  it('Should Badge className & style & classNames works', () => {
    const { container } = render(
      <ConfigProvider
        badge={{
          className: 'cp-badge',
          style: {
            backgroundColor: 'blue',
          },
          classNames: {
            root: 'cp-badge-root',
            indicator: 'cp-badge-indicator',
          },
          styles: {
            root: { color: 'yellow' },
            indicator: { color: 'green' },
          },
        }}
      >
        <Badge count={10}>test</Badge>
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLSpanElement>('.ant-badge');

    // test className
    expect(element).toHaveClass('cp-badge');
    expect(element).toHaveClass('cp-badge-root');
    expect(element?.querySelector<HTMLElement>('sup')).toHaveClass('cp-badge-indicator');

    // test style
    expect(element).toHaveStyle({ color: 'yellow' });
    expect(element?.querySelector<HTMLElement>('sup')).toHaveStyle({
      color: 'green',
      backgroundColor: 'blue',
    });
  });

  it('Should Rate className & style works', () => {
    const { container } = render(
      <ConfigProvider rate={{ className: 'cp-rate', style: { backgroundColor: 'blue' } }}>
        <Rate />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLUListElement>('.ant-rate');
    expect(element).toHaveClass('cp-rate');
    expect(element).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('Should Switch className & style works', () => {
    const { container } = render(
      <ConfigProvider switch={{ className: 'cp-switch', style: { backgroundColor: 'blue' } }}>
        <Switch />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLButtonElement>('.ant-switch');
    expect(element).toHaveClass('cp-switch');
    expect(element).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('Should Avatar className & style works', () => {
    const { container } = render(
      <ConfigProvider avatar={{ className: 'cp-avatar', style: { backgroundColor: 'blue' } }}>
        <Avatar />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLSpanElement>('.ant-avatar');
    expect(element).toHaveClass('cp-avatar');
    expect(element).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('Should Tag className & style works', () => {
    const { container } = render(
      <ConfigProvider tag={{ className: 'cp-tag', style: { backgroundColor: 'blue' } }}>
        <Tag>Test</Tag>
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLSpanElement>('.ant-tag');
    expect(element).toHaveClass('cp-tag');
    expect(element).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('Should Table className & style works', () => {
    const { container } = render(
      <ConfigProvider table={{ className: 'cp-table', style: { backgroundColor: 'blue' } }}>
        <Table dataSource={[]} />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-table-wrapper');
    expect(element).toHaveClass('cp-table');
    expect(element).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('Should Card className & style works', () => {
    const { container } = render(
      <ConfigProvider card={{ className: 'cp-card', style: { backgroundColor: 'blue' } }}>
        <Card>test</Card>
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-card');
    expect(element).toHaveClass('cp-card');
    expect(element).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('Should Tabs className & style works', () => {
    const { container } = render(
      <ConfigProvider tabs={{ className: 'cp-tabs', style: { backgroundColor: 'red' } }}>
        <Tabs />
      </ConfigProvider>,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-tabs');
    expect(element).toHaveClass('cp-tabs');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('Should Upload className & style works', () => {
    const { container } = render(
      <ConfigProvider upload={{ className: 'cp-upload', style: { color: 'blue' } }}>
        <Upload type="drag">upload</Upload>
      </ConfigProvider>,
    );
    const element = container?.querySelector<HTMLSpanElement>('.ant-upload-wrapper');
    expect(element).toHaveClass('cp-upload');
    expect(element?.querySelector<HTMLDivElement>('.ant-upload')).toHaveStyle({ color: 'blue' });
  });
});
