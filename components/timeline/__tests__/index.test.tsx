import React from 'react';
import type { TimelineProps } from '..';
import TimeLine from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { render } from '../../../tests/utils';

const { Item } = TimeLine;

const renderFactory = (
  timeLineProps: TimelineProps = {},
  labelItems: TimelineProps['children'] = null,
) =>
  render(
    <TimeLine {...timeLineProps}>
      <Item key="1">foo</Item>
      <Item key="2">bar</Item>
      <Item key="3">baz</Item>
      {labelItems}
    </TimeLine>,
  );

describe('TimeLine', () => {
  mountTest(TimeLine);
  mountTest(TimeLine.Item);
  rtlTest(TimeLine);
  rtlTest(TimeLine.Item);

  it('renders items without passing any props correctly', () => {
    const { container } = renderFactory();

    // has 3 timeline item
    expect(container.querySelectorAll('li.ant-timeline-item')).toHaveLength(3);

    // has only 1 timeline item is marked as the last item
    expect(container.querySelectorAll('li.ant-timeline-item-last')).toHaveLength(1);

    // its last item is marked as the last item
    expect(container.querySelectorAll('li.ant-timeline-item')[2]).toHaveClass(
      'ant-timeline-item-last',
    );
  });

  describe('renders pending item', () => {
    const pending = <div>pending...</div>;
    const pendingDot = <i>dot</i>;

    it('has one extra timeline item', () => {
      const { container } = renderFactory({ pending });
      expect(container.querySelectorAll('li.ant-timeline-item')).toHaveLength(4);
    });

    it('has extra pending timeline item', () => {
      const { container } = renderFactory({ pending });
      expect(container.querySelectorAll('li.ant-timeline-item-pending')).toHaveLength(1);
    });

    it("renders the pending timeline item as long as it receive a truthy prop value to 'pending'", () => {
      const { container } = renderFactory({ pending: true });
      expect(container.querySelector('li.ant-timeline-item-pending')).toBeTruthy();
    });

    it('its last item is marked as the pending item', () => {
      const { container } = renderFactory({ pending });
      const items = container.querySelectorAll('li.ant-timeline-item');
      expect(items[items.length - 1]).toHaveClass('ant-timeline-item-pending');
    });

    it('its second to last item is marked as the last item', () => {
      const { container } = renderFactory({ pending });
      const items = container.querySelectorAll('li.ant-timeline-item');
      expect(items[items.length - 2]).toHaveClass('ant-timeline-item-last');
    });

    it('has the correct pending node', () => {
      const { container, getByText } = renderFactory({ pending });
      expect(container.querySelector('li.ant-timeline-item-pending')).toContainElement(
        getByText('pending...'),
      );
    });

    it('has the correct pending dot node', () => {
      const { container, getByText } = renderFactory({ pending, pendingDot });
      expect(container.querySelector('li.ant-timeline-item-pending')).toContainElement(
        getByText('dot'),
      );
    });

    it("has no pending dot if without passing a truthy 'pending' prop", () => {
      const { queryByText } = renderFactory({ pendingDot });
      expect(queryByText('dot')).toBeFalsy();
    });
  });

  describe('the item rendering sequence is controlled by reverse', () => {
    const getTextContents = (nodeList: NodeListOf<HTMLDivElement>) =>
      Array.from(nodeList).map((node) => node?.textContent);

    it('items is in order when prop reverse is false', () => {
      const { container } = renderFactory({ reverse: false });
      const textContents = getTextContents(
        container.querySelectorAll('.ant-timeline-item-content'),
      );
      expect(textContents).toEqual(['foo', 'bar', 'baz']);
    });

    it('items is reversed when prop reverse is true', () => {
      const { container } = renderFactory({ reverse: true });
      const textContents = getTextContents(
        container.querySelectorAll('.ant-timeline-item-content'),
      );
      expect(textContents).toEqual(['baz', 'bar', 'foo']);
    });
  });

  describe('renders items reversely and with pending item', () => {
    const pending = <div>pending...</div>;

    it('its last item is marked as the last item', () => {
      const { container } = renderFactory({ pending, reverse: true });
      const items = container.querySelectorAll('li.ant-timeline-item');
      expect(items[items.length - 1]).toHaveClass('ant-timeline-item-last');
    });

    it('its first item is marked as the pending item', () => {
      const { container } = renderFactory({ pending, reverse: true });
      expect(container.querySelector('li.ant-timeline-item')).toHaveClass(
        'ant-timeline-item-pending',
      );
    });
  });

  it('renders Timeline item with label correctly', () => {
    const label = '2020-01-01';
    const { container } = renderFactory(
      {},
      <Item key="1" label={label}>
        foo
      </Item>,
    );
    expect(container.querySelectorAll('.ant-timeline-label')).toHaveLength(1);
    expect(container.querySelector('.ant-timeline-item-label')).toHaveTextContent(label);
  });

  describe('prop: color', () => {
    const presetColors = ['blue', 'red', 'green', 'gray'];

    presetColors.forEach((color) => {
      it(`className should have a preset color ${color}`, () => {
        const { container } = render(
          <TimeLine>
            <Item color={color}>foo</Item>
          </TimeLine>,
        );
        expect(container.querySelector('.ant-timeline-item-head')).toHaveClass(
          `ant-timeline-item-head-${color}`,
        );
      });
    });

    // other non-preset colors
    const nonPresetColors = ['rgb(255, 0, 0)', 'rgba(255, 0, 0, 0.5)', '#ff0000', '#f00'].filter(
      (color) => !presetColors.includes(color),
    );

    // https://github.com/ant-design/ant-design/issues/39386
    nonPresetColors.forEach((color) => {
      it(`className should not have a non-preset color ${color}`, () => {
        const { container } = render(
          <TimeLine>
            <Item color={color}>foo</Item>
          </TimeLine>,
        );
        expect(container.querySelector('.ant-timeline-item-head')).not.toHaveClass(
          `ant-timeline-item-head-${color}`,
        );
      });
    });
  });
});
