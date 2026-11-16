import fs from "node:fs";
import path from "node:path";

const source = path.join("static", "404.html");
const target = path.join("out", "404.html");

if (!fs.existsSync(source)) {
  throw new Error(`Missing ${source}`);
}
if (!fs.existsSync(path.join("out", "index.html")) && !fs.existsSync(path.join("out", "_next"))) {
  throw new Error("The static export does not exist. Run `next build` first.");
}

fs.copyFileSync(source, target);
console.log("postbuild: branded 404 page copied to out/404.html");
