import { computeGradientSteps } from './heatmap.lib';
import { HeatmapDataSet } from './types';

export class Heatmap {
  data: HeatmapDataSet;
  flattened: number[];
  gradients: Map<number, string>;

  constructor(
    data: HeatmapDataSet,
    gradientStart: string,
    gradientEnd: string
  ) {
    this.data = data;
    const flat = new Set<number>();
    for (const list of data) {
      for (const num of list) {
        flat.add(num);
      }
    }
    this.flattened = Array.from(flat);
    this.flattened.sort();

    this.gradients = new Map();
    const gradientSteps = computeGradientSteps(gradientStart, gradientEnd, this.flattened.length);
    for (let i = 0; i < gradientSteps.length; i++) {
      this.gradients.set(this.flattened[i], gradientSteps[i]);
    }
  }

  getColor(num: number) {
    return this.gradients.get(num);
  }
}
