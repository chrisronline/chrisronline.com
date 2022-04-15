import { throttle, VanillaComponent, VanillaComponentProps } from '../lib';

enum Position {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
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
}

function getNextPositions(position: Position) {
  switch (position) {
    case Position.top:
      return [Position.bottom, Position.right, Position.left];
    case Position.right:
      return [Position.left, Position.top, Position.bottom];
    case Position.left:
      return [Position.right, Position.top, Position.bottom];
    case Position.bottom:
      return [Position.top, Position.left, Position.right];
  }
}

export function renderIntoApp(parent: HTMLElement) {
  let globalId = 0;

  class TooltipWrapper extends VanillaComponent {
    id = '';
    position: TooltipWrapperProps['position'];
    content: TooltipWrapperProps['content'];
    events: TooltipWrapperProps['events'];
    tooltip: HTMLElement;
    nextPositions: Position[];
    nextPositionIndex: number;
    spacingInPixels: TooltipWrapperProps['spacingInPixels'];
    children: ChildNode[];
    tooltipBounds: DOMRect;
    elementBounds: DOMRect;
    observer: IntersectionObserver;
    shadowObserver: IntersectionObserver;
    shadowTooltip: HTMLElement;
    resizeObserver: ResizeObserver;

    constructor({
      position,
      content,
      events,
      spacingInPixels = 0,
      ...parentProps
    }: VanillaComponentProps & TooltipWrapperProps) {
      super({ ...parentProps, renderAsString: false });

      this.id = `${++globalId}_tooltip_wrapper_${+new Date()}`;
      this.position = position;
      this.content = content;
      this.events = events;
      this.spacingInPixels = spacingInPixels;
      this.nextPositions = getNextPositions(position);
      this.nextPositionIndex = 0;

      this.children = Array.from(parentProps.parent.childNodes);
      this.showTooltip = this.showTooltip.bind(this);
      this.hideTooltip = this.hideTooltip.bind(this);
      this.positionTooltip = this.positionTooltip.bind(this);
      this.swapPosition = this.swapPosition.bind(this);
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

      return wrapperElement;
    }

    render() {
      super.render();

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

      const onResize = throttle(() => {
        this.calculateBounds();
        this.positionTooltip();
      }, 300);
      this.resizeObserver = new ResizeObserver(onResize);
      this.resizeObserver.observe(this.tooltip);

      this.element.appendChild(this.tooltip);
    }

    postRender() {
      super.postRender();

      if (this.events.includes(Events.click)) {
        window.addEventListener('click', this.hideTooltip);
      }
    }

    calculateBounds() {
      this.tooltipBounds = this.tooltip.getBoundingClientRect();
      this.elementBounds = this.element.getBoundingClientRect();
      if (window.scrollY) {
        this.tooltipBounds.y += window.scrollY;
        this.elementBounds.y += window.scrollY;
      }
    }

    positionTooltip(position: Position = this.position) {
      if (position === Position.top || position === Position.bottom) {
        this.tooltip.style.left = `${
          this.elementBounds.width / 2 - this.tooltipBounds.width / 2
        }px`;

        if (position === Position.top) {
          if (this.tooltipBounds.height > this.elementBounds.height) {
            this.tooltip.style.top = `-${
              this.tooltipBounds.height + this.spacingInPixels
            }px`;
          } else {
            this.tooltip.style.top = `calc(-100% - ${this.spacingInPixels}px)`;
          }
        } else {
          this.tooltip.style.top = `calc(100% + ${this.spacingInPixels}px)`;
        }
      } else if (position === Position.left || position === Position.right) {
        this.tooltip.style.top = `0px`;

        let percentage;
        let operator;
        if (position === Position.left) {
          percentage = '-100%';
          operator = '-';
        } else {
          percentage = '-100%';
          operator = '-';
        }
        this.tooltip.style.top = `calc(${percentage} ${operator} ${this.spacingInPixels}px)`;
      }
    }

    swapPosition() {
      // Add shadow tooltip so we know when to swap back
      this.shadowTooltip?.remove();
      this.shadowTooltip = this.tooltip.cloneNode(true) as HTMLElement;
      this.shadowTooltip.classList.add('shadow');
      this.shadowTooltip.style.visibility = 'hidden';
      this.element.appendChild(this.shadowTooltip);
      this.shadowObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio === 1) {
              this.shadowObserver?.disconnect();
              this.nextPositionIndex = 0;
              this.positionTooltip();
            }
          });
        },
        { threshold: 1 }
      );
      this.shadowObserver.observe(this.shadowTooltip);

      this.observer.disconnect();
      const nextPosition = this.nextPositions[this.nextPositionIndex++];
      if (!nextPosition) {
        console.log('ran out')
        this.shadowObserver.disconnect();
        return;
      }
      this.positionTooltip(nextPosition);
      this.observer.observe(this.tooltip);
    }

    showTooltip() {
      if (!this.element || !this.tooltip) return;
      this.calculateBounds();
      this.positionTooltip();
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio < 0.9) {
              this.swapPosition();
            }
          });
        },
        { threshold: 0.9 }
      );
      this.observer.observe(this.tooltip);
      this.tooltip.style.visibility = 'visible';
    }

    hideTooltip(event: Event) {
      if (!this.element || !this.tooltip) return;
      if (event.type !== 'mouseout') {
        if (event.target === this.element || event.target === this.tooltip) {
          return;
        }
        let parentChain = (event.target as HTMLElement).parentNode;
        while (parentChain) {
          if (parentChain === this.element || parentChain === this.tooltip) {
            return;
          }
          parentChain = parentChain.parentNode;
        }
      }
      this.tooltip.style.visibility = 'hidden';
    }

    getTooltip() {
      return this.tooltip;
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
      this.observer?.disconnect();
      this.resizeObserver?.disconnect();
      this.tooltip.remove();
      this.shadowObserver?.disconnect();
      this.shadowTooltip?.remove();
    }
  }

  const htmlPage = `
    <div class="tooltip-content">
    <h1>HTML Ipsum Presents</h1>

    <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris <span id="tooltip_top">placerat eleifend</span> leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. <span id="tooltip_html">Aenean fermentum</span>, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

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

  const top = new TooltipWrapper({
    position: Position.top,
    events: [Events.click],
    content: 'Hey Chris!',
    type: 'div',
    spacingInPixels: 5,
    parent: document.getElementById('tooltip_top'),
    classes: [],
  });
  top.render();

  const right = new TooltipWrapper({
    position: Position.right,
    events: [Events.click],
    content: 'This goes to the right',
    type: 'div',
    spacingInPixels: 5,
    parent: document.getElementById('tooltip_right'),
    classes: [],
  });
  right.render();

  const nested = new TooltipWrapper({
    position: Position.top,
    events: [Events.click],
    content: 'Nested',
    type: 'div',
    spacingInPixels: 5,
    parent: top.getTooltip(),
    classes: [],
  });
  nested.render();

  const htmlTooltipContent = document.createElement('div');
  htmlTooltipContent.innerHTML = `
    <section class="html_tooltip_wrapper">
      <header>
        <h4>This is a tooltip
      </header>
      <p>Yes, it is</p>
      <p><button id="load_btn">Load image</button></p>
      <img id="dynamic_image" />
    </section>
  `;
  const htmlTooltip = new TooltipWrapper({
    position: Position.top,
    events: [Events.click],
    content: htmlTooltipContent,
    type: 'div',
    spacingInPixels: 5,
    parent: document.getElementById('tooltip_html'),
    classes: [],
  });
  htmlTooltip.render();

  document.getElementById('load_btn').addEventListener('click', () => {
    document
      .getElementById('dynamic_image')
      .setAttribute('src', 'https://picsum.photos/200');
  });
}
