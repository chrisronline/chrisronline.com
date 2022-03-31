import React, { createRef, useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { ConfigContext } from '../../../../context';
import { CatsApiImage } from '../../../../types';
import { FETCH_WHEN_THIS_PIXELS_AWAY } from './config';
import './infinite_scroll.scss';

const useInfiniteScroll = (
  callback: () => void,
  getScrollingContainer: () => HTMLDivElement
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getScrollingContainer().addEventListener('scroll', onScroll);
    return () =>
      getScrollingContainer()?.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    callback();
  }, [isLoading]);

  function onScroll(event: Event) {
    if (isLoading) return;
    const element = event.target as HTMLDivElement;
    const loadingIndicator = element.querySelector(
      '.infinite-loading-indicator'
    );
    const distanceFromBottom =
      element.scrollHeight -
      (element.scrollTop +
        element.clientHeight +
        loadingIndicator.clientHeight);
    if (distanceFromBottom <= FETCH_WHEN_THIS_PIXELS_AWAY) {
      setIsLoading(true);
    }
  }

  return { setIsLoading };
};

export const InfiniteScrollReact = () => {
  const { catsApiKey } = useContext(ConfigContext);
  const [page, setPage] = useState(0);
  const [perPage] = useState(10);
  const scrollingContainer = createRef<HTMLDivElement>();
  const [cats, setCats] = useState<CatsApiImage[]>([]);
  const { setIsLoading } = useInfiniteScroll(
    loadMoreCats,
    () => scrollingContainer.current
  );

  async function loadCats() {
    const headers = new Headers();
    headers.append('x-api-key', catsApiKey as string);
    const url = `https://api.thecatapi.com/v1/images/search?size=thumb&order=desc&page=${page}&limit=${perPage}`;
    const response = await fetch(url, {
      headers,
    });
    const body = await response.json();
    setCats([...cats, ...body]);
    setIsLoading(false);
  }

  function loadMoreCats() {
    setPage(page + 1);
  }

  useEffect(() => {
    loadCats();
  }, [page]);

  return (
    <div className="scroll-container" ref={scrollingContainer}>
      <ul>
        {cats.map((cat) => (
          <li key={cat.id}>
            <article className="cat">
              <img src={cat.url} className="image" />
            </article>
          </li>
        ))}
        <li className="infinite-loading-indicator">
          <FontAwesomeIcon icon={solid('spinner')} spin={true} />
        </li>
      </ul>
    </div>
  );
};
