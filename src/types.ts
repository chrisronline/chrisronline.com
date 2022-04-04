export enum PrivateConfig {
  CatsApiKey = 'catsApiKey',
  GoogleApiKey = 'googleApiKey',
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
  subpagePath?: string;
  subpages?: SubNavPage[];
}

export interface SubNavPage {
  page: string;
  label?: string;
}
