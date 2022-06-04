import fs from "fs/promises";
import { constants } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FOLDER_EXISTS = "FOLDER_EXISTS";
const FOLDER_NOT_EXISTS = "FOLDER_NOT_EXISTS";

const getFolderStatus = (path, accessType) =>
  fs
    .access(path, accessType)
    .then(() => FOLDER_EXISTS)
    .catch(() => FOLDER_NOT_EXISTS);

/**
 *  implement function that copies folder files files with all its content into
 *  folder `files_copy` at the same level (if files folder doesn't exists or
 *  `files_copy` has already been created Error with message
 *  `FS operation failed` must be thrown)
 */
export const copy = async () => {
  const folderPath = path.resolve(__dirname, "files");
  const copyFolderPath = path.resolve(__dirname, "files_copy");

  const [originalFolderStatus, copyFolderStatus] = await Promise.all([
    getFolderStatus(folderPath, constants.R_OK),
    getFolderStatus(copyFolderPath, constants.R_OK),
  ]);

  if (
    originalFolderStatus === FOLDER_NOT_EXISTS ||
    copyFolderStatus === FOLDER_EXISTS
  ) {
    throw Error("FS operation failed");
  }

  await fs.cp(folderPath, copyFolderPath, { recursive: true });
};
