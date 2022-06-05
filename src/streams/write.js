import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 *  implement function that writes process.stdin data into file `fileToWrite.txt` content using Writable Stream
 */
export const write = async () => {
  const filePath = path.resolve(__dirname, "files", "fileToWrite.txt");

  const output = createWriteStream(filePath, { flags: "a+" });

  process.stdin.pipe(output);
};
