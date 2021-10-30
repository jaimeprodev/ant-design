import React from 'react';
import { mount } from 'enzyme';
import InputNumber from '..';
import focusTest from '../../../tests/shared/focusTest';

describe('prefix', () => {
  focusTest(
    React.forwardRef((props, ref) => <InputNumber {...props} prefix="A" ref={ref} />),
    { refFocus: true },
  );
  it('should support className when has prefix', () => {
    const wrapper = mount(<InputNumber prefix="suffix" className="my-class-name" />);
    expect(wrapper.getDOMNode().className.includes('my-class-name')).toBe(true);
    expect(wrapper.find('input').getDOMNode().className.includes('my-class-name')).toBe(false);
  });

  it('should trigger focus when prefix is clicked', () => {
    const wrapper = mount(<InputNumber prefix={<i>123</i>} />);

    const mockFocus = jest.spyOn(wrapper.find('input').getDOMNode(), 'focus');
    wrapper.find('i').simulate('mouseUp');
    expect(mockFocus).toBeCalled();
  });
});
