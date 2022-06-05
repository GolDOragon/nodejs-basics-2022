import fs from "fs/promises";
import { constants } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_EXISTS = "FILE_EXISTS";
const FILE_NOT_EXIST = "FILE_NOT_EXIST";

/**
 * implement function that creates new file `fresh.txt` with content `I am fresh and young`
 * inside of the `files` folder (if file already exists `Error` with message `FS operation failed` must be thrown)
 */
export const create = async () => {
  const filePath = path.resolve(__dirname, "files", "fresh.txt");

  const status = await fs
    .access(filePath, constants.W_OK)
    .then(() => FILE_EXISTS)
    .catch(() => FILE_NOT_EXIST);

  if (status === FILE_EXISTS) {
    throw Error("FS operation failed");
  }

  await fs.writeFile(filePath, "I am fresh and young");
};
