export enum PrivateConfig {
  CatsApiKey = 'catsApiKey',
}

export type ConfigContextType = {
  [key in PrivateConfig]: string | boolean | number;
};

export interface CatsApiImage {
  url: string;
  id: string;
}

export interface NavPage {
  page: string;
  subpages?: SubNavPage[];
}

export interface SubNavPage {
  page: string;
  usesQueryString?: boolean;
  queryStringKey?: string;
}
