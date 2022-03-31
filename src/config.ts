import { PrivateConfig } from './types';
import _config from './_config.json';

export const getConfig = (key: PrivateConfig): string => {
  if (!_config) return null;
  return _config[key];
};
