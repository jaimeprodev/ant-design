import * as React from 'react';
import Drawer from '..';

describe('Drawer.typescript', () => {
  it('Drawer', () => {
    const onClose = vi.fn();
    const wrapper = (
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        open={false}
        contentWrapperStyle={{
          background: '#f00',
        }}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    );

    expect(wrapper).toBeTruthy();
  });
});
