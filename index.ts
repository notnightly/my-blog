import { contentType } from "jsr:@std/media-types/content-type";

const contentTypeCache = {};
const fileCache = {};

function readFile(path) {
  if (fileCache[path]) {
    return fileCache[path];
  }

  const file = Deno.readTextFileSync(path);
  fileCache[path] = file;
  return file;
}

function contentTypeOrCache(extension) {
  if (contentTypeCache[extension]) {
    return contentTypeCache[extension];
  }

  const type = contentType(extension);
  contentTypeCache[extension] = type;
  return type;
}

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  let path = url.pathname;
  if (path == "/") {
    path = "index.html";
  }

  const file = readFile(`./out/${path}`);

  const extension = path.split(".").pop();
  const type = contentTypeOrCache(extension);

  return new Response(file, {
    headers: {
      "Content-Type": type,
    },
  });
});
