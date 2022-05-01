export interface VanillaComponentProps {
  type: string;
  parent: HTMLElement;
  classes: string[];
  renderAsString?: boolean;
}
export class VanillaComponent {
  type = '';
  parent: HTMLElement = null;
  element: HTMLElement = null;
  classes: string[] = [];
  renderAsString = true;

  constructor({
    type,
    parent,
    classes,
    renderAsString = true,
  }: VanillaComponentProps) {
    this.parent = parent;
    this.type = type;
    this.classes = classes;
    this.renderAsString = renderAsString;
  }

  setParent(newParent: HTMLElement) {
    this.parent = newParent;
  }

  render() {
    if (this.element) this.destroy();
    if (this.renderAsString) {
      this.element = document.createElement(this.type);
      this.element.classList.add(...this.classes);
      this.element.innerHTML = this.toHtml();
    } else {
      this.element = this.toElement();
    }
    this.parent.appendChild(this.element);
    this.postRender();
  }

  toHtml() {
    return ``;
  }

  toElement(): HTMLElement | null {
    return null;
  }

  postRender() {
    // nothing
  }

  destroy() {
    this.element.remove();
  }
}
