import { PlaygroundProjectEnum } from '../pages/playground/types';

export function getPlaygroundProjectLabel(project: PlaygroundProjectEnum) {
  if (project === PlaygroundProjectEnum.INFINITE_SCROLL) {
    return 'Infinite Scroll';
  }
  if (project === PlaygroundProjectEnum.TIC_TAC_TOE) {
    return 'Tic Tac Toe';
  }
  return project;
}
