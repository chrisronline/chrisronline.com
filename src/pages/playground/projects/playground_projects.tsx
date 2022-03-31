import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import { capitalize } from '../../../lib/capitalize';
import { getPlaygroundProjectLabel } from '../../../lib/playground_project_label';
import { PlaygroundProjectEnum, RendererTypes } from '../types';
import { InfiniteScrollReact, renderInfiniteScroll } from './infinite_scroll';
import { SliderReact, renderSlider } from './slider';
import './playground_projects.scss';
import { RenderVanilla } from '../../../components';

const RENDERER_PARAM = 'renderer';
export const PlaygroundProjects = () => {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has(RENDERER_PARAM)) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(RENDERER_PARAM, RendererTypes.React);
      setSearchParams(newSearchParams);
    }
  }, [searchParams]);

  function renderProject() {
    switch (projectId) {
      case PlaygroundProjectEnum.INFINITE_SCROLL:
        switch (searchParams.get(RENDERER_PARAM)) {
          case RendererTypes.React:
            return <InfiniteScrollReact />;
          case RendererTypes.Vanilla:
            return <RenderVanilla render={renderInfiniteScroll} />
        }
      case PlaygroundProjectEnum.SLIDER:
        switch (searchParams.get(RENDERER_PARAM)) {
          case RendererTypes.React:
            return <SliderReact />;
          case RendererTypes.Vanilla:
            return <RenderVanilla render={renderSlider} />
        }
    }
  }

  return (
    <section>
      <header>
        <h2>{getPlaygroundProjectLabel(projectId as PlaygroundProjectEnum)}</h2>
        <ul className="renderer-list">
          {Object.values(RendererTypes).map((rendererType) => {
            return (
              <li key={rendererType} className="renderer-list-item">
                <Link
                  to={`?renderer=${rendererType}`}
                  className={searchParams.get(RENDERER_PARAM) === rendererType ? 'nav-link active' : 'nav-link'}
                >
                  {capitalize(rendererType)}
                </Link>
              </li>
            );
          })}
        </ul>
      </header>
      {renderProject()}
    </section>
  );
};
