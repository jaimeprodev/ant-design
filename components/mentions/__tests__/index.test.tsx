import React from 'react';
import Mentions from '..';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, render, fireEvent } from '../../../tests/utils';

const { getMentions } = Mentions;

function simulateInput(wrapper: ReturnType<typeof render>, text: string, keyEvent?: Event): void {
  const lastChar = text[text.length - 1];
  const myKeyEvent = keyEvent || {
    which: lastChar.charCodeAt(0),
    key: lastChar,
    target: {
      value: text,
      selectionStart: text.length,
    },
  };

  fireEvent.keyDown(wrapper.container.querySelector('textarea')!, myKeyEvent);

  const textareaInstance = wrapper.container.querySelector('textarea');

  if (textareaInstance) {
    textareaInstance.value = text;
    textareaInstance.selectionStart = text.length;
    textareaInstance.selectionStart = text.length;
  }

  if (!keyEvent) {
    fireEvent.change(wrapper.container.querySelector('textarea')!, { target: { value: text } });
  }
  fireEvent.keyUp(wrapper.container.querySelector('textarea')!, myKeyEvent);
}

describe('Mentions', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('getMentions', () => {
    const mentions = getMentions('@light #bamboo cat', { prefix: ['@', '#'] });
    expect(mentions).toEqual([
      { prefix: '@', value: 'light' },
      { prefix: '#', value: 'bamboo' },
    ]);
  });

  it('focus', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const { container } = render(<Mentions onFocus={onFocus} onBlur={onBlur} />);
    fireEvent.focus(container.querySelector('textarea')!);
    expect(container.querySelector('.ant-mentions')).toHaveClass('ant-mentions-focused');
    expect(onFocus).toHaveBeenCalled();
    fireEvent.blur(container.querySelector('textarea')!);
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector('.ant-mentions')).not.toHaveClass('ant-mentions-focused');
    expect(onBlur).toHaveBeenCalled();
  });

  focusTest(Mentions, { refFocus: true });
  mountTest(Mentions);
  rtlTest(Mentions);

  it('loading', () => {
    const wrapper = render(<Mentions loading />);
    simulateInput(wrapper, '@');
    expect(wrapper.container.querySelectorAll('li.ant-mentions-dropdown-menu-item').length).toBe(1);
    expect(wrapper.container.querySelectorAll('.ant-spin').length).toBeTruthy();
  });

  it('notFoundContent', () => {
    const wrapper = render(<Mentions notFoundContent={<span className="bamboo-light" />} />);
    simulateInput(wrapper, '@');
    expect(wrapper.container.querySelectorAll('li.ant-mentions-dropdown-menu-item').length).toBe(1);
    expect(wrapper.container.querySelectorAll('.bamboo-light').length).toBeTruthy();
  });
});
