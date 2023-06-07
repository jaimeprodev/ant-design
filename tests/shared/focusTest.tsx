import React from 'react';
import { fireEvent, render, sleep } from '../utils';

const focusTest = (
  Component: React.ComponentType<any>,
  { refFocus = false, blurDelay = 0 } = {},
) => {
  describe('focus and blur', () => {
    let focused = false;
    let blurred = false;
    const mockFocus = vi.spyOn(HTMLElement.prototype, 'focus');
    const mockBlur = vi.spyOn(HTMLElement.prototype, 'blur');

    beforeAll(() => {
      if (refFocus) {
        mockFocus.mockImplementation(() => {
          focused = true;
        });
        mockBlur.mockImplementation(() => {
          blurred = true;
        });
      }
    });

    let containerHtml: HTMLDivElement;
    beforeEach(() => {
      containerHtml = document.createElement('div');
      document.body.appendChild(containerHtml);
      focused = false;
      blurred = false;
    });

    afterAll(() => {
      mockFocus.mockRestore();
      mockBlur.mockRestore();
    });

    afterEach(() => {
      document.body.removeChild(containerHtml);
    });

    const getElement = (container: HTMLElement) =>
      container.querySelector('input') ||
      container.querySelector('button') ||
      container.querySelector('textarea') ||
      container.querySelector('div[tabIndex]');

    if (refFocus) {
      it('Ref: focus() and onFocus', () => {
        const onFocus = vi.fn();
        const ref = React.createRef<any>();
        const { container } = render(
          <div>
            <Component onFocus={onFocus} ref={ref} />
          </div>,
        );
        ref.current.focus();
        expect(focused).toBeTruthy();

        fireEvent.focus(getElement(container)!);
        expect(onFocus).toHaveBeenCalled();
      });

      it('Ref: blur() and onBlur', async () => {
        vi.useRealTimers();
        const onBlur = vi.fn();
        const ref = React.createRef<any>();
        const { container } = render(
          <div>
            <Component onBlur={onBlur} ref={ref} />
          </div>,
        );

        ref.current.blur();
        expect(blurred).toBeTruthy();

        fireEvent.blur(getElement(container)!);
        await sleep(blurDelay);
        expect(onBlur).toHaveBeenCalled();
      });

      it('Ref: autoFocus', () => {
        const onFocus = vi.fn();
        const { container } = render(<Component autoFocus onFocus={onFocus} />);

        expect(focused).toBeTruthy();

        fireEvent.focus(getElement(container)!);
        expect(onFocus).toHaveBeenCalled();
      });
    } else {
      it('focus() and onFocus', () => {
        const handleFocus = vi.fn();
        const { container } = render(<Component onFocus={handleFocus} />);
        fireEvent.focus(getElement(container)!);
        expect(handleFocus).toHaveBeenCalled();
      });

      it('blur() and onBlur', async () => {
        vi.useRealTimers();
        const handleBlur = vi.fn();
        const { container } = render(<Component onBlur={handleBlur} />);
        fireEvent.focus(getElement(container)!);
        await sleep(0);
        fireEvent.blur(getElement(container)!);
        await sleep(0);
        expect(handleBlur).toHaveBeenCalled();
      });

      it('autoFocus', () => {
        const handleFocus = vi.fn();
        render(<Component autoFocus onFocus={handleFocus} />);
        expect(handleFocus).toHaveBeenCalled();
      });
    }
  });
};

export default focusTest;
