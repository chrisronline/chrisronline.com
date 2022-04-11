export interface VanillaComponentProps {
  type: string;
  parent: HTMLElement;
  classes: string[];
  child?: VanillaComponent;
}
export class VanillaComponent {
  type = '';
  parent: HTMLElement = null;
  element: HTMLElement = null;
  classes: string[] = [];
  child?: VanillaComponent;

  constructor({
    type,
    parent,
    classes,
    child,
  }: VanillaComponentProps) {
    this.parent = parent;
    this.type = type;
    this.classes = classes;
    this.child = child;
  }

  render() {
    if (this.element) this.destroy();
    this.element = document.createElement(this.type);
    this.element.classList.add(...this.classes);
    this.element.innerHTML = this.html();
    this.parent.appendChild(this.element);
  }

  html() {
    return ``;
  }

  destroy() {
    this.element.remove();
  }
}