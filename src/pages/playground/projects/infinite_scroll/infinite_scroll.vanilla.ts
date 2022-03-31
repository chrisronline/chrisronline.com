import { getConfig } from '../../../../config';
import { CatsApiImage, PrivateConfig } from '../../../../types';
import { FETCH_WHEN_THIS_PIXELS_AWAY } from './config';

enum Element {
  scrollContainer,
  list,
  loader,
  last,
}

export function renderIntoApp(parent: HTMLElement) {
  const catsApiKey = getConfig(PrivateConfig.CatsApiKey);
  const nodeCache = new Map<Element, HTMLElement>();

  const state: { page: number; perPage: number; cats: CatsApiImage[] } = {
    page: 0,
    perPage: 10,
    cats: [],
  };

  initialRender();
  loadCats();
  setupListeners();

  async function loadCats() {
    const headers = new Headers();
    headers.append('x-api-key', catsApiKey as string);
    const url = `https://api.thecatapi.com/v1/images/search?size=thumb&order=desc&page=${state.page}&limit=${state.perPage}`;
    const response = await fetch(url, {
      headers,
    });
    const body = await response.json();
    state.cats.push(...body);
    renderCats();
  }

  function onScroll(event: Event) {
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
      nodeCache
        .get(Element.scrollContainer)
        .removeEventListener('scroll', onScroll);

      state.page++;
      loadCats().then(() => {
        nodeCache
          .get(Element.scrollContainer)
          .addEventListener('scroll', onScroll);
      });
    }
  }

  function onLeave(event: BeforeUnloadEvent) {
    window.removeEventListener('beforeunload', onLeave);
    nodeCache
      .get(Element.scrollContainer)
      .removeEventListener('scroll', onScroll);
  }

  function setupListeners() {
    window.addEventListener('beforeunload', onLeave);
    nodeCache.get(Element.scrollContainer).addEventListener('scroll', onScroll);
  }

  function renderHeader() {
    const header = document.createElement('header');
    const title = document.createElement('h2');
    title.appendChild(document.createTextNode('Infinite Scroll'));
    const subtitle = document.createElement('h3');
    subtitle.appendChild(document.createTextNode('Vanilla'));
    header.appendChild(title);
    header.appendChild(subtitle);
    return header;
  }

  function renderCats() {
    let catLi;

    // if (nodeCache.has(Element.last)) {

    // }

    for (const cat of state.cats) {
      catLi = document.createElement('li');
      const catArticle = document.createElement('article');
      catArticle.setAttribute('class', 'cat');
      const catImage = new Image();
      catImage.src = cat.url;
      catImage.setAttribute('class', 'image');
      catArticle.appendChild(catImage);
      catLi.appendChild(catArticle);
      nodeCache
        .get(Element.list)
        .insertBefore(catLi, nodeCache.get(Element.loader));
    }

    // nodeCache.set(Element.last, catLi);
  }

  function initialRender() {
    const section = document.createElement('section');
    section.appendChild(renderHeader());

    const scrollContainer = document.createElement('div');
    scrollContainer.setAttribute('class', 'scroll-container');
    const catList = document.createElement('ul');
    nodeCache.set(Element.list, catList);
    renderCats();
    const loader = document.createElement('li');
    loader.setAttribute('class', 'infinite-loading-indicator');
    const spinnerIcon = document.createElement('i');
    spinnerIcon.appendChild(document.createTextNode('Loading...'));
    loader.appendChild(spinnerIcon);
    nodeCache.set(Element.loader, loader);
    catList.appendChild(loader);
    nodeCache.set(Element.scrollContainer, scrollContainer);
    scrollContainer.appendChild(catList);
    section.appendChild(scrollContainer);

    parent.appendChild(section);
  }
}
