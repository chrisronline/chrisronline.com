import { PlaygroundProjectEnum } from '../pages/playground/types';

export function getPlaygroundProjectLabel(project: PlaygroundProjectEnum) {
  switch (project) {
    case PlaygroundProjectEnum.INFINITE_SCROLL:
      return 'Infinite Scroll';
    case PlaygroundProjectEnum.TIC_TAC_TOE:
      return 'Tic Tac Toe';
    case PlaygroundProjectEnum.PHONE_INPUT:
      return 'Phone Input';
    case PlaygroundProjectEnum.TREE_OUTLINE:
      return 'Tree Outline';
    case PlaygroundProjectEnum.YOUTUBE_GALLERY:
      return 'Youtube Gallery';
    case PlaygroundProjectEnum.STAR_RATING:
      return 'Star Rating';
  }
  return project;
}
