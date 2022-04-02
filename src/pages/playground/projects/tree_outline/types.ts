import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface Tree {
  id: number;
  label: string;
  icon?: IconDefinition;
  children?: Tree[];
}

export interface TreeContext {
  toggleNode: (id: number) => void;
  isOpen: (id: number) => boolean;
}