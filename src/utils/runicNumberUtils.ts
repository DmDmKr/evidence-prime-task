/**
 * Generates CSS class names for displaying a runic numeral
 * Based on the number, returns classes that control which SVG paths are visible
 *
 * @param num - Number between 0 and 9999
 * @returns Space-separated class names for the SVG element
 */

const BASE_CLASS = "z0000";
export const MIN_NUMBER = 0;
export const MAX_NUMBER = 9999;

export const getRunicClasses = (num: number): string => {
  if (num < MIN_NUMBER || num > MAX_NUMBER) {
    throw new Error(`Number must be between ${MIN_NUMBER} and ${MAX_NUMBER}`);
  }

  if (num === MIN_NUMBER) {
    return BASE_CLASS;
  }

  // Pad to 4 digits and split into array [thousands, hundreds, tens, ones]
  const digits = num.toString().padStart(4, "0").split("");
  const classes: string[] = [BASE_CLASS];

  // Map each digit to its position class
  digits.forEach((digit, index) => {
    if (digit !== "0") {
      const positions = ["000", "00", "0", ""]; // thousands, hundreds, tens, ones
      classes.push(`z${digit}${positions[index]}`);
    }
  });

  return classes.join(" ");
};

/**
 * Generates the SVG path data for runic numerals
 * Returns an array of path objects with their respective classes
 */
export const getRunicPaths = () => {
  return {
    // Center vertical line (always visible)
    centralLine: "M19.8 0v58.8",

    // Ones (top-right quadrant)
    ones: [
      { classes: "c1 c5 c7 c9", d: "M19.8 0h18.7" }, // horizontal top
      { classes: "c2 c8 c9", d: "M38.5 19.4H19.8" }, // horizontal mid
      { classes: "c3", d: "M19.8 0l18.7 19.4" }, // diagonal down
      { classes: "c4 c5", d: "M19.8 19.4l18.7-19.4" }, // diagonal up
      { classes: "c6 c7 c8 c9", d: "M38.5 0v19.4" }, // vertical right
    ],

    // Tens (top-left quadrant)
    tens: [
      { classes: "t1 t5 t7 t9", d: "M19.8 0H1.1" }, // horizontal top
      { classes: "t2 t8 t9", d: "M1.1 19.4h18.7" }, // horizontal mid
      { classes: "t3", d: "M19.8 0L1.1 19.4" }, // diagonal down
      { classes: "t4 t5", d: "M19.8 19.4L1.1 0" }, // diagonal up
      { classes: "t6 t7 t8 t9", d: "M1.1 0v19.4" }, // vertical left
    ],

    // Hundreds (bottom-right quadrant)
    hundreds: [
      { classes: "h1 h5 h7 h9", d: "M19.8 58.8h18.7" }, // horizontal bottom
      { classes: "h2 h8 h9", d: "M38.5 39.4H19.8" }, // horizontal mid
      { classes: "h3", d: "M19.8 58.8l18.7-19.4" }, // diagonal up
      { classes: "h4 h5", d: "M19.8 39.4l18.7 19.4" }, // diagonal down
      { classes: "h6 h7 h8 h9", d: "M38.5 58.8V39.4" }, // vertical right
    ],

    // Thousands (bottom-left quadrant)
    thousands: [
      { classes: "d1 d5 d7 d9", d: "M19.8 58.8H1.1" }, // horizontal bottom
      { classes: "d2 d8 d9", d: "M1.1 39.4h18.7" }, // horizontal mid
      { classes: "d3", d: "M19.8 58.8L1.1 39.4" }, // diagonal up
      { classes: "d4 d5", d: "M19.8 39.4L1.1 58.8" }, // diagonal down
      { classes: "d6 d7 d8 d9", d: "M1.1 58.8V39.4" }, // vertical left
    ],
  };
};
