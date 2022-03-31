import React from 'react';
import { RenderVanilla } from '../../../../components';
import { RendererTypes } from '../../types';
import { SliderReact } from './slider.react';
// import './slider.scss';
import { renderIntoApp } from './slider.vanilla';

export type SliderProps = {
  renderer: RendererTypes;
}
export const Slider: React.FunctionComponent<SliderProps> = ({ renderer }) => {
  switch (renderer) {
    case RendererTypes.React:
      return <SliderReact />
    case RendererTypes.Vanilla:
      return <RenderVanilla render={renderIntoApp} />
  }
}