import React, { useEffect } from 'react';
import type { NotificationConfig } from 'antd/es/notification/interface';
import App from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { render, waitFakeTimer } from '../../../tests/utils';
import type { AppConfig } from '../context';
import { AppConfigContext } from '../context';

describe('App', () => {
  mountTest(App);
  rtlTest(App);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('single', () => {
    // Sub page
    const MyPage: React.FC = () => {
      const { message } = App.useApp();
      React.useEffect(() => {
        message.success('Good!');
      }, [message]);

      return <div>Hello World</div>;
    };

    // Entry component
    const MyApp: React.FC = () => (
      <App>
        <MyPage />
      </App>
    );

    const { getByText, container } = render(<MyApp />);
    expect(getByText('Hello World')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should work as message and notification config configured in app', async () => {
    let consumedConfig: AppConfig | undefined;
    const Consumer = () => {
      const { message, notification } = App.useApp();
      consumedConfig = React.useContext(AppConfigContext);

      useEffect(() => {
        message.success('Message 1');
        message.success('Message 2');
        notification.success({ message: 'Notification 1' });
        notification.success({ message: 'Notification 2' });
        notification.success({ message: 'Notification 3' });
      }, [message, notification]);

      return <div />;
    };
    const Wrapper = () => (
      <App message={{ maxCount: 1 }} notification={{ maxCount: 2 }}>
        <Consumer />
      </App>
    );

    render(<Wrapper />);

    await waitFakeTimer();

    expect(consumedConfig?.message).toStrictEqual({ maxCount: 1 });
    expect(consumedConfig?.notification).toStrictEqual({ maxCount: 2 });

    expect(document.querySelectorAll('.ant-message-notice')).toHaveLength(1);
    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(2);
  });

  it('should be a merged config configured in nested app', async () => {
    let offsetConsumedConfig: AppConfig | undefined;
    let maxCountConsumedConfig: AppConfig | undefined;
    const OffsetConsumer = () => {
      offsetConsumedConfig = React.useContext(AppConfigContext);
      return <div />;
    };
    const MaxCountConsumer = () => {
      maxCountConsumedConfig = React.useContext(AppConfigContext);
      return <div />;
    };
    const Wrapper = () => (
      <App message={{ maxCount: 1 }} notification={{ maxCount: 2 }}>
        <App message={{ top: 32 }} notification={{ top: 96 }}>
          <OffsetConsumer />
        </App>
        <MaxCountConsumer />
      </App>
    );

    render(<Wrapper />);

    expect(offsetConsumedConfig?.message).toStrictEqual({ maxCount: 1, top: 32 });
    expect(offsetConsumedConfig?.notification).toStrictEqual({ maxCount: 2, top: 96 });
    expect(maxCountConsumedConfig?.message).toStrictEqual({ maxCount: 1 });
    expect(maxCountConsumedConfig?.notification).toStrictEqual({ maxCount: 2 });
  });

  it('should respect config from props in priority', async () => {
    let config: AppConfig | undefined;
    const Consumer = () => {
      config = React.useContext(AppConfigContext);
      return <div />;
    };
    const Wrapper = () => (
      <App message={{ maxCount: 10, top: 20 }} notification={{ maxCount: 30, bottom: 40 }}>
        <App message={{ maxCount: 11 }} notification={{ bottom: 41 }}>
          <Consumer />
        </App>
      </App>
    );

    render(<Wrapper />);

    expect(config?.message).toStrictEqual({ maxCount: 11, top: 20 });
    expect(config?.notification).toStrictEqual({ maxCount: 30, bottom: 41 });
  });

  it('should respect notification placement config from props in priority', async () => {
    let consumedConfig: AppConfig | undefined;

    const Consumer = () => {
      const { notification } = App.useApp();
      consumedConfig = React.useContext(AppConfigContext);

      useEffect(() => {
        notification.success({ message: 'Notification 1' });
        notification.success({ message: 'Notification 2' });
        notification.success({ message: 'Notification 3' });
      }, [notification]);

      return <div />;
    };

    const config: NotificationConfig = {
      placement: 'bottomLeft',
      top: 100,
      bottom: 50,
    };

    const Wrapper = () => (
      <App notification={config}>
        <Consumer />
      </App>
    );

    render(<Wrapper />);
    await waitFakeTimer();

    expect(consumedConfig?.notification).toStrictEqual(config);
    expect(document.querySelector('.ant-notification-topRight')).not.toBeInTheDocument();
    expect(document.querySelector('.ant-notification-bottomLeft')).toHaveStyle({
      top: '',
      left: '0px',
      bottom: '50px',
    });
  });

  it('support className', () => {
    const { container } = render(
      <App className="test-class">
        <div>test</div>
      </App>,
    );
    expect(container.querySelector<HTMLDivElement>('.ant-app')).toHaveClass('test-class');
  });

  it('support style', () => {
    const { container } = render(
      <App style={{ color: 'blue' }}>
        <div>test</div>
      </App>,
    );
    expect(container.querySelector<HTMLDivElement>('.ant-app')).toHaveStyle('color: blue;');
  });
});
