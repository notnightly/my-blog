import { createCanvas } from "jsr:@gfx/canvas@0.5.6";
import { shortAttr } from "./build.ts";
//recommneded size for Og image
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext("2d");
function getLines(phrase, maxPxLength, textStyle) {
  let wa = phrase.split(" "),
    phraseArray = [],
    lastPhrase = wa[0],
    measure = 0,
    splitChar = " ";
  if (wa.length <= 1) {
    return wa;
  }
  ctx.font = textStyle;
  for (let i = 1; i < wa.length; i++) {
    let w = wa[i];
    measure = ctx.measureText(lastPhrase + splitChar + w).width;
    if (measure < maxPxLength) {
      lastPhrase += splitChar + w;
    } else {
      phraseArray.push(lastPhrase);
      lastPhrase = w;
    }
    if (i === wa.length - 1) {
      phraseArray.push(lastPhrase);
      break;
    }
  }
  return phraseArray;
}
export default function ogImageGenerator() {
  // create a black background
  ctx.fillStyle = "white";
  // put text on the canvas it can be how many words
  ctx.font = "bold 100px sans-serif";
  for (const [index, value] of shortAttr.entries()) {
    const lines = getLines(value, 1200, "bold 70px sans-serif");
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < lines.length; i++) {
      ctx.fillStyle = "#292B2F";
      ctx.fillText(lines[i], 50, 100 + 100 * (i + 1));
    }
    // add author name
    ctx.fillStyle = "#292B2F";
    ctx.font = "bold 35px sans-serif";
    ctx.fillText("by Nightly", 50, 500);

    canvas.save(`./out/${index}.png`);
  }
}
