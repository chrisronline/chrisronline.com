import { VanillaComponent, VanillaComponentProps } from '../lib';
import './star_rating.scss';

function addCss(src: string) {
  const link = document.createElement('link');
  link.setAttribute('href', src);
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  document.head.appendChild(link);
}
export function renderIntoApp(parent: HTMLElement) {
  // Add the custom stylesheet
  addCss(
    'https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css'
  );

  function buildStar(filled: boolean) {
    const element = document.createElement('i');
    element.className = `fa fa-2x ${filled ? `fa-star` : `fa-star-o`}`;
    return element;
  }

  class StarRating extends VanillaComponent {
    starCount = 0;
    temporarilyStarsFilled = -1;
    starsFilled = -1;
    callback: (value: string) => void = null;
    stars: HTMLElement[];
    wrapper: HTMLElement;

    constructor({
      starCount,
      callback,
      ...parentArgs
    }: VanillaComponentProps & {
      starCount: number;
      callback: (value: string) => void;
    }) {
      super({ ...parentArgs, renderAsString: false });
      this.starCount = starCount;
      this.callback = callback;
      this.stars = [];
      this.onMouseOver = this.onMouseOver.bind(this);
      this.onMouseOut = this.onMouseOut.bind(this);
      this.onClick = this.onClick.bind(this);
    }

    update() {
      for (let i = 0; i < this.stars.length; i++) {
        const filled = i <= Math.max(this.starsFilled, this.temporarilyStarsFilled);
        this.stars[i].className = `fa fa-2x ${filled ? `fa-star` : `fa-star-o`}`;
      }
    }

    toElement(): HTMLElement {
      this.wrapper = document.createElement('div');
      this.wrapper.setAttribute('id', 'star-wrapper');
      for (let i = 0; i < this.starCount; i++) {
        const star = buildStar(i <= Math.max(this.starsFilled, this.temporarilyStarsFilled));
        star.dataset.index = '' + i;
        this.stars.push(star);
        this.wrapper.appendChild(star);
      }
      this.wrapper.addEventListener('mouseover', this.onMouseOver);
      this.wrapper.addEventListener('mouseout', this.onMouseOut);
      this.wrapper.addEventListener('click', this.onClick)
      return this.wrapper;
    }

    onMouseOver(e: MouseEvent) {
      const index = Number(
        (e.target as HTMLElement).dataset.index
      );
      this.temporarilyStarsFilled = index;
      this.update();
    }

    onMouseOut() {
      this.temporarilyStarsFilled = -1;
      this.update();
    }

    onClick(e: MouseEvent) {
      const index = Number(
        (e.target as HTMLElement).dataset.index
      );
      this.starsFilled = index;
      this.update();
    }

    destroy(): void {
      super.destroy();

      this.wrapper.removeEventListener('mouseover', this.onMouseOver);
      this.wrapper.removeEventListener('click', this.onClick);
      this.wrapper.removeEventListener('mouseout', this.onMouseOut);
    }
  }

  const parentHtml = `
  <div id="star"></div>
  <div id="display-star"></div>
  `;
  const section = document.createElement('section');
  section.innerHTML = parentHtml;
  parent.appendChild(section);

  // Setup our consumer
  function getStar(value: string) {
    document.getElementById('display-star').innerHTML = value;
  }
  const sr = new StarRating({
    type: 'div',
    parent: document.getElementById('star'),
    classes: [],
    starCount: 5,
    callback: getStar,
  });
  sr.render();
  // new Star('#star', 5, getStar);
}
