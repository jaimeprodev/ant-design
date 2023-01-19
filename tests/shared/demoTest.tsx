/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createCache,
  legacyNotSelectorLinter,
  logicalPropertiesLinter,
  StyleProvider,
} from '@ant-design/cssinjs';
import glob from 'glob';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render } from '../utils';
import { TriggerMockContext } from './demoTestContext';
import { excludeWarning } from './excludeWarning';

require('isomorphic-fetch');

// function normalizeAriaValue(value: string | null): string {
//   const defaultValue = value || '';

//   return defaultValue
//     .replace(/\d+/g, 'test')
//     .replace(/TEST_OR_SSR/g, 'test')
//     .replace(/-test-test/g, '-test');
// }

// function normalizeAria(element: Element, ariaName: string) {
//   if (element.hasAttribute(ariaName)) {
//     element.setAttribute(ariaName, normalizeAriaValue(element.getAttribute(ariaName)));
//   }
// }

// /**
//  * Rc component will generate id for aria usage. It's created as `test-uuid` when env === 'test'. Or
//  * `f7fa7a3c-a675-47bc-912e-0c45fb6a74d9`(randomly) when not test env. So we need hack of this to
//  * modify the `aria-controls`.
//  */
// function ariaConvert(element: Element) {
//   normalizeAria(element, 'aria-owns');
//   normalizeAria(element, 'aria-controls');
//   normalizeAria(element, 'aria-labelledby');
//   normalizeAria(element, 'aria-activedescendant');
//   normalizeAria(element, 'data-menu-id');
//   normalizeAria(element, 'stroke');
//   if (element.id) {
//     element.id = normalizeAriaValue(element.id);
//   }

//   Array.from(element.children).forEach(child => {
//     ariaConvert(child);
//   });
// }

export type Options = {
  skip?: boolean | string[];
  testingLib?: boolean;
};

function baseText(doInject: boolean, component: string, options: Options = {}) {
  const files = glob.sync(`./components/${component}/demo/*.tsx`);

  let cssinjsTest = false;

  files.forEach((file) => {
    const testMethod =
      options.skip === true ||
      (Array.isArray(options.skip) && options.skip.some((c) => file.includes(c)))
        ? test.skip
        : test;

    if (!doInject && !cssinjsTest && testMethod !== test.skip) {
      cssinjsTest = true;
      testMethod(`cssinjs should not warn in ${component}`, () => {
        const errSpy = excludeWarning();

        let Demo = require(`../.${file}`).default; // eslint-disable-line global-require, import/no-dynamic-require
        // Inject Trigger status unless skipped
        Demo = typeof Demo === 'function' ? <Demo /> : Demo;

        // Inject cssinjs cache to avoid create <style /> element
        Demo = (
          <StyleProvider
            cache={createCache()}
            linters={[logicalPropertiesLinter, legacyNotSelectorLinter]}
          >
            {Demo}
          </StyleProvider>
        );

        render(Demo);

        expect(errSpy).not.toHaveBeenCalledWith(expect.stringContaining('[Ant Design CSS-in-JS]'));

        errSpy.mockRestore();
      });
    }

    // function doTest(name: string, openTrigger = false) {
    testMethod(
      doInject ? `renders ${file} extend context correctly` : `renders ${file} correctly`,
      () => {
        const errSpy = excludeWarning();

        Date.now = jest.fn(() => new Date('2016-11-22').getTime());
        jest.useFakeTimers().setSystemTime(new Date('2016-11-22'));

        let Demo = require(`../.${file}`).default; // eslint-disable-line global-require, import/no-dynamic-require
        // Inject Trigger status unless skipped
        Demo = typeof Demo === 'function' ? <Demo /> : Demo;
        if (doInject) {
          Demo = (
            <TriggerMockContext.Provider
              value={{
                popupVisible: true,
              }}
            >
              {Demo}
            </TriggerMockContext.Provider>
          );
        }

        // Inject cssinjs cache to avoid create <style /> element
        Demo = <StyleProvider cache={createCache()}>{Demo}</StyleProvider>;

        // Demo Test also include `dist` test which is already uglified.
        // We need test this as SSR instead.
        const html = renderToString(Demo);
        expect({
          type: 'demo',
          html,
        }).toMatchSnapshot();

        errSpy.mockRestore();
      },
    );
    jest.useRealTimers();
  });
}

export function extendTest(component: string, options: Options = {}) {
  baseText(true, component, options);
}

export default function demoTest(component: string, options: Options = {}) {
  baseText(false, component, options);
}
