import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that prints content of the `fileToRead.txt` into console (if there's no file
 * `fileToRead.txt` Error with message `FS operation failed` must be thrown)
 */
export const read = async () => {
  try {
    const file = await fs.readFile(
      path.resolve(__dirname, "files", "fileToRead.txt"),
      { encoding: "utf-8" }
    );
    console.log(file);
  } catch {
    throw Error("FS operation failed");
  }
};
