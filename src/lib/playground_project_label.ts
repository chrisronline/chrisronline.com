import { PlaygroundProjectEnum } from '../pages/playground/types';

export function getPlaygroundProjectLabel(project: PlaygroundProjectEnum) {
  if (project === PlaygroundProjectEnum.INFINITE_SCROLL) {
    return 'Infinite Scroll';
  }
  return project;
}
