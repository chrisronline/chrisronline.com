import React, { createRef, useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { ConfigContext } from '../../../../context';
import { CatsApiImage } from '../../../../types';
import { FETCH_WHEN_THIS_PIXELS_AWAY } from './config';

const useInfiniteScroll = (
  callback: () => void,
  getScrollingContainer: () => HTMLDivElement
) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    getScrollingContainer().addEventListener('scroll', onScroll);
    return () =>
      getScrollingContainer()?.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  function onScroll(event: Event) {
    if (isFetching) return;
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
      setIsFetching(true);
    }
  }

  return { setIsFetching };
};

export const InfiniteScrollReact = () => {
  const { catsApiKey } = useContext(ConfigContext);
  const [page, setPage] = useState(0);
  const [perPage] = useState(10);
  const scrollingContainer = createRef<HTMLDivElement>();
  const [cats, setCats] = useState<CatsApiImage[]>([]);
  const { setIsFetching } = useInfiniteScroll(
    loadMoreImages,
    () => scrollingContainer.current
  );

  async function loadCommits() {
    const headers = new Headers();
    headers.append('x-api-key', catsApiKey as string);
    const url = `https://api.thecatapi.com/v1/images/search?size=thumb&order=desc&page=${page}&limit=${perPage}`;
    const response = await fetch(url, {
      headers,
    });
    const body = await response.json();
    setCats([...cats, ...body]);
    setIsFetching(false);
  }

  function loadMoreImages() {
    setPage(page + 1);
  }

  useEffect(() => {
    loadCommits();
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
