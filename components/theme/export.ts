/* eslint-disable import/prefer-default-export */
import { useToken as useInternalToken, defaultConfig } from '.';
import defaultAlgorithm from './themes/default';
import darkAlgorithm from './themes/dark';
import compactAlgorithm from './themes/compact';
import { defaultAlgorithmV4, darkAlgorithmV4 } from './themes/v4';

// ZombieJ: We export as object to user but array in internal.
// This is used to minimize the bundle size for antd package but safe to refactor as object also.
// Please do not export internal `useToken` directly to avoid something export unexpected.
/** Get current context Design Token. Will be different if you using nest theme config. */
function useToken() {
  const [theme, token, hashId] = useInternalToken();

  return { theme, token, hashId };
}

export default {
  /** @private Test Usage. Do not use in production. */
  defaultConfig,

  useToken,
  defaultAlgorithm,
  darkAlgorithm,
  defaultAlgorithmV4,
  darkAlgorithmV4,
  compactAlgorithm,
};
