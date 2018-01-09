import React from 'react';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import Animate from 'rc-animate';
import Banner from './Banner';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
// To store style which is only for Home and has conflicts with others.
function getStyle() {
  return `
    .main-wrapper {
      padding: 0;
    }
    #header {
      box-shadow: none;
      max-width: 1200px;
      width: 100%;
      margin: 20px auto 0;
      padding: 0 24px;
    }
    #header,
    #header .ant-select-selection,
    #header .ant-menu {
      background: transparent;
    }
    #header #logo {
      padding: 0;
    }
    #header .ant-row > div:last-child #search-box,
    #header .ant-row > div:last-child .ant-select,
    #header .ant-row > div:last-child .ant-menu,
    #header .nav-phone-icon {
      display: none;
    }
    #header .ant-row > div:last-child .header-lang-button {
      margin-right: 0;
    }
    #header .ant-row .ant-col-lg-19,
    #header .ant-row .ant-col-xl-19 {
      width: 50%;
      float: right;
    }
  `;
}

const versionName = 'antd-noShowNewVersionVideo-3.0';
const vidoeSrc = 'https://gw.alipayobjects.com/os/rmsportal/DNDyihnvkHUuANuumKck.mp4';
// window.localStorage.setItem(versionName, 'false');
class Home extends React.Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props);
    const noShowNewVersionVideo = typeof window === 'undefined' ? true : (
      window.localStorage && window.localStorage.getItem(versionName) === 'true'
    );
    this.state = { noShowNewVersionVideo };
  }
  onVideoEnd = () => {
    this.setState({
      noShowNewVersionVideo: true,
    });
    if (window.localStorage) {
      window.localStorage.setItem(versionName, 'true');
    }
  }
  render() {
    const { isMobile, intl } = this.context;
    const childProps = { ...this.props, isMobile, locale: intl.locale };
    const noShowNewVersionVideo = this.state.noShowNewVersionVideo ? null : (
      <div className="new-version-video" key="video">
        <div className="vidoe-wrap">
          <video width="100%" autoPlay onEnded={this.onVideoEnd}>
            <source src={vidoeSrc} autoPlay type="video/mp4" />
            <track kind="captions" />
          </video>
        </div>
      </div>
    );
    return (
      <DocumentTitle title={`Ant Design - ${this.props.intl.formatMessage({ id: 'app.home.slogan' })}`}>
        <div className="main-wrapper">
          <Banner {...childProps} />
          <Page1 {...childProps} />
          <Page2 {...childProps} />
          <Page3 {...childProps} />
          <style dangerouslySetInnerHTML={{ __html: getStyle() }} />
          {!isMobile && (
            <Animate transitionName="fade">
              {noShowNewVersionVideo}
            </Animate>
          )}
        </div>
      </DocumentTitle>
    );
  }
}

export default injectIntl(Home);
