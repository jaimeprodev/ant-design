import { Image } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <Image
    width={200}
    preview={{
      imageRender: () => (
        <video
          muted
          width="100%"
          controls
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
        />
      ),
      toolbarRender: (_, { icons: { closeIcon } }) => (
        <ul className="ant-image-preview-operations">{closeIcon}</ul>
      ),
    }}
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  />
);

export default App;
