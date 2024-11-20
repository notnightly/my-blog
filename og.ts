import { CanvasRenderingContext2D, createCanvas } from "jsr:@gfx/canvas@0.5.6";
import { shortAttr } from "./build.ts";
const canvas = createCanvas(1200, 630);
function getLines(
  ctx: CanvasRenderingContext2D,
  phrase: string,
  maxPxLength: number,
  textStyle: string,
): string[] {
  const wa = phrase.split(" ");
  const phraseArray = [];
  let lastPhrase = wa[0];
  let measure = 0;
  const splitChar = " ";
  if (wa.length <= 1) {
    return wa;
  }
  ctx.font = textStyle;
  for (let i = 1; i < wa.length; i++) {
    const w = wa[i];
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
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  // put text on the canvas it can be how many words
  ctx.font = "bold 100px sans-serif";
  for (const [index, value] of shortAttr.entries()) {
    const lines = getLines(ctx, value, 1200, "bold 70px sans-serif");

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
    console.log(`Image Generated: ${index}.png`);
  }
}
