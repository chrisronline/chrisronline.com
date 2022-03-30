import React from 'react';
import { RendererTypes } from '../../types';
import { InfiniteScrollReact } from './infinite_scroll.react';
import './infinite_scroll.scss';

export type InfiniteScrollProps = {
  renderer: RendererTypes;
}
export const InfiniteScroll: React.FunctionComponent<InfiniteScrollProps> = ({ renderer }) => {
  switch (renderer) {
    case RendererTypes.React:
      return <InfiniteScrollReact />
  }

  return (
    <h1>Not found</h1>
  )
}