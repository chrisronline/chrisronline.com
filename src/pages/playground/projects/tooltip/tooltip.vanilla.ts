import { VanillaComponent, VanillaComponentProps } from '../lib';

enum Position {
  top,
  bottom,
  left,
  right,
}

enum Events {
  click,
  hover,
}

interface TooltipWrapperProps {
  position: Position;
  content: string | HTMLElement | VanillaComponent;
  events: Events[];
  spacingInPixels?: number;
  sticky?: boolean;
}

function throttle(callback: () => void, delay: number) {
  let called = false;
  let lastArgs: unknown[] = null;
  return (...args: unknown[]) => {
    if (called) {
      lastArgs = args;
      return;
    }
    called = true;
    callback.apply(this, ...args);
    setTimeout(() => {
      callback.apply(this, lastArgs);
      lastArgs = null;
      called = false;
    }, delay);
  };
}

// function debounce(callback: () => void, delay: number) {
//   let timer: NodeJS.Timeout;
//   return (...args: unknown[]) => {
//     if (timer) clearTimeout(timer);
//     timer = setTimeout(() => {
//       callback.apply(this, ...args);
//       timer = null;
//     }, delay);
//   }
// }

function memo(callback: () => void, key?: string, durationInMs?: number) {
  const cache = new Map<string, () => void>();
  const cacheKey = key ?? callback.toString();
  return (...args: unknown[]) => {
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const func = callback.apply(this, args);
    cache.set(cacheKey, func);
    setTimeout(
      () => {
        cache.delete(cacheKey);
      },
      durationInMs ? durationInMs : 300
    );
    return func;
  };
}

export function renderIntoApp(parent: HTMLElement) {
  let globalId = 0;

  class TooltipWrapper extends VanillaComponent {
    id = '';
    position: TooltipWrapperProps['position'];
    content: TooltipWrapperProps['content'];
    events: TooltipWrapperProps['events'];
    tooltip: HTMLElement;
    spacingInPixels: TooltipWrapperProps['spacingInPixels'];
    children: ChildNode[];
    tooltipBounds: DOMRect;
    elementBounds: DOMRect;
    sticky: boolean;

    constructor({
      position,
      content,
      events,
      spacingInPixels = 0,
      sticky = false,
      ...parentProps
    }: VanillaComponentProps & TooltipWrapperProps) {
      super({ ...parentProps, renderAsString: false });

      this.id = `${++globalId}_tooltip_wrapper_${+new Date()}`;
      this.position = position;
      this.content = content;
      this.events = events;
      this.spacingInPixels = spacingInPixels;
      this.sticky = sticky;
      this.children = Array.from(parentProps.parent.childNodes);
      this.showTooltip = this.showTooltip.bind(this);
      this.hideTooltip = this.hideTooltip.bind(this);
      this.onScroll = throttle(this.onScroll.bind(this), 300);
      this.positionTooltip = memo(this.positionTooltip.bind(this));
      this.swapPosition = memo(this.swapPosition.bind(this));
    }

    toElement() {
      const wrapperElement = document.createElement('div');
      wrapperElement.setAttribute('id', this.id);
      wrapperElement.classList.add('tooltip-wrapper');

      for (const event of this.events) {
        switch (event) {
          case Events.click:
            wrapperElement.addEventListener('click', this.showTooltip);
            break;
          case Events.hover:
            wrapperElement.addEventListener('mouseover', this.showTooltip);
            wrapperElement.addEventListener('mouseout', this.hideTooltip);
            break;
        }
      }

      for (const child of this.children) {
        wrapperElement.appendChild(child);
      }

      this.tooltip = document.createElement(this.type);
      this.tooltip.classList.add(...['tooltip', ...this.classes]);
      this.tooltip.style.visibility = 'hidden';

      if (typeof this.content === 'string') {
        this.tooltip.appendChild(document.createTextNode(this.content));
      } else if (this.content instanceof HTMLElement) {
        this.tooltip.appendChild(this.content);
      } else if (this.content instanceof VanillaComponent) {
        this.content.setParent(this.tooltip);
        this.content.render();
      }

      wrapperElement.appendChild(this.tooltip);
      return wrapperElement;
    }

    postRender() {
      super.postRender();

      if (this.events.includes(Events.click)) {
        window.addEventListener('click', this.hideTooltip);
      }
      window.addEventListener('scroll', this.onScroll);

      // console.log(this.elementBounds.width);
      // setTimeout(() => {
      //   console.log('time1', this.element.getBoundingClientRect().width);
      // }, 100);
      // requestAnimationFrame(() => {
      //   console.log('raf', this.element.getBoundingClientRect().width);
      // });
      setTimeout(() => {
        this.tooltipBounds = this.tooltip.getBoundingClientRect();
        this.elementBounds = this.element.getBoundingClientRect();
        console.log(this.elementBounds.x)
        if (window.scrollY) {
          this.tooltipBounds.y += window.scrollY;
          this.elementBounds.y += window.scrollY;
        }

        this.positionTooltip();
      }, 300);
    }

    positionTooltip() {
      let x = 0;
      let y = 0;
      switch (this.position) {
        case Position.top:
          x = 0;//this.elementBounds.x;// - this.elementBounds.width;
          y =
            -(this.elementBounds.height + this.tooltipBounds.height) -
            this.spacingInPixels;
          break;
        case Position.right:
          x =
            this.elementBounds.x +
            this.elementBounds.width / 2 +
            this.spacingInPixels;
          y = -this.tooltipBounds.height;
          break;
      }

      this.tooltip.style.position = 'absolute';
      this.tooltip.style.top = 'auto';
      this.tooltip.style.transform = `translate3d(${x}px,${y}px,0px)`;
    }

    swapPosition(completelyOutOfBounds = false) {
      let x = 0;
      let y = 0;
      switch (this.position) {
        case Position.top:
          x = this.elementBounds.x - this.elementBounds.width;
          y = this.spacingInPixels;
          if (completelyOutOfBounds && this.sticky) {
            this.tooltip.style.position = 'fixed';
            this.tooltip.style.top = '0px';
          }
          break;
      }
      this.tooltip.style.transform = `translate3d(${x}px,${y}px,0px)`;
    }

    showTooltip() {
      if (!this.element || !this.tooltip) return;
      this.tooltip.style.visibility = 'visible';
    }

    hideTooltip(event: Event) {
      if (!this.element || !this.tooltip) return;
      if (event.type !== 'mouseout') {
        if (event.target === this.element || event.target === this.tooltip)
          return;
      }
      this.tooltip.style.visibility = 'hidden';
    }

    onScroll() {
      if (this.position === Position.top) {
        const tooltipScrollY = this.tooltipBounds.y - this.tooltipBounds.height;
        const gapFromAbove =
          window.scrollY - tooltipScrollY + this.spacingInPixels;
        if (gapFromAbove > 0) {
          const gapFromOutOfBounds =
            gapFromAbove -
            this.elementBounds.height -
            this.tooltipBounds.height -
            this.spacingInPixels;
          this.swapPosition(gapFromOutOfBounds > 0);
        } else {
          this.positionTooltip();
        }
      }
    }

    destroy() {
      for (const event of this.events) {
        switch (event) {
          case Events.click:
            this.tooltip.removeEventListener('click', this.showTooltip);
            window.removeEventListener('click', this.hideTooltip);
            break;
          case Events.hover:
            this.element.removeEventListener('mouseover', this.showTooltip);
            this.element.removeEventListener('mouseout', this.hideTooltip);
            break;
        }
      }

      super.destroy();
      this.tooltip.remove();
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  const htmlPage = `
    <div className="content">
    <h1>HTML Ipsum Presents</h1>

    <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris <span id="tooltip_top">placerat eleifend</span> leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

    <h2>Header Level 2</h2>

    <ol>
       <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
       <li>Aliquam tincidunt mauris eu risus.</li>
    </ol>

    <blockquote><p>Lorem ipsum dolor sit amet, consectetur <span id="tooltip_right">adipiscing</span> elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

    <h3>Header Level 3</h3>

    <ul>
       <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
       <li>Aliquam tincidunt mauris eu risus.</li>
    </ul>

    <pre><code>
    #header h1 a {
      display: block;
      width: 300px;
      height: 80px;
    }
    </code></pre>

    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
      </div>`;

  const wrapper = document.createElement('section');
  wrapper.innerHTML = htmlPage;
  parent.appendChild(wrapper);

  new TooltipWrapper({
    position: Position.top,
    events: [Events.click],
    content: 'Hey Chris!',
    type: 'div',
    sticky: true,
    spacingInPixels: 5,
    parent: document.getElementById('tooltip_top'),
    classes: [],
  }).render();

  // new TooltipWrapper({
  //   position: Position.right,
  //   events: [Events.click],
  //   content: 'This goes to the right',
  //   type: 'div',
  //   spacingInPixels: 5,
  //   parent: document.getElementById('tooltip_right'),
  //   classes: [],
  // }).render();
}
