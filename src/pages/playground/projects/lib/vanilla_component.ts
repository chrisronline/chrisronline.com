export interface VanillaComponentProps {
  type: string;
  parent: HTMLElement;
  classes: string[];
  mql: MediaQueryList;
  renderAsString?: boolean;
}
export class VanillaComponent {
  type = '';
  parent: HTMLElement = null;
  element: HTMLElement = null;
  mql: MediaQueryList;
  classes: string[] = [];
  renderAsString = true;

  constructor({
    type,
    parent,
    classes,
    mql,
    renderAsString = true,
  }: VanillaComponentProps) {
    this.parent = parent;
    this.type = type;
    this.mql = mql;
    this.classes = classes;
    this.renderAsString = renderAsString;
    this.onResize = this.onResize.bind(this);
  }

  setParent(newParent: HTMLElement) {
    this.parent = newParent;
  }

  onResize() {
    // noting
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
    this.mql.addEventListener('change', this.onResize);
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
    this.mql.removeEventListener('change', this.onResize);
  }
}
