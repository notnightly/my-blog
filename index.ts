import { render } from "@deno/gfm";
import handlerbars from "npm:handlebars";

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
  for (const md of markdowns) {
    const markdown = Deno.readTextFileSync(`./posts/${md}`);
    const body = render(markdown);
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
                ${body}
            </main>
            </body>
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
  const htmlMd = [];
  for (const md of markdowns) {
    htmlMd.push(`${md.slice(0, -3)}`);
  }
  return new Response(
    template({
      htmlMd,
    }),
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
});
