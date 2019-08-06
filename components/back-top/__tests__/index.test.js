import React from 'react';
import { mount } from 'enzyme';
import BackTop from '..';

describe('BackTop', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('should scroll to top after click it', async () => {
    const wrapper = mount(<BackTop visibilityHeight={-1} />);
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      const w = window;
      w.scrollY = y;
      w.pageYOffset = y;
    });
    window.scrollTo(0, 400);
    // trigger scroll manually
    wrapper.instance().handleScroll();
    jest.runAllTimers();
    wrapper.find('.ant-back-top').simulate('click');
    jest.runAllTimers();
    expect(window.pageYOffset).toBe(0);
    scrollToSpy.mockRestore();
  });
});
