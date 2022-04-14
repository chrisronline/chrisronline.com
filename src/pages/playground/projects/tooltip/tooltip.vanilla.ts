import { VanillaComponent, VanillaComponentProps } from '../lib';

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

const TOOLTIP_HELPERS = {
  positionCenter: (elementDomRect: DOMRect, tooltipDomRect: DOMRect) => {
    return (
      elementDomRect.x -
      tooltipDomRect.x +
      (elementDomRect.width / 2 - tooltipDomRect.width / 2)
    );
  },
  positionRight: (
    elementDomRect: DOMRect,
    tooltipDomRect: DOMRect,
    spacing?: number
  ) => {
    return elementDomRect.x - tooltipDomRect.x + elementDomRect.width + spacing;
  },
  positionLeft: (
    elementDomRect: DOMRect,
    tooltipDomRect: DOMRect,
    spacing?: number
  ) => {
    return elementDomRect.x - tooltipDomRect.x - tooltipDomRect.width - spacing;
  },
};

function getNextPositions(position: Position) {
  switch (position) {
    case Position.top:
      return [Position.bottom, Position.right, Position.left];
    case Position.right:
      return [Position.left, Position.top, Position.bottom];
  }
}

function getCoordinatesFromPosition(
  position: Position,
  elementDomRect: DOMRect,
  tooltipDomRect: DOMRect,
  spacing: number
) {
  let x, y;
  switch (position) {
    case Position.top:
      x = TOOLTIP_HELPERS.positionCenter(elementDomRect, tooltipDomRect);
      y = -(elementDomRect.height + tooltipDomRect.height) - spacing;
      break;
    case Position.right:
      x = TOOLTIP_HELPERS.positionRight(
        elementDomRect,
        tooltipDomRect,
        spacing
      );
      y = -(elementDomRect.height - spacing);
      break;
    case Position.left:
      x = TOOLTIP_HELPERS.positionLeft(elementDomRect, tooltipDomRect, spacing);
      y = -(elementDomRect.height - spacing);
      break;
    case Position.bottom:
      x = TOOLTIP_HELPERS.positionCenter(elementDomRect, tooltipDomRect);
      y = spacing;
      break;
  }
  return { x, y };
}

export function renderIntoApp(parent: HTMLElement) {
  let globalId = 0;

  class TooltipWrapper extends VanillaComponent {
    id = '';
    position: TooltipWrapperProps['position'];
    nextPositions: TooltipWrapperProps['position'][];
    nextPositionIndex: number;
    content: TooltipWrapperProps['content'];
    events: TooltipWrapperProps['events'];
    tooltip: HTMLElement;
    spacingInPixels: TooltipWrapperProps['spacingInPixels'];
    children: ChildNode[];
    tooltipBounds: DOMRect;
    elementBounds: DOMRect;
    observer: IntersectionObserver;
    shadowObserver: IntersectionObserver;
    shadowTooltip: HTMLElement;

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
      this.nextPositions = getNextPositions(position);
      this.nextPositionIndex = -1;
      this.content = content;
      this.events = events;
      this.spacingInPixels = spacingInPixels;
      this.children = Array.from(parentProps.parent.childNodes);
      this.showTooltip = this.showTooltip.bind(this);
      this.hideTooltip = this.hideTooltip.bind(this);
      this.defaultPosition = this.defaultPosition.bind(this);
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

      this.parent.appendChild(this.tooltip);
    }

    postRender() {
      super.postRender();

      if (this.events.includes(Events.click)) {
        window.addEventListener('click', this.hideTooltip);
      }

      // console.log(this.elementBounds.width);
      // setTimeout(() => {
      //   console.log('time1', this.element.getBoundingClientRect().width);
      // }, 100);
      // requestAnimationFrame(() => {
      //   console.log('raf', this.element.getBoundingClientRect().width);
      // });
      setTimeout(() => {
        this.calculateBounds();
        this.defaultPosition();

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
      }, 300);
    }

    calculateBounds() {
      this.tooltipBounds = this.tooltip.getBoundingClientRect();
      this.elementBounds = this.element.getBoundingClientRect();
      if (window.scrollY) {
        this.tooltipBounds.y += window.scrollY;
        this.elementBounds.y += window.scrollY;
      }
    }

    defaultPosition() {
      // Cleanup any shadow logic
      this.shadowObserver?.disconnect();
      this.nextPositionIndex = -1;

      const { x, y } = getCoordinatesFromPosition(
        this.position,
        this.elementBounds,
        this.tooltipBounds,
        this.spacingInPixels
      );
      this.tooltip.style.position = 'absolute';
      this.tooltip.style.top = 'auto';
      this.tooltip.style.transform = `translate3d(${x}px,${y}px,0px)`;
    }

    swapPosition() {
      // Add shadow tooltip so we know when to swap back
      this.shadowTooltip?.remove();
      this.shadowTooltip = this.tooltip.cloneNode(true) as HTMLElement;
      const { x: shadowX, y: shadowY } = getCoordinatesFromPosition(
        this.position,
        this.elementBounds,
        this.tooltipBounds,
        this.spacingInPixels
      );
      this.shadowTooltip.style.transform = `translate3d(${shadowX}px,${shadowY}px,0px)`;
      this.shadowTooltip.classList.add('shadow');
      this.shadowTooltip.style.visibility = 'hidden';
      this.parent.appendChild(this.shadowTooltip);
      this.shadowObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio === 1) {
              this.defaultPosition();
            }
          });
        },
        { threshold: 1 }
      );
      this.shadowObserver.observe(this.shadowTooltip);

      this.observer.disconnect();
      if (this.nextPositionIndex + 1 === 4) {
        const { x, y } = getCoordinatesFromPosition(
          this.nextPositions[0],
          this.elementBounds,
          this.tooltipBounds,
          this.spacingInPixels
        );
        this.tooltip.style.transform = `translate3d(${x}px,${y}px,0px)`;
      } else {
        ++this.nextPositionIndex;
        const index =
          this.nextPositionIndex + 1 === 4 ? 0 : this.nextPositionIndex;
        const nextPosition = this.nextPositions[index];
        const { x, y } = getCoordinatesFromPosition(
          nextPosition,
          this.elementBounds,
          this.tooltipBounds,
          this.spacingInPixels
        );
        this.tooltip.style.transform = `translate3d(${x}px,${y}px,0px)`;
        this.observer.observe(this.tooltip);
      }
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
      this.tooltip.remove();
      this.shadowObserver?.disconnect();
      this.shadowTooltip?.remove();
    }
  }

  const htmlPage = `
    <div class="tooltip-content">
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
    spacingInPixels: 5,
    parent: document.getElementById('tooltip_top'),
    classes: [],
  }).render();

  new TooltipWrapper({
    position: Position.right,
    events: [Events.click],
    content: 'This goes to the right',
    type: 'div',
    spacingInPixels: 5,
    parent: document.getElementById('tooltip_right'),
    classes: [],
  }).render();
}
