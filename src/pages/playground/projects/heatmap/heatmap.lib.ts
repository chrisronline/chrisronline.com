interface GradientColorHex {
  red: number;
  green: number;
  blue: number;
}
export function computeGradientSteps(startHex: string, endHex: string, stepCount: number) {
  const start: GradientColorHex = {
    red: toHex(startHex.slice(1, 3)),
    green: toHex(startHex.slice(3, 5)),
    blue: toHex(startHex.slice(5, 7)),
  };

  const end: GradientColorHex = {
    red: toHex(endHex.slice(1, 3)),
    green: toHex(endHex.slice(3, 5)),
    blue: toHex(endHex.slice(5, 7)),
  };

  const deltaRed = end.red - start.red;
  const deltaGreen = end.green - start.green;
  const deltaBlue = end.blue - start.blue;

  const steps = [];
  for (let i = 0; i < stepCount - 1; i++) {
    const red = Math.round(start.red + ((deltaRed / stepCount) * i));
    const green = Math.round(start.green + ((deltaGreen / stepCount) * i));
    const blue = Math.round(start.blue + ((deltaBlue / stepCount) * i));
    steps.push(`#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`)
  }
  steps.push(endHex);
  return steps;
}

export function toHex(color: string) {
  return parseInt(color, 16);
}
