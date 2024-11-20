import { contentType } from "jsr:@std/media-types/content-type";

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  let path = url.pathname;
  if (path == "/") {
    path = "index.html";
  }
  // type of file
  const pathExtention = path.split(".")[1];
  const type = contentType(pathExtention)!;

  const file = Deno.readFileSync(`./out/${path}`);

  return new Response(file, {
    headers: {
      "Content-Type": type,
    },
  });
});
