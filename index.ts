import { render, Renderer } from "@deno/gfm";
import handlerbars from "npm:handlebars";
import { extractYaml, test } from "jsr:@std/front-matter";

const index = Deno.readTextFileSync("./index.html");
const cssPath = Deno.readTextFileSync("./new.css");

const markdowns: Array<string> = [];

const template = handlerbars.compile(index);

for (const dirEntry of Deno.readDirSync("./posts")) {
  markdowns.push(dirEntry.name);
}

// console.log(markdowns);

Deno.serve((req: Request): Response | Promise<Response> => {
  const url = new URL(req.url);
  if (url.pathname == "/new.css") {
    return new Response(cssPath, {
      headers: {
        "Content-Type": "text/css",
      },
    });
  }
  for (const md of markdowns) {
    const markdown = Deno.readTextFileSync(`./posts/${md}`);
    const { attrs, body } = extractYaml(markdown);
    const b = render(body);

    const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
            <style>
                ${cssPath}
            </style>
            </head>
            <body>
            <main data-color-mode="dark" data-dark-theme="dark" class="markdown-body">
                <header><h1>${attrs.title}</h1></header>
                ${b}
            </main>
            </body>
            <script>

            </script>
        </html>
        `;
    if (url.pathname == `/${md}`) {
      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
  }

  let toc = [];
  for (const dirEntry of Deno.readDirSync("./posts")) {
    const file = Deno.readTextFileSync(`./posts/${dirEntry.name}`);
    const header = extractYaml(file);
    toc.push({
      filename: dirEntry.name,
      ...header.attrs,
    });
  }

  return new Response(
    template({
      htmlMd: toc,
      cssPath,
    }),
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
});
