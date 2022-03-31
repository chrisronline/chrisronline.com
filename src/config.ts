import { RendererTypes } from './pages/playground/types';
import { NavPage, PrivateConfig } from './types';
import _config from './_config.json';

export const PAGES: NavPage[] = [
  { page: 'home' },
  { page: 'projects' },
  {
    page: 'playground',
    subpages: [
      {
        page: RendererTypes.React,
        usesQueryString: true,
        queryStringKey: 'renderer',
      },
      {
        page: RendererTypes.Vanilla,
        usesQueryString: true,
        queryStringKey: 'renderer',
      },
    ],
  },
];

export const getConfig = (key: PrivateConfig): string => {
  if (!_config) return null;
  return _config[key];
};
