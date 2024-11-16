import { insertNotes } from "./database/database.ts";
import { CSS, render } from "@deno/gfm";
let markdowns = [];
for (const dirEntry of Deno.readDirSync("./notes")) {
    markdowns.push(dirEntry.name);
}
// const markdowns = for (let i=0; ) {
console.log(markdowns);

// markdowns.forEach((md) => {
// });

const cssPath = Deno.readTextFileSync("./new.css");

Deno.serve((req: Request): Response | Promise<Response> => {
    const url = new URL(req.url);
    for (const md of markdowns) {
        const markdown = Deno.readTextFileSync(`./notes/${md}`);
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
            console.log(html);
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
    }
    return new Response("Something going wrong dude");
});
