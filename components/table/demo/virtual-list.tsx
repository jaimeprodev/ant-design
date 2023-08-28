import React from 'react';
import { Space, Table, Typography, Switch } from 'antd';
import type { TableProps } from 'antd';

interface RecordType {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  address1: string;
  address2: string;
  address3: string;
}

const columns: TableProps<RecordType>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'FistName',
    dataIndex: 'firstName',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'LastName',
    dataIndex: 'lastName',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Group',
    width: 120,
    render: (_, record) => `Group ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 100,
  },
  {
    title: 'Address 1',
    dataIndex: 'address1',
  },
  {
    title: 'Address 2',
    dataIndex: 'address2',
  },
  {
    title: 'Address 3',
    dataIndex: 'address3',
  },
  {
    title: 'Action',
    width: 150,
    fixed: 'right',
    render: () => (
      <Space>
        <Typography.Link>Action1</Typography.Link>
        <Typography.Link>Action2</Typography.Link>
      </Space>
    ),
  },
];

const data: RecordType[] = new Array(10000).fill(null).map((_, index) => ({
  id: index,
  firstName: `First_${index.toString(16)}`,
  lastName: `Last_${index.toString(16)}`,
  age: 25 + (index % 10),
  address1: `New York No. ${index} Lake Park`,
  address2: `London No. ${index} Lake Park`,
  address3: `Sydney No. ${index} Lake Park`,
}));

const App = () => {
  const [bordered, setBordered] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);

  const mergedColumns = React.useMemo<typeof columns>(() => {
    if (!expanded) {
      return columns;
    }

    return columns.map((col) => ({ ...col, onCell: undefined }));
  }, [expanded]);

  const expandableProps = React.useMemo<TableProps<RecordType>['expandable']>(() => {
    if (!expanded) {
      return undefined;
    }

    return {
      columnWidth: 48,
      expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.address1}</p>,
      rowExpandable: (record) => record.id % 2 === 0,
    };
  }, [expanded]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Switch
          checked={bordered}
          onChange={() => setBordered(!bordered)}
          checkedChildren="Bordered"
          unCheckedChildren="Bordered"
        />
        <Switch
          checked={expanded}
          onChange={() => setExpanded(!expanded)}
          checkedChildren="Expandable"
          unCheckedChildren="Expandable"
        />
        <Switch
          checked={empty}
          onChange={() => setEmpty(!empty)}
          checkedChildren="Empty"
          unCheckedChildren="Empty"
        />
      </Space>

      <Table
        bordered={bordered}
        virtual
        columns={mergedColumns}
        scroll={{ x: 2500, y: 400 }}
        rowKey="id"
        dataSource={empty ? [] : data}
        pagination={false}
        rowSelection={
          expanded
            ? undefined
            : {
                type: 'radio',
                columnWidth: 48,
              }
        }
        expandable={expandableProps}
      />
    </Space>
  );
};

export default App;
