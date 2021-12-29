import React, { useState } from 'react';
import { mount } from 'enzyme';
// eslint-disable-next-line import/no-unresolved
import Form from '../../form';
import Input from '..';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('Input', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  focusTest(Input);
  mountTest(Input);
  mountTest(Input.Group);

  rtlTest(Input);
  rtlTest(Input.Group);

  it('should support maxLength', () => {
    const wrapper = mount(<Input maxLength={3} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('select()', () => {
    const wrapper = mount(<Input />);
    wrapper.instance().select();
  });

  it('should support size', () => {
    const wrapper = mount(<Input size="large" />);
    expect(wrapper.find('input').hasClass('ant-input-lg')).toBe(true);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('should support size in form', () => {
    const wrapper = mount(
      <Form size="large">
        <Form.Item>
          <Input />
        </Form.Item>
      </Form>,
    );
    expect(wrapper.find('input').hasClass('ant-input-lg')).toBe(true);
    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('focus trigger warning', () => {
    it('not trigger', () => {
      const wrapper = mount(<Input suffix="bamboo" />);
      wrapper.find('input').instance().focus();
      wrapper.setProps({
        suffix: 'light',
      });
      expect(errorSpy).not.toHaveBeenCalled();
    });
    it('trigger warning', () => {
      const wrapper = mount(<Input />, { attachTo: document.body });
      wrapper.find('input').instance().focus();
      wrapper.setProps({
        suffix: 'light',
      });
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: [antd: Input] When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change. Read more: https://ant.design/components/input/#FAQ',
      );
      wrapper.unmount();
    });
  });

  it('set mouse cursor position', () => {
    const defaultValue = '11111';
    const valLength = defaultValue.length;
    const wrapper = mount(<Input autoFocus defaultValue={defaultValue} />);
    wrapper.instance().setSelectionRange(valLength, valLength);
    expect(wrapper.instance().input.selectionStart).toEqual(5);
    expect(wrapper.instance().input.selectionEnd).toEqual(5);
  });
});

describe('prefix and suffix', () => {
  it('should support className when has suffix', () => {
    const wrapper = mount(<Input suffix="suffix" className="my-class-name" />);
    expect(wrapper.getDOMNode().className.includes('my-class-name')).toBe(true);
    expect(wrapper.find('input').getDOMNode().className.includes('my-class-name')).toBe(false);
  });

  it('should support className when has prefix', () => {
    const wrapper = mount(<Input prefix="prefix" className="my-class-name" />);
    expect(wrapper.getDOMNode().className.includes('my-class-name')).toBe(true);
    expect(wrapper.find('input').getDOMNode().className.includes('my-class-name')).toBe(false);
  });
});

describe('As Form Control', () => {
  it('should be reset when wrapped in form.getFieldDecorator without initialValue', () => {
    const Demo = () => {
      const [form] = Form.useForm();
      const reset = () => {
        form.resetFields();
      };

      return (
        <Form form={form}>
          <Form.Item name="input">
            <Input />
          </Form.Item>
          <Form.Item name="textarea">
            <Input.TextArea />
          </Form.Item>
          <button type="button" onClick={reset}>
            reset
          </button>
        </Form>
      );
    };

    const wrapper = mount(<Demo />);
    wrapper.find('input').simulate('change', { target: { value: '111' } });
    wrapper.find('textarea').simulate('change', { target: { value: '222' } });
    expect(wrapper.find('input').prop('value')).toBe('111');
    expect(wrapper.find('textarea').prop('value')).toBe('222');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('input').prop('value')).toBe('');
    expect(wrapper.find('textarea').prop('value')).toBe('');
  });
});

describe('should support showCount', () => {
  it('maxLength', () => {
    const wrapper = mount(<Input maxLength={5} showCount value="12345" />);
    expect(wrapper.find('input').prop('value')).toBe('12345');
    expect(wrapper.find('.ant-input-show-count-suffix').getDOMNode().innerHTML).toBe('5 / 5');
  });

  it('control exceed maxLength', () => {
    const wrapper = mount(<Input maxLength={5} showCount value="12345678" />);
    expect(wrapper.find('input').prop('value')).toBe('12345678');
    expect(wrapper.find('.ant-input-show-count-suffix').getDOMNode().innerHTML).toBe('8 / 5');
  });

  describe('emoji', () => {
    it('should minimize value between emoji length and maxLength', () => {
      const wrapper = mount(<Input maxLength={1} showCount value="👀" />);
      expect(wrapper.find('input').prop('value')).toBe('👀');
      expect(wrapper.find('.ant-input-show-count-suffix').getDOMNode().innerHTML).toBe('1 / 1');

      const wrapper1 = mount(<Input maxLength={2} showCount value="👀" />);
      expect(wrapper1.find('.ant-input-show-count-suffix').getDOMNode().innerHTML).toBe('1 / 2');
    });

    it('slice emoji', () => {
      const wrapper = mount(<Input maxLength={5} showCount value="1234😂" />);
      expect(wrapper.find('input').prop('value')).toBe('1234😂');
      expect(wrapper.find('.ant-input-show-count-suffix').getDOMNode().innerHTML).toBe('5 / 5');
    });
  });

  it('count formatter', () => {
    const wrapper = mount(
      <Input
        maxLength={5}
        showCount={{ formatter: ({ count, maxLength }) => `${count}, ${maxLength}` }}
        value="12345"
      />,
    );
    expect(wrapper.find('input').prop('value')).toBe('12345');
    expect(wrapper.find('.ant-input-show-count-suffix').getDOMNode().innerHTML).toBe('5, 5');
  });
});

describe('Input allowClear', () => {
  it('should change type when click', () => {
    const wrapper = mount(<Input allowClear />);
    wrapper.find('input').simulate('change', { target: { value: '111' } });
    expect(wrapper.find('input').getDOMNode().value).toEqual('111');
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find('.ant-input-clear-icon').at(0).simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
    expect(wrapper.find('input').getDOMNode().value).toEqual('');
  });

  it('should not show icon if value is undefined, null or empty string', () => {
    const wrappers = [null, undefined, ''].map(val => mount(<Input allowClear value={val} />));
    wrappers.forEach(wrapper => {
      expect(wrapper.find('input').getDOMNode().value).toEqual('');
      expect(wrapper.find('.ant-input-clear-icon-hidden').exists()).toBeTruthy();
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('should not show icon if defaultValue is undefined, null or empty string', () => {
    const wrappers = [null, undefined, ''].map(val =>
      mount(<Input allowClear defaultValue={val} />),
    );
    wrappers.forEach(wrapper => {
      expect(wrapper.find('input').getDOMNode().value).toEqual('');
      expect(wrapper.find('.ant-input-clear-icon-hidden').exists()).toBeTruthy();
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('should trigger event correctly', () => {
    let argumentEventObject;
    let argumentEventObjectValue;
    const onChange = e => {
      argumentEventObject = e;
      argumentEventObjectValue = e.target.value;
    };
    const wrapper = mount(<Input allowClear defaultValue="111" onChange={onChange} />);
    wrapper.find('.ant-input-clear-icon').at(0).simulate('click');
    expect(argumentEventObject.type).toBe('click');
    expect(argumentEventObjectValue).toBe('');
    expect(wrapper.find('input').at(0).getDOMNode().value).toBe('');
  });

  it('should trigger event correctly on controlled mode', () => {
    let argumentEventObject;
    let argumentEventObjectValue;
    const onChange = e => {
      argumentEventObject = e;
      argumentEventObjectValue = e.target.value;
    };
    const wrapper = mount(<Input allowClear value="111" onChange={onChange} />);
    wrapper.find('.ant-input-clear-icon').at(0).simulate('click');
    expect(argumentEventObject.type).toBe('click');
    expect(argumentEventObjectValue).toBe('');
    expect(wrapper.find('input').at(0).getDOMNode().value).toBe('111');
  });

  it('should focus input after clear', () => {
    const wrapper = mount(<Input allowClear defaultValue="111" />, { attachTo: document.body });
    wrapper.find('.ant-input-clear-icon').at(0).simulate('click');
    expect(document.activeElement).toBe(wrapper.find('input').at(0).getDOMNode());
    wrapper.unmount();
  });

  ['disabled', 'readOnly'].forEach(prop => {
    it(`should not support allowClear when it is ${prop}`, () => {
      const wrapper = mount(<Input allowClear defaultValue="111" {...{ [prop]: true }} />);
      expect(wrapper.find('.ant-input-clear-icon-hidden').exists()).toBeTruthy();
    });
  });

  // https://github.com/ant-design/ant-design/issues/27444
  it('should support className', () => {
    const wrapper = mount(<Input allowClear className="my-class-name" />);
    expect(wrapper.getDOMNode().className.includes('my-class-name')).toBe(true);
    expect(wrapper.find('input').getDOMNode().className.includes('my-class-name')).toBe(false);
  });

  // https://github.com/ant-design/ant-design/issues/31200
  it('should not lost focus when clear input', () => {
    const onBlur = jest.fn();
    const wrapper = mount(<Input allowClear defaultValue="value" onBlur={onBlur} />, {
      attachTo: document.body,
    });
    wrapper.find('input').getDOMNode().focus();
    wrapper.find('.ant-input-clear-icon').at(0).simulate('mouseDown');
    wrapper.find('.ant-input-clear-icon').at(0).simulate('click');
    wrapper.find('.ant-input-clear-icon').at(0).simulate('mouseUp');
    wrapper.find('.ant-input-clear-icon').at(0).simulate('focus');
    wrapper.find('.ant-input-clear-icon').at(0).getDOMNode().click();
    expect(onBlur).not.toBeCalled();
    wrapper.unmount();
  });

  // https://github.com/ant-design/ant-design/issues/31927
  it('should correctly when useState', () => {
    const App = () => {
      const [query, setQuery] = useState('');
      return (
        <Input
          allowClear
          value={query}
          onChange={e => {
            setQuery(() => e.target.value);
          }}
        />
      );
    };

    const wrapper = mount(<App />);

    wrapper.find('input').getDOMNode().focus();
    wrapper.find('input').simulate('change', { target: { value: '111' } });
    expect(wrapper.find('input').getDOMNode().value).toEqual('111');

    wrapper.find('.ant-input-clear-icon').at(0).simulate('click');
    expect(wrapper.find('input').getDOMNode().value).toEqual('');

    wrapper.unmount();
  });

  it('not crash when value is number', () => {
    const wrapper = mount(<Input suffix="Bamboo" value={1} />);
    expect(wrapper).toBeTruthy();
  });
});
