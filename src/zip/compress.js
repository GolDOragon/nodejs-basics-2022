import { createReadStream, createWriteStream } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import { createGzip } from "zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that compresses file `fileToCompress.txt` to `archive.gz`
 * using `zlib` and Streams API
 */
export const compress = async () => {
  const filePath = path.resolve(__dirname, "files", "fileToCompress.txt");
  const archivePath = path.resolve(__dirname, "files", "archive.gz");

  const inputStream = createReadStream(filePath);
  const zipStream = createGzip();
  const outputStream = createWriteStream(archivePath);

  pipeline(inputStream, zipStream, outputStream).catch((err) =>
    console.log(err)
  );
};
