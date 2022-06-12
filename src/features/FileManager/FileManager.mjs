import { constants, createReadStream, createWriteStream } from 'fs';
import fs from 'fs/promises';
import { Logger } from '../../utils/Logger.mjs';
import {
  FILE_OPERATION_ERROR_CODES,
  FILE_OPERATION_ERROR_MESSAGES,
  FileManagerError,
} from './FileManagerError.mjs';
import {
  DIRECTORY_NOT_EXISTS,
  FILE_EXISTS,
  FILE_NOT_EXIST,
  PathWorker,
} from '../../utils/PathWorker.mjs';
import { getFilename } from '../../utils/getFilename.mjs';

export class FileManager {
  #pathWorker;

  #logger;

  constructor(homedir) {
    this.#pathWorker = new PathWorker(homedir);
    this.#logger = new Logger();
  }

  async readFile(workingDirectory, pathToFile) {
    const absolutePath = this.#getAbsolutePath(workingDirectory, pathToFile);
    await this.#pathWorker.isValidFile(absolutePath);

    const input = createReadStream(absolutePath, { encoding: 'utf-8' });

    input.on('readable', () => {
      const data = input.read();
      if (data) {
        this.#logger.showMessage(this.#logger.BgWhite + this.#logger.FgBlack + data);
      }
    });
  }

  async createEmptyFile(workingDirectory, fileName) {
    const absolutePath = this.#getAbsolutePath(workingDirectory, fileName);
    const status = await this.#pathWorker.getFileStatus(absolutePath, constants.W_OK);

    if (status === FILE_EXISTS) {
      throw new FileManagerError(
        FILE_OPERATION_ERROR_CODES.FILE_ALREADY_EXISTS,
        FILE_OPERATION_ERROR_MESSAGES.FILE_ALREADY_EXISTS,
      );
    }

    await createWriteStream(absolutePath).on('open', () => {
      this.#logger.showMessage(
        `${this.#logger.FgGreen}The file was created. You can find it in`,
        `${this.#logger.FgBlue}${absolutePath}`,
      );
    });
  }

  async renameFile(workingDirectory, oldName, newName) {
    const oldFilePath = this.#getAbsolutePath(workingDirectory, oldName);
    const newFilePath = this.#getAbsolutePath(workingDirectory, newName);

    const [oldFileStatus, newFileStatus] = await Promise.all([
      this.#pathWorker.getFileStatus(oldFilePath, constants.R_OK),
      this.#pathWorker.getFileStatus(newFilePath, constants.R_OK),
    ]);

    if (oldFileStatus === FILE_NOT_EXIST) {
      throw new FileManagerError(
        FILE_OPERATION_ERROR_CODES.FILE_NOT_EXIST,
        FILE_OPERATION_ERROR_MESSAGES.FILE_NOT_EXIST,
      );
    }
    if (newFileStatus === FILE_EXISTS) {
      throw new FileManagerError(
        FILE_OPERATION_ERROR_CODES.FILE_ALREADY_EXISTS,
        FILE_OPERATION_ERROR_MESSAGES.FILE_ALREADY_EXISTS,
      );
    }

    await fs.rename(oldFilePath, newFilePath);

    this.#logger.showMessage(`${this.#logger.FgGreen}File was renamed.`);
  }

  async copyFile(workingDirectory, originalFile, directory) {
    const originalPath = this.#getAbsolutePath(workingDirectory, originalFile);
    const copyDirectory = this.#getAbsolutePath(workingDirectory, directory);
    const copyPath = `${copyDirectory}/${getFilename(originalFile)}`;

    const [originalFileStatus, directoryStatus, copyFileStatus] = await Promise.all([
      this.#pathWorker.getFileStatus(originalPath, constants.R_OK),
      this.#pathWorker.getDirectoryStatus(copyDirectory),
      this.#pathWorker.getFileStatus(copyPath, constants.R_OK),
    ]);

    if (originalFileStatus === FILE_NOT_EXIST) {
      throw new FileManagerError(
        FILE_OPERATION_ERROR_CODES.FILE_NOT_EXIST,
        FILE_OPERATION_ERROR_MESSAGES.FILE_NOT_EXIST,
      );
    }
    if (directoryStatus === DIRECTORY_NOT_EXISTS) {
      throw new FileManagerError(
        FILE_OPERATION_ERROR_CODES.DIRECTORY_NOT_EXIST,
        FILE_OPERATION_ERROR_MESSAGES.DIRECTORY_NOT_EXIST,
      );
    }
    if (copyFileStatus === FILE_EXISTS) {
      throw new FileManagerError(
        FILE_OPERATION_ERROR_CODES.FILE_ALREADY_EXISTS,
        FILE_OPERATION_ERROR_MESSAGES.FILE_ALREADY_EXISTS,
      );
    }

    await fs.cp(originalPath, copyPath);
  }

  async moveFile(workingDirectory, originalFile, directory) {
    await this.copyFile(workingDirectory, originalFile, directory);
    await this.deleteFile(workingDirectory, originalFile);
  }

  async deleteFile(workingDirectory, fileName) {
    const absolutePath = this.#getAbsolutePath(workingDirectory, fileName);
    const status = await this.#pathWorker.getFileStatus(absolutePath);

    if (status === FILE_NOT_EXIST) {
      throw new FileManagerError(
        FILE_OPERATION_ERROR_CODES.FILE_NOT_EXIST,
        FILE_OPERATION_ERROR_MESSAGES.FILE_NOT_EXIST,
      );
    }

    await fs.rm(absolutePath);

    this.#logger.showMessage(`${this.#logger.FgGreen}File was deleted`);
  }

  #getAbsolutePath(workingDirectory, pathFile) {
    this.#pathWorker.workingDirectory = workingDirectory;
    return this.#pathWorker.getPath(pathFile);
  }
}
