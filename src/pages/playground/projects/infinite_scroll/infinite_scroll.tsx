import React from 'react';
import { RenderVanilla } from '../../../../components';
import { RendererTypes } from '../../types';
import { InfiniteScrollReact } from './infinite_scroll.react';
import './infinite_scroll.scss';
import { renderIntoApp } from './infinite_scroll.vanilla';

export type InfiniteScrollProps = {
  renderer: RendererTypes;
}
export const InfiniteScroll: React.FunctionComponent<InfiniteScrollProps> = ({ renderer }) => {
  switch (renderer) {
    case RendererTypes.React:
      return <InfiniteScrollReact />
    case RendererTypes.Vanilla:
      return <RenderVanilla render={renderIntoApp} />
  }
}