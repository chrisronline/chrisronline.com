import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tree } from './types';

let id = 0;
export const SAMPLE_ROOT: Tree = {
  label: 'Chris',
  id: id++,
  children: [
    {
      label: 'Downloads',
      id: id++,
      children: [
        {
          label: 'Work',
          id: id++,
          children: [
            {
              label: 'repo',
              id: id++,
              children: [] as Tree[],
            },
            {
              label: 'repo.zip',
              icon: solid('file-zipper'),
              id: id++,
            },
          ],
        },
        {
          label: 'Personal',
          id: id++,
        },
      ],
    },
    {
      label: 'Pictures',
      id: id++,
    },
  ],
};
