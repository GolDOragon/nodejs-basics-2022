import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that prints all array of filenames from `files` folder into console (if files
 * folder doesn't exists Error with message `FS operation failed` must be thrown)
 */
export const list = async () => {
  try {
    const folderPath = path.resolve(__dirname, "files");

    const files = await fs.readdir(folderPath);
    console.log(files);
  } catch {
    throw Error("FS operation failed");
  }
};
