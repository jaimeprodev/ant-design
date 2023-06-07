import React from 'react';
import BackTop from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';

describe('BackTop', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  mountTest(BackTop);
  rtlTest(BackTop);

  it('should scroll to top after click it', async () => {
    const { container } = render(<BackTop />);
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation((_, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
      document.documentElement.scrollTop = y;
    });
    window.scrollTo(0, 400);
    await waitFakeTimer();
    expect(document.documentElement.scrollTop).toBe(400);
    fireEvent.click(container.querySelector<HTMLDivElement>('.ant-back-top')!);
    await waitFakeTimer();
    expect(document.documentElement.scrollTop).toBe(0);
    scrollToSpy.mockRestore();
  });

  it('support onClick', () => {
    const onClick = vi.fn();
    const { container } = render(<BackTop onClick={onClick} visibilityHeight={0} />);
    fireEvent.click(container.querySelector<HTMLDivElement>('.ant-back-top')!);
    expect(onClick).toHaveBeenCalled();
  });

  it('invalid target', () => {
    const onClick = vi.fn();
    const { container } = render(<BackTop onClick={onClick} target={undefined} />);
    fireEvent.click(container.querySelector<HTMLDivElement>('.ant-back-top')!);
    expect(onClick).toHaveBeenCalled();
  });
  it('should console Error', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<BackTop />);
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: BackTop] `BackTop` is deprecated, please use `FloatButton.BackTop` instead.',
    );
    errSpy.mockRestore();
  });
});
