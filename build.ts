import handlerbars from "npm:handlebars";
import { render } from "@deno/gfm";
import { extractYaml } from "jsr:@std/front-matter";

const domain = "https://nightly-blog.deno.dev";
const index = Deno.readTextFileSync("./index.html");
const cssPath = Deno.readTextFileSync("./new.css");

const template = handlerbars.compile(index);

const markdowns: Array<string> = [];
const toc = [];

for (const dirEntry of Deno.readDirSync("./posts")) {
  markdowns.push(dirEntry.name);

  const file = Deno.readTextFileSync(`./posts/${dirEntry.name}`);
  const header = extractYaml(file);
  toc.push({
    filename: dirEntry.name.replace(".md", ".html"),
    //@ts-ignore Yolo
    ...header.attrs,
  });
}

for (const md of markdowns) {
  const markdown = Deno.readTextFileSync(`./posts/${md}`);
  const { attrs, body } = extractYaml(markdown);
  const b = render(body);
  // deno-lint-ignore no-explicit-any
  const attribute = (attrs as any).title;
  // make the b have first 15 words then add ... to it
  const shortB = b.split(" ").slice(0, 15).join(" ") + "...";
  const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
            <meta property="og:title" content="${attribute}" />
            <meta property="og:type" content="website" />
            <meta property="og:description" content="${shortB}" />
            <meta property="og:url" content="${domain}" />
            <style>
                ${cssPath}
            </style>
            </head>
            <body>
            <main data-color-mode="dark" data-dark-theme="dark" class="markdown-body">
                <header><h1>${attribute}</h1></header>
                ${b}
            </main>
            </body>
            <script>

            </script>
        </html>
        `;

  const extensionLess = md.split(".")[0];
  Deno.writeTextFileSync(`./out/${extensionLess}.html`, html);
}

const indexHtml = template({
  htmlMd: toc,
  cssPath,
});

Deno.writeTextFileSync("./out/index.html", indexHtml);
Deno.copyFileSync("./new.css", "./out/new.css");
