import { PrivateConfig } from './types';

interface Config {
  catsApiKey?: string;
}

let _config: Config;
try {
  // tslint:disable-next-line: no-var-requires
  _config = require('./_config.json');
} catch (err) {
  // Do nothing here
}

export const getConfig = (key: PrivateConfig): string => {
  if (!_config) return null;
  return _config[key];
};
