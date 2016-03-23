import React from 'react';
import { Link } from 'react-router';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { QueueAnim, Icon, Button } from '../../../';

const clientHeight = document.documentElement.clientHeight;
function onScrollEvent(e) {
  const header = document.getElementById('header');
  if (e.pageY >= clientHeight) {
    if (header.className.indexOf('home-nav-bottom') < 0) {
      header.className += ' home-nav-bottom';
    }
  } else if (header.className.indexOf('home-nav-bottom') >= 0) {
    header.className = header.className.replace(/home-nav-bottom/ig, '');
  }
}

export default class Page1 extends React.Component {
  render() {
    return (
      <ScrollOverPack scrollName="page1" className="content-wrapper page" playScale={1} replay scrollEvent={onScrollEvent}>
        <TweenOne key="image" className="image1 image-wrapper" vars={{ x: 0, opacity: 1, duration: 550 }}
          style={{ transform: 'translateX(-100px)', opacity: 0 }} hideProps={{ type: 'reverse' }} />
          <QueueAnim className="text-wrapper" delay={300} key="text" duration={550} leaveReverse
            hideProps={{ child: null }}>
            <h2 key="h2">最佳实践</h2>
            <p key="p" style={{ maxWidth: 310 }}>近一年的中后台设计实践，积累了大量的优秀案例。</p>
            <div key="button">
              <Link to="/docs/practice/cases">
                <Button type="primary" size="large">
                  了解更多
                  <Icon type="right" />
                </Button>
              </Link>
            </div>
          </QueueAnim>
        </ScrollOverPack>
    );
  }
}
