export type Fraction = {
  whole: number | null;
  numerator: number;
  denominator: number;
};

const isFraction = (input: string): Fraction | null => {
  const fractionRegex = /^(\d+ )?(\d+)\/(\d+)$|^(\d+)\/(\d+)$/;

  const match = input.match(fractionRegex);

  if (!match) {
    return null; // Not a valid fraction format
  }

  if (match[4]) {
    // The input is in the form "numerator/denominator"
    const numerator = parseInt(match[4]);
    const denominator = parseInt(match[5]);
    return { whole: 0, numerator, denominator };
  } else {
    // The input is in the form "whole numerator/denominator"
    const whole = match[1] ? parseInt(match[1]) : 0;
    const numerator = parseInt(match[2]);
    const denominator = parseInt(match[3]);
    return { whole, numerator, denominator };
  }
};

export default isFraction;
