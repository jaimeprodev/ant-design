import { imageDemoTest } from '../../../tests/shared/imageTest';

describe('Tooltip image', () => {
  imageDemoTest('tooltip', {
    onlyViewport: ['shift.tsx'],
  });
});
