import React from 'react';
import Input from '..';
import type { InputProps } from '../Input';
import { render } from '../../../tests/utils';

describe('Input types', () => {
  it('should support data-attributes', () => {
    const dataProps: InputProps = {
      'data-test': 'test',
      size: 'large',
    };
    const { container } = render(<Input {...dataProps} />);
    expect(container.querySelector('input')?.getAttribute('data-test')).toBe('test');
    const { container: container2 } = render(<Input data-test="test" size="large" />);
    expect(container2.querySelector('input')?.getAttribute('data-test')).toBe('test');
  });
});
