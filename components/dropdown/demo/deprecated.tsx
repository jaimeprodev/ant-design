import React from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            1st menu item
          </a>
        ),
      },
      {
        key: '2',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
            2nd menu item (disabled)
          </a>
        ),
        icon: <SmileOutlined />,
        disabled: true,
      },
      {
        key: '3',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
            3rd menu item (disabled)
          </a>
        ),
        disabled: true,
      },
      {
        key: '4',
        danger: true,
        label: 'a danger item',
      },
    ]}
  />
);

const App: React.FC = () => (
  <Dropdown overlay={menu}>
    <a onClick={e => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
