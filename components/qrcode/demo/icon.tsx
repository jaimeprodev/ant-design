import React from 'react';
import { QRCode } from 'antd';

const App: React.FC = () => (
  <QRCode
    value="https://ant.design/"
    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
  />
);

export default App;
