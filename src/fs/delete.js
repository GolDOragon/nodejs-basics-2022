import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that deletes file `fileToRemove.txt` (if there's no file
 * `fileToRemove.txt` Error with message `FS operation failed` must be thrown)
 */
export const remove = async () => {
  await fs
    .rm(path.resolve(__dirname, "files", "fileToRemove.txt"))
    .catch(() => {
      throw Error("FS operation failed");
    });
};
