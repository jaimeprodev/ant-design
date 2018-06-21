import React from 'react';
import { mount } from 'enzyme';
import Drawer from '..';


class DrawerTester extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  componentDidMount() {
    this.setState({ visible: true }); // eslint-disable-line react/no-did-mount-set-state
  }
  saveContainer = (container) => {
    this.container = container;
  }
  getContainer = () => {
    return this.container;
  }
  render() {
    return (
      <div>
        <div ref={this.saveContainer} />
        <Drawer
          visible={this.state.visible}
          getContainer={this.getContainer}
          {...this.props}
        >
          Here is content of Drawer
        </Drawer>
      </div>
    );
  }
}

describe('Drawer', () => {
  it('render correctly', () => {
    const wrapper = mount(<DrawerTester />);
    const content = wrapper.find('.ant-drawer-body').getDOMNode().innerHTML;
    expect(content).toBe('Here is content of Drawer');
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('have a title', () => {
    const wrapper = mount(<DrawerTester title="Test Title" />);
    const title = wrapper.find('.ant-drawer-title').getDOMNode().innerHTML;
    expect(title).toBe('Test Title');
    const closable = wrapper.find('.ant-drawer-close').exists();
    expect(closable).toBe(true);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('closable is false', () => {
    const wrapper = mount(<DrawerTester closable={false} />);
    const closable = wrapper.find('.ant-drawer-close').exists();
    expect(closable).toBe(false);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('destroyOnClose is true', () => {
    const wrapper = mount(<DrawerTester destroyOnClose visible={false} />);
    const body = wrapper.find('.ant-drawer-body').exists();
    expect(body).toBe(false);
    expect(wrapper.render()).toMatchSnapshot();
  });
});
