import MockDate from 'mockdate';
import Dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import type { Locale } from 'rc-picker/lib/interface';
import { type PickerPanelProps } from 'rc-picker';
import React from 'react';
import Calendar from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import Group from '../../radio/group';
import Button from '../../radio/radioButton';
import Select from '../../select';
import Header, { type CalendarHeaderProps } from '../Header';

const ref: {
  calendarProps?: PickerPanelProps<unknown>;
  calendarHeaderProps?: CalendarHeaderProps<unknown>;
} = {};

jest.mock('../Header', () => {
  const HeaderModule = jest.requireActual('../Header');
  const HeaderComponent = HeaderModule.default;
  return (props: CalendarHeaderProps<any>) => {
    ref.calendarHeaderProps = props;
    return <HeaderComponent {...props} />;
  };
});

jest.mock('rc-picker', () => {
  const RcPicker = jest.requireActual('rc-picker');
  const PickerPanelComponent = RcPicker.PickerPanel;
  return {
    ...RcPicker,
    PickerPanel: (props: PickerPanelProps<unknown>) => {
      ref.calendarProps = props;
      return <PickerPanelComponent {...props} />;
    },
  };
});

describe('Calendar', () => {
  mountTest(Calendar);
  rtlTest(Calendar, { mockDate: true });

  function openSelect(wrapper: HTMLElement, className: string) {
    fireEvent.mouseDown(wrapper.querySelector(className)!.querySelector('.ant-select-selector')!);
  }

  function findSelectItem(wrapper: HTMLElement) {
    return wrapper.querySelectorAll('.ant-select-item-option')!;
  }

  function clickSelectItem(wrapper: HTMLElement, index = 0) {
    fireEvent.click(findSelectItem(wrapper)[index]);
  }

  // https://github.com/ant-design/ant-design/issues/30392
  it('should be able to set undefined or null', () => {
    expect(() => {
      render(<Calendar value={null as any} />);
    }).not.toThrow();

    expect(() => {
      render(<Calendar value={undefined} />);
    }).not.toThrow();
  });

  it('Calendar should be selectable', () => {
    MockDate.set(Dayjs('2000-01-01').valueOf());

    const onSelect = jest.fn();
    const onChange = jest.fn();
    const { container } = render(<Calendar onSelect={onSelect} onChange={onChange} />);

    fireEvent.click(container.querySelector('.ant-picker-cell')!);
    expect(onSelect).toHaveBeenCalledWith(expect.anything());

    const value = onSelect.mock.calls[0][0];
    expect(Dayjs.isDayjs(value)).toBe(true);

    expect(onChange).toHaveBeenCalled();

    MockDate.reset();
  });

  it('only Valid range should be selectable', () => {
    const onSelect = jest.fn();
    const validRange: [Dayjs.Dayjs, Dayjs.Dayjs] = [Dayjs('2018-02-02'), Dayjs('2018-02-18')];
    const wrapper = render(
      <Calendar onSelect={onSelect} validRange={validRange} defaultValue={Dayjs('2018-02-02')} />,
    );
    fireEvent.click(wrapper.container.querySelectorAll('[title="2018-02-01"]')[0]);
    fireEvent.click(wrapper.container.querySelectorAll('[title="2018-02-02"]')[0]);
    expect(onSelect.mock.calls.length).toBe(1);
  });

  it('dates other than in valid range should be disabled', () => {
    const onSelect = jest.fn();
    const validRange: [Dayjs.Dayjs, Dayjs.Dayjs] = [Dayjs('2018-02-02'), Dayjs('2018-02-18')];
    const { container } = render(
      <Calendar onSelect={onSelect} validRange={validRange} defaultValue={Dayjs('2018-02-02')} />,
    );
    fireEvent.click(container.querySelector('[title="2018-02-20"]')!);
    const elem = container
      .querySelector('[title="2018-02-20"]')!
      .className.includes('ant-picker-cell-disabled');
    expect(elem).toEqual(true);
    expect(onSelect.mock.calls.length).toBe(0);
  });

  it('months other than in valid range should be disabled', () => {
    const onSelect = jest.fn();
    const validRange: [Dayjs.Dayjs, Dayjs.Dayjs] = [Dayjs('2018-02-02'), Dayjs('2018-05-18')];
    const { container } = render(
      <Calendar
        onSelect={onSelect}
        validRange={validRange}
        defaultValue={Dayjs('2018-02-02')}
        mode="year"
      />,
    );
    expect(
      container.querySelector('[title="2018-01"]')?.className.includes('ant-picker-cell-disabled'),
    ).toBe(true);
    expect(
      container.querySelector('[title="2018-02"]')?.className.includes('ant-picker-cell-disabled'),
    ).toBe(false);
    expect(
      container.querySelector('[title="2018-06"]')?.className.includes('ant-picker-cell-disabled'),
    ).toBe(true);
    fireEvent.click(container.querySelector('[title="2018-01"]')!);
    fireEvent.click(container.querySelector('[title="2018-03"]')!);
    expect(onSelect.mock.calls.length).toBe(1);
  });

  it('months other than in valid range should not be shown in header', () => {
    const validRange: [Dayjs.Dayjs, Dayjs.Dayjs] = [Dayjs('2017-02-02'), Dayjs('2018-05-18')];
    const { container } = render(<Calendar validRange={validRange} />);
    openSelect(container, '.ant-picker-calendar-year-select');
    clickSelectItem(container);
    openSelect(container, '.ant-picker-calendar-month-select');
    // 2 years and 11 months
    expect(container.querySelectorAll('.ant-select-item-option').length).toBe(13);
  });

  it('getDateRange should returns a disabledDate function', () => {
    const validRange: [Dayjs.Dayjs, Dayjs.Dayjs] = [Dayjs('2018-02-02'), Dayjs('2018-05-18')];
    render(<Calendar validRange={validRange} defaultValue={Dayjs('2018-02-02')} />);
    expect(ref.calendarProps?.disabledDate?.(Dayjs('2018-06-02'))).toBe(true);
    expect(ref.calendarProps?.disabledDate?.(Dayjs('2018-04-02'))).toBe(false);
  });

  it('validRange should work with disabledDate function', () => {
    const validRange: [Dayjs.Dayjs, Dayjs.Dayjs] = [Dayjs('2018-02-02'), Dayjs('2018-05-18')];
    render(
      <Calendar validRange={validRange} disabledDate={data => data.isSame(Dayjs('2018-02-03'))} />,
    );

    expect(ref.calendarProps?.disabledDate?.(Dayjs('2018-02-01'))).toBe(true);
    expect(ref.calendarProps?.disabledDate?.(Dayjs('2018-02-02'))).toBe(false);
    expect(ref.calendarProps?.disabledDate?.(Dayjs('2018-02-03'))).toBe(true);
    expect(ref.calendarProps?.disabledDate?.(Dayjs('2018-02-04'))).toBe(false);
    expect(ref.calendarProps?.disabledDate?.(Dayjs('2018-06-01'))).toBe(true);
  });

  it('Calendar MonthSelect should display correct label', () => {
    const validRange: [Dayjs.Dayjs, Dayjs.Dayjs] = [Dayjs('2018-02-02'), Dayjs('2019-06-1')];
    const wrapper = render(<Calendar validRange={validRange} defaultValue={Dayjs('2019-01-01')} />);
    expect(wrapper.container.children[0]).toMatchSnapshot();
  });

  it('Calendar should change mode by prop', () => {
    const monthMode = 'month';
    const yearMode = 'year';
    const wrapper = render(<Calendar />);
    expect(ref.calendarHeaderProps?.mode).toEqual(monthMode);
    wrapper.rerender(<Calendar mode={yearMode} />);
    expect(ref.calendarHeaderProps?.mode).toEqual(yearMode);
  });

  it('Calendar should switch mode', () => {
    const monthMode = 'month';
    const yearMode = 'year';
    const onPanelChangeStub = jest.fn();
    const wrapper = render(<Calendar mode={yearMode} onPanelChange={onPanelChangeStub} />);
    expect(ref.calendarHeaderProps?.mode).toEqual(yearMode);
    wrapper.rerender(<Calendar mode={monthMode} onPanelChange={onPanelChangeStub} />);
    expect(ref.calendarHeaderProps?.mode).toEqual(monthMode);
    expect(onPanelChangeStub).toHaveBeenCalledTimes(0);
  });

  it('Calendar should support locale', () => {
    MockDate.set(Dayjs('2018-10-19').valueOf());
    // eslint-disable-next-line global-require
    const zhCN = require('../locale/zh_CN').default;
    const wrapper = render(<Calendar locale={zhCN} />);
    expect(wrapper.container.children[0]).toMatchSnapshot();
    MockDate.reset();
  });

  describe('onPanelChange', () => {
    it('trigger when click last month of date', () => {
      const onPanelChange = jest.fn();
      const date = Dayjs('1990-09-03');
      const wrapper = render(<Calendar onPanelChange={onPanelChange} value={date} />);

      fireEvent.click(Array.from(wrapper.container.querySelectorAll('.ant-picker-cell')).at(0)!);

      expect(onPanelChange).toHaveBeenCalled();
      expect(onPanelChange.mock.calls[0][0].month()).toEqual(date.month() - 1);
    });

    it('not trigger when in same month', () => {
      const onPanelChange = jest.fn();
      const date = Dayjs('1990-09-03');
      const wrapper = render(<Calendar onPanelChange={onPanelChange} value={date} />);

      fireEvent.click(Array.from(wrapper.container.querySelectorAll('.ant-picker-cell')).at(10)!);

      expect(onPanelChange).not.toHaveBeenCalled();
    });
  });

  it('switch should work correctly without prop mode', async () => {
    const onPanelChange = jest.fn();
    const date = Dayjs(new Date(Date.UTC(2017, 7, 9, 8)));
    const wrapper = render(<Calendar onPanelChange={onPanelChange} value={date} />);

    expect(ref.calendarHeaderProps?.mode).toBe('month');
    expect(wrapper.container.querySelectorAll('.ant-picker-date-panel').length).toBe(1);
    expect(wrapper.container.querySelectorAll('.ant-picker-month-panel').length).toBe(0);
    fireEvent.click(wrapper.container.querySelector('.ant-radio-button-input[value="year"]')!);
    expect(wrapper.container.querySelectorAll('.ant-picker-date-panel').length).toBe(0);
    expect(wrapper.container.querySelectorAll('.ant-picker-month-panel').length).toBe(1);

    expect(onPanelChange).toHaveBeenCalled();
    expect(onPanelChange.mock.calls[0][1]).toEqual('year');
  });

  const createWrapper = (
    start: Dayjs.Dayjs,
    end: Dayjs.Dayjs,
    value: Dayjs.Dayjs,
    onValueChange: (v: Dayjs.Dayjs) => void,
  ) => {
    const wrapper = render(
      // @ts-ignore
      <Header
        prefixCls="ant-picker-calendar"
        generateConfig={dayjsGenerateConfig}
        onChange={onValueChange}
        value={value}
        validRange={[start, end]}
        locale={{ year: '年' } as Locale}
      />,
    );
    openSelect(wrapper.container, '.ant-picker-calendar-year-select');
    clickSelectItem(wrapper.container);
  };

  it('if value.month > end.month, set value.month to end.month', () => {
    const value = Dayjs('1990-01-03');
    const start = Dayjs('2019-04-01');
    const end = Dayjs('2019-11-01');
    const onValueChange = jest.fn();
    createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year(2019).month(3));
  });

  it('if start.month > value.month, set value.month to start.month', () => {
    const value = Dayjs('1990-01-03');
    const start = Dayjs('2019-11-01');
    const end = Dayjs('2019-03-01');
    const onValueChange = jest.fn();
    createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year(2019).month(10));
  });

  it('if change year and month > end month, set value.month to end.month', () => {
    const value = Dayjs('2018-11-03');
    const start = Dayjs('2000-01-01');
    const end = Dayjs('2019-03-01');
    const onValueChange = jest.fn();
    const wrapper = render(
      <Header
        prefixCls="ant-picker-calendar"
        generateConfig={dayjsGenerateConfig}
        onChange={onValueChange}
        value={value}
        validRange={[start, end]}
        // @ts-ignore
        locale={{ year: '年' }}
      />,
    );
    openSelect(wrapper.container, '.ant-picker-calendar-year-select');
    fireEvent.click(
      Array.from(wrapper.container.querySelectorAll('.ant-select-item-option')).at(-1)!,
    );
    expect(onValueChange).toHaveBeenCalledWith(value.year(2019).month(2));
  });

  it('onMonthChange should work correctly', () => {
    const start = Dayjs('2018-11-01');
    const end = Dayjs('2019-03-01');
    const value = Dayjs('2018-12-03');
    const onValueChange = jest.fn();
    const wrapper = render(
      <Header
        prefixCls="ant-picker-calendar"
        generateConfig={dayjsGenerateConfig}
        onChange={onValueChange}
        value={value}
        validRange={[start, end]}
        // @ts-ignore
        locale={{ year: '年', locale: 'zh_CN' }}
        mode="month"
      />,
    );
    openSelect(wrapper.container, '.ant-picker-calendar-month-select');
    clickSelectItem(wrapper.container);
    expect(onValueChange).toHaveBeenCalledWith(value.month(10));
  });

  it('onTypeChange should work correctly', () => {
    const onTypeChange = jest.fn();
    const value = Dayjs('2018-12-03');
    const wrapper = render(
      <Header
        prefixCls="ant-picker-calendar"
        generateConfig={dayjsGenerateConfig}
        onModeChange={onTypeChange}
        locale={{ year: '年', month: '月', locale: 'zh_CN' } as any}
        value={value}
        // @ts-ignore
        type="date"
      />,
    );
    fireEvent.click(
      Array.from(wrapper.container.querySelectorAll(`.ant-radio-button-input`)).at(1)!,
    );
    expect(onTypeChange).toHaveBeenCalledWith('year');
  });

  it('headerRender should work correctly', () => {
    const onMonthChange = jest.fn();
    const onYearChange = jest.fn();
    const onTypeChange = jest.fn();

    // Year
    const headerRender = jest.fn(({ value }) => {
      const year = value.year();
      const options = [];
      for (let i = year - 100; i < year + 100; i += 1) {
        options.push(
          <Select.Option className="year-item" key={i} value={i}>
            {i}
          </Select.Option>,
        );
      }

      return (
        <Select
          size="small"
          dropdownMatchSelectWidth={false}
          className="my-year-select"
          onChange={onYearChange}
          value={String(year)}
        >
          {options}
        </Select>
      );
    });
    const uiWithYear = <Calendar fullscreen={false} headerRender={headerRender} />;
    const wrapperWithYear = render(uiWithYear);

    openSelect(wrapperWithYear.container, '.ant-select');
    wrapperWithYear.rerender(uiWithYear);

    fireEvent.click(Array.from(findSelectItem(wrapperWithYear.container)).at(-1)!);

    expect(onYearChange).toHaveBeenCalled();

    // Month
    const headerRenderWithMonth = jest.fn(({ value }) => {
      const start = 0;
      const end = 12;
      const monthOptions = [];
      const current = value.clone();
      const localeData = value.localeData();
      const months = [];
      for (let i = 0; i < 12; i += 1) {
        current.month(i);
        months.push(localeData.monthsShort(current));
      }

      for (let index = start; index < end; index += 1) {
        monthOptions.push(
          <Select.Option className="month-item" key={`${index}`} value={index}>
            {months[index]}
          </Select.Option>,
        );
      }

      const month = value.month();
      return (
        <Select
          size="small"
          dropdownMatchSelectWidth={false}
          className="my-month-select"
          onChange={onMonthChange}
          value={String(month)}
        >
          {monthOptions}
        </Select>
      );
    });
    const uiWithMonth = <Calendar fullscreen={false} headerRender={headerRenderWithMonth} />;
    const wrapperWithMonth = render(uiWithMonth);
    openSelect(wrapperWithMonth.container, '.ant-select');
    wrapperWithMonth.rerender(uiWithMonth);

    fireEvent.click(Array.from(findSelectItem(wrapperWithMonth.container)).at(-1)!);

    expect(onMonthChange).toHaveBeenCalled();

    // Type
    const headerRenderWithTypeChange = jest.fn(({ type }) => (
      <Group size="small" onChange={onTypeChange} value={type}>
        <Button value="month">Month</Button>
        <Button value="year">Year</Button>
      </Group>
    ));

    const wrapperWithTypeChange = render(
      <Calendar fullscreen={false} headerRender={headerRenderWithTypeChange} />,
    );

    fireEvent.click(
      Array.from(wrapperWithTypeChange.container.querySelectorAll('.ant-radio-button-input')).at(
        -1,
      )!,
    );
    expect(onTypeChange).toHaveBeenCalled();
  });

  it('dateFullCellRender', () => {
    const { container } = render(
      <Calendar dateFullCellRender={() => <div className="light">Bamboo</div>} />,
    );
    expect(container.querySelectorAll('.light')[0].innerHTML).toEqual('Bamboo');
  });

  it('monthFullCellRender', () => {
    const { container } = render(
      <Calendar mode="year" monthFullCellRender={() => <div className="bamboo">Light</div>} />,
    );
    expect(container.querySelectorAll('.bamboo')[0].innerHTML).toEqual('Light');
  });

  it('when fullscreen is false, the element returned by dateFullCellRender should be interactive', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Calendar
        fullscreen={false}
        dateFullCellRender={() => (
          <div className="bamboo" onClick={onClick}>
            Light
          </div>
        )}
      />,
    );
    fireEvent.click(container.querySelectorAll('.bamboo')[0]);
    expect(onClick).toHaveBeenCalled();
  });
});
