import { createReadStream, createWriteStream } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import { createUnzip } from "zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that decompresses `archive.gz` back to the `fileToCompress.txt`
 * with same content as before compression using zlib and Streams API
 */
export const decompress = async () => {
  const archivePath = path.resolve(__dirname, "files", "archive.gz");
  const filePath = path.resolve(__dirname, "files", "fileToCompress.txt");

  const inputStream = createReadStream(archivePath);
  const unzipStream = createUnzip();
  const outputStream = createWriteStream(filePath);

  pipeline(inputStream, unzipStream, outputStream).catch((err) =>
    console.log(err)
  );
};
