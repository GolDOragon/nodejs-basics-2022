/**
 * rewrite it to it's equivalent in ECMAScript notation (and switch extension to .mjs)
 */
import { createServer as createServerHttp } from "http";
import { release, version } from "os";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import "./files/c.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const random = Math.random();
const filePath = path.resolve(
  __dirname,
  "files",
  random > 0.5 ? "a.json" : "b.json"
);

export const unknownObject = await fs
  .readFile(filePath, "utf-8")
  .then(JSON.parse);

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${path.sep}"`);

console.log(`Path to current file is ${__filename}`);
console.log(`Path to current directory is ${__dirname}`);

export const createMyServer = createServerHttp((_, res) => {
  res.end("Request accepted");
});
