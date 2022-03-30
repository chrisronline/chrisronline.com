import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PlaygroundProjectEnum, RendererTypes } from '../types';
import { InfiniteScroll } from './infinite_scroll';

const RENDERER_PARAM = 'renderer';
export const PlaygroundProjects = () => {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has(RENDERER_PARAM)) {
      let newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(RENDERER_PARAM, RendererTypes.React);
      setSearchParams(newSearchParams);
    }
  }, [searchParams]);

  switch (projectId) {
    case PlaygroundProjectEnum.INFINITE_SCROLL:
      return <InfiniteScroll renderer={searchParams.get(RENDERER_PARAM) as RendererTypes} />
  }

  return (
    <h1>Project not found</h1>
  )
}