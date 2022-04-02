import { createContext } from 'react';
import { TreeContext } from './types';

export const TreeOutlineContext = createContext<TreeContext>({
  toggleNode: (id: number) => ({}),
  isOpen: (id: number) => false,
});
