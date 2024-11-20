import { contentType } from "jsr:@std/media-types/content-type";

function readFile(path: string) {
  const file = Deno.readTextFileSync(path);
  return file;
}
function contentType(path: string) {
  if (path.endsWith(".html")) {
    return "text/html";
  } else if (path.endsWith(".css")) {
    return "text/css";
  } else if (path.endsWith(".js")) {
    return "text/javascript";
  } else {
    return "text/plain";
  }
}
Deno.serve((req: Request) => {
  const url = new URL(req.url);
  let path = url.pathname;
  if (path == "/") {
    path = "index.html";
  }
  // type of file
  const type = contentType(path);
  const file = readFile(`./out/${path}`);

  return new Response(file, {
    headers: {
      "Content-Type": type,
    },
  });
});
