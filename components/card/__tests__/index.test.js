import React from 'react';
import { mount } from 'enzyme';
import Card from '../index';
import Button from '../../button/index';

const testMethod = typeof window !== 'undefined' ? it : xit;

describe('Card', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  function fakeResizeWindowTo(wrapper, width) {
    Object.defineProperties(wrapper.instance().container, {
      offsetWidth: {
        get() {
          return width;
        },
        configurable: true,
      },
    });
    window.resizeTo(width);
  }

  testMethod('resize card will trigger different padding', () => {
    const wrapper = mount(<Card title="xxx">xxx</Card>);
    fakeResizeWindowTo(wrapper, 1000);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.ant-card-wider-padding').length).toBe(1);
    fakeResizeWindowTo(wrapper, 800);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.ant-card-wider-padding').length).toBe(0);
  });

  it('should still have padding when card which set padding to 0 is loading', () => {
    const wrapper = mount(
      <Card loading bodyStyle={{ padding: 0 }}>
        xxx
      </Card>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('title should be vertically aligned', () => {
    const wrapper = mount(
      <Card title="Card title" extra={<Button>Button</Button>} style={{ width: 300 }}>
        <p>Card content</p>
      </Card>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('warning', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(<Card noHovering>xxx</Card>);
    expect(warnSpy).toBeCalledWith(
      'Warning: [antd: Card] `noHovering` is deprecated, you can remove it safely or use `hoverable` instead.',
    );
    mount(<Card noHovering={false}>xxx</Card>);
    expect(warnSpy).toBeCalledWith(
      'Warning: [antd: Card] `noHovering={false}` is deprecated, use `hoverable` instead.',
    );
    warnSpy.mockRestore();
  });

  it('unmount', () => {
    const wrapper = mount(<Card>xxx</Card>);
    const removeResizeEventSpy = jest.spyOn(wrapper.instance().resizeEvent, 'remove');
    wrapper.unmount();
    expect(removeResizeEventSpy).toHaveBeenCalled();
  });

  it('onTabChange should work', () => {
    const onTabChange = key => expect(key).toBe('test');
    const wrapper = mount(<Card onTabChange={onTabChange}>xxx</Card>).instance();
    wrapper.onTabChange('test');
  });

  it('getAction should work', () => {
    const wrapper = mount(<Card>xxx</Card>).instance();
    expect(wrapper.getAction([])).toBe(null);
  });

  it('getCompatibleHoverable should work', () => {
    const wrapper = mount(<Card noHovering={false}>xxx</Card>).instance();
    expect(wrapper.getCompatibleHoverable()).toBe(true);
  });
});
