import { mount } from 'enzyme';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import React from 'react';
import Popconfirm from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, sleep, act } from '../../../tests/utils';
import Button from '../../button';

describe('Popconfirm', () => {
  mountTest(Popconfirm);
  rtlTest(Popconfirm);

  const eventObject = expect.objectContaining({
    target: expect.anything(),
    preventDefault: expect.any(Function),
  });

  beforeAll(() => {
    spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => ({}),
    });
  });

  it('should popup Popconfirm dialog', () => {
    const onOpenChange = jest.fn();

    const wrapper = mount(
      <Popconfirm
        title={<span className="popconfirm-test">Are you sure delete this task?</span>}
        okText="Yes"
        cancelText="No"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
      >
        <span>Delete</span>
      </Popconfirm>,
    );

    const triggerNode = wrapper.find('span').at(0);
    triggerNode.simulate('click');
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined);
    expect(wrapper.find('.popconfirm-test').length).toBe(1);

    triggerNode.simulate('click');
    expect(onOpenChange).toHaveBeenLastCalledWith(false, undefined);
  });

  it('should show overlay when trigger is clicked', async () => {
    const ref = React.createRef();
    const popconfirm = mount(
      <Popconfirm ref={ref} title="code">
        <span>show me your code</span>
      </Popconfirm>,
    );

    expect(ref.current.getPopupDomNode()).toBe(null);

    popconfirm.find('span').simulate('click');
    await sleep(100);

    const popup = ref.current.getPopupDomNode();
    expect(popup).not.toBe(null);
    expect(popup.className).toContain('ant-popover-placement-top');
    expect(popup.innerHTML).toMatchSnapshot();
    expect(popup.innerHTML).toMatchSnapshot();
  });

  it('shows content for render functions', async () => {
    const makeRenderFunction = content => () => content;
    const ref = React.createRef();

    const popconfirm = mount(
      <Popconfirm ref={ref} title={makeRenderFunction('some-title')}>
        <span>show me your code</span>
      </Popconfirm>,
    );

    expect(ref.current.getPopupDomNode()).toBe(null);

    popconfirm.find('span').simulate('click');
    await sleep(100);

    const popup = ref.current.getPopupDomNode();
    expect(popup).not.toBe(null);
    expect(popup.innerHTML).toContain('some-title');
    expect(popup.innerHTML).toMatchSnapshot();
  });

  it('should be controlled by open', () => {
    const ref = React.createRef();
    jest.useFakeTimers();
    const popconfirm = mount(
      <Popconfirm ref={ref} title="code">
        <span>show me your code</span>
      </Popconfirm>,
    );
    expect(ref.current.getPopupDomNode()).toBeFalsy();
    popconfirm.setProps({ open: true });
    expect(ref.current.getPopupDomNode()).toBeTruthy();
    expect(ref.current.getPopupDomNode().className).not.toContain('ant-popover-hidden');
    popconfirm.setProps({ open: false });
    popconfirm.update(); // https://github.com/enzymejs/enzyme/issues/2305
    act(() => {
      jest.runAllTimers();
    });
    expect(popconfirm.find('Trigger').props().popupVisible).toBe(false);
    jest.useRealTimers();
  });

  it('should trigger onConfirm and onCancel', () => {
    const confirm = jest.fn();
    const cancel = jest.fn();
    const onOpenChange = jest.fn();
    const popconfirm = mount(
      <Popconfirm title="code" onConfirm={confirm} onCancel={cancel} onOpenChange={onOpenChange}>
        <span>show me your code</span>
      </Popconfirm>,
    );
    const triggerNode = popconfirm.find('span').at(0);
    triggerNode.simulate('click');
    popconfirm.find('.ant-btn-primary').simulate('click');
    expect(confirm).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, eventObject);
    triggerNode.simulate('click');
    popconfirm.find('.ant-btn').at(0).simulate('click');
    expect(cancel).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, eventObject);
  });

  it('should support onConfirm to return Promise', async () => {
    const confirm = () =>
      new Promise(res => {
        setTimeout(res, 300);
      });
    const onOpenChange = jest.fn();
    const popconfirm = mount(
      <Popconfirm title="code" onConfirm={confirm} onOpenChange={onOpenChange}>
        <span>show me your code</span>
      </Popconfirm>,
    );

    const triggerNode = popconfirm.find('span').at(0);
    triggerNode.simulate('click');
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    popconfirm.find('.ant-btn').at(0).simulate('click');
    await sleep(400);
    expect(onOpenChange).toHaveBeenCalledWith(false, eventObject);
  });

  it('should support customize icon', () => {
    const wrapper = mount(
      <Popconfirm title="code" icon={<span className="customize-icon">custom-icon</span>}>
        <span>show me your code</span>
      </Popconfirm>,
    );

    const triggerNode = wrapper.find('span').at(0);
    triggerNode.simulate('click');
    expect(wrapper.find('.customize-icon').length).toBe(1);
  });

  it('should prefixCls correctly', () => {
    const btnPrefixCls = 'custom-btn';
    const wrapper = mount(
      <Popconfirm
        open
        title="x"
        prefixCls="custom-popconfirm"
        okButtonProps={{ prefixCls: btnPrefixCls }}
        cancelButtonProps={{ prefixCls: btnPrefixCls }}
      >
        <span>show me your code</span>
      </Popconfirm>,
    );

    expect(wrapper.find('.custom-popconfirm').length).toBeGreaterThan(0);
    expect(wrapper.find('.custom-btn').length).toBeGreaterThan(0);
  });

  it('should support defaultOpen', () => {
    const ref = React.createRef();
    mount(
      <Popconfirm ref={ref} title="code" defaultOpen>
        <span>show me your code</span>
      </Popconfirm>,
    );
    expect(ref.current.getPopupDomNode()).toBeTruthy();
  });

  it('should not open in disabled', () => {
    const ref = React.createRef();

    const popconfirm = mount(
      <Popconfirm ref={ref} title="code" disabled>
        <span>click me</span>
      </Popconfirm>,
    );
    const triggerNode = popconfirm.find('span').at(0);
    triggerNode.simulate('click');
    expect(ref.current.getPopupDomNode()).toBeFalsy();
  });

  it('should be closed by pressing ESC', () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(
      <Popconfirm title="title" mouseEnterDelay={0} mouseLeaveDelay={0} onOpenChange={onOpenChange}>
        <span>Delete</span>
      </Popconfirm>,
    );
    const triggerNode = wrapper.find('span').at(0);
    triggerNode.simulate('click');
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined);
    triggerNode.simulate('keydown', { key: 'Escape', keyCode: 27 });
    expect(onOpenChange).toHaveBeenLastCalledWith(false, eventObject);
  });

  it('should not warn memory leaking if setState in async callback', async () => {
    const error = jest.spyOn(console, 'error');

    const Test = () => {
      const [show, setShow] = React.useState(true);

      if (show) {
        return (
          <Popconfirm
            title="will unmount"
            onConfirm={() =>
              new Promise(resolve => {
                setTimeout(() => {
                  setShow(false);
                  resolve();
                }, 300);
              })
            }
          >
            <Button className="clickTarget">Test</Button>
          </Popconfirm>
        );
      }
      return <Button>Unmounted</Button>;
    };

    const { container } = render(
      <div>
        <Test />
      </div>,
    );

    expect(container.textContent).toEqual('Test');

    fireEvent.click(container.querySelector('.clickTarget'));
    fireEvent.click(container.querySelector('.ant-btn-primary'));

    await sleep(500);
    // expect(container.textContent).toEqual('Unmounted');
    expect(error).not.toHaveBeenCalled();
  });
});
