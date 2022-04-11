import { VanillaComponent, VanillaComponentProps } from '../lib';

enum Position {
  top,
  bottom,
  left,
  right
}

interface TooltipWrapperProps {
  position: Position;
}

export function renderIntoApp(parent: HTMLElement) {
  class TooltipWrapper extends VanillaComponent {
    position: Position;
    constructor({ position, ...parentProps }: VanillaComponentProps & TooltipWrapperProps) {
      super(parentProps);

      this.position = position;
    }

    html() {

      return `
        <div class="tooltip-wrapper">
          ${this.child.html()}
        </div>
      `;
    }
  }
}
