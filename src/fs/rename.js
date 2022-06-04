import fs from "fs/promises";
import { constants } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_EXISTS = "FILE_EXISTS";
const FILE_NOT_EXIST = "FILE_NOT_EXIST";

const getFileStatus = (path, mode) =>
  fs
    .access(path, mode)
    .then(() => FILE_EXISTS)
    .catch(() => FILE_NOT_EXIST);

/**
 *  implement function that renames file `wrongFilename.txt` to
 *  `properFilename` with extension .md (if there's no file
 *  wrongFilename.txt or properFilename.md already exists Error with
 *  message `FS operation failed` must be thrown)
 */
export const rename = async () => {
  const oldFilePath = path.resolve(__dirname, "files", "wrongFilename.txt");
  const newFilePath = path.resolve(__dirname, "files", "properFilename.md");

  const [oldFileStatus, newFileStatus] = await Promise.all([
    getFileStatus(oldFilePath, constants.R_OK),
    getFileStatus(newFilePath, constants.R_OK),
  ]);

  if (oldFileStatus === FILE_NOT_EXIST || newFileStatus === FILE_EXISTS) {
    throw Error("FS operation failed");
  }

  await fs.rename(oldFilePath, newFilePath)
};
