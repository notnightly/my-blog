import { contentType } from "jsr:@std/media-types/content-type";

const contentTypeCache: Record<string, string> = {};
const fileCache: Record<string, string> = {};

function readFile(path: string) {
  if (fileCache[path]) {
    return fileCache[path];
  }

  const file = Deno.readTextFileSync(path);
  fileCache[path] = file;
  return file;
}

function contentTypeOrCache(extension: string): string {
  if (contentTypeCache[extension]) {
    return contentTypeCache[extension];
  }

  const type = contentType(extension);
  contentTypeCache[extension] = type || "text/html";
  return contentTypeCache[extension];
}

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  let path = url.pathname;
  if (path == "/") {
    path = "index.html";
  }

  const file = readFile(`./out/${path}`);

  const extension = path.split(".").pop();
  const type = contentTypeOrCache(extension!);

  return new Response(file, {
    headers: {
      "Content-Type": type,
    },
  });
});
