export enum PrivateConfig {
  CatsApiKey = 'catsApiKey'
}

export type ConfigContextType = {
  [key in PrivateConfig]: string | boolean | number;
};

export interface CatsApiImage {
  url: string;
  id: string;
}