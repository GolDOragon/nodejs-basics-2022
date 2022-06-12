import { constants, createReadStream, createWriteStream } from 'fs';
import path from 'path';
import fs from 'fs/promises';
import { PathWorker } from '../PathWorker.mjs';
import { Logger } from '../Logger.mjs';
import {
  FILE_OPERATION_ERROR_CODES,
  FILE_OPERATION_ERROR_MESSAGES,
  FileOperationError,
} from './FileOperationError.mjs';

const FILE_EXISTS = 'FILE_EXISTS';
const FILE_NOT_EXIST = 'FILE_NOT_EXIST';

export class FileOperator {
  #pathWorker;

  constructor(homedir) {
    this.#pathWorker = new PathWorker(homedir);
    this.logger = new Logger();
  }

  async readFile(workingDirectory, pathToFile) {
    const absolutePath = this.#getAbsolutePath(workingDirectory, pathToFile);
    await this.#pathWorker.isValidFile(absolutePath);

    const input = createReadStream(absolutePath);

    input.on('readable', () => {
      const data = input.read();
      if (data) {
        this.logger.showMessage(data);
      }
    });
  }

  async createEmptyFile(workingDirectory, fileName) {
    const absolutePath = this.#getAbsolutePath(workingDirectory, fileName);
    const status = await this.#getFileStatus(absolutePath, constants.W_OK);

    if (status === FILE_EXISTS) {
      throw new FileOperationError(
        FILE_OPERATION_ERROR_CODES.FILE_ALREADY_EXISTS,
        FILE_OPERATION_ERROR_MESSAGES.FILE_ALREADY_EXISTS,
      );
    }

    await createWriteStream(absolutePath).on('open', () => {
      this.logger.showMessage(
        'The file was created. You can find it in',
        `${this.logger.FgBlue}${absolutePath}`,
      );
    });
  }

  async renameFile(workingDirectory, oldName, newName) {
    const oldFilePath = this.#getAbsolutePath(workingDirectory, oldName);
    const newFilePath = this.#getAbsolutePath(workingDirectory, newName);

    const [oldFileStatus, newFileStatus] = await Promise.all([
      this.#getFileStatus(oldFilePath, constants.R_OK),
      this.#getFileStatus(newFilePath, constants.R_OK),
    ]);

    if (oldFileStatus === FILE_NOT_EXIST) {
      throw new FileOperationError(
        FILE_OPERATION_ERROR_CODES.FILE_NOT_EXIST,
        FILE_OPERATION_ERROR_MESSAGES.FILE_NOT_EXIST,
      );
    }
    if (newFileStatus === FILE_EXISTS) {
      throw new FileOperationError(
        FILE_OPERATION_ERROR_CODES.FILE_ALREADY_EXISTS,
        FILE_OPERATION_ERROR_MESSAGES.FILE_ALREADY_EXISTS,
      );
    }

    await fs.rename(oldFilePath, newFilePath);
  }

  async copyFile(workingDirectory, originalFile, directory) {
    const originalPath = this.#getAbsolutePath(workingDirectory, originalFile);
    const copyPath = this.#getAbsolutePath(workingDirectory, directory);

    const [originalFileStatus, copyFileStatus] = await Promise.all([
      this.#getFileStatus(originalPath, constants.R_OK),
      this.#getFileStatus(copyPath, constants.R_OK),
    ]);

    if (originalFileStatus === FILE_NOT_EXIST) {
      throw new FileOperationError(
        FILE_OPERATION_ERROR_CODES.FILE_NOT_EXIST,
        FILE_OPERATION_ERROR_MESSAGES.FILE_NOT_EXIST,
      );
    }
    if (copyFileStatus === FILE_EXISTS) {
      throw new FileOperationError(
        FILE_OPERATION_ERROR_CODES.FILE_ALREADY_EXISTS,
        FILE_OPERATION_ERROR_MESSAGES.FILE_ALREADY_EXISTS,
      );
    }

    await fs.cp(originalPath, copyPath);
  }

  async moveFile(workingDirectory, originalFile, copyFile) {
    await this.copyFile(workingDirectory, originalFile, copyFile);
    await this.deleteFile(workingDirectory, originalFile);
  }

  async deleteFile(workingDirectory, fileName) {
    const absolutePath = this.#getAbsolutePath(workingDirectory, fileName);
    const status = await this.#getFileStatus(absolutePath);

    if (status === FILE_NOT_EXIST) {
      throw new FileOperationError(
        FILE_OPERATION_ERROR_CODES.FILE_NOT_EXIST,
        FILE_OPERATION_ERROR_MESSAGES.FILE_NOT_EXIST,
      );
    }

    await fs.rm(absolutePath);

    this.logger.showMessage('File was deleted');
  }

  #getAbsolutePath(workingDirectory, pathFile) {
    return path.isAbsolute(pathFile) ? pathFile : path.resolve(workingDirectory, pathFile);
  }

  #getFileStatus(filePath, mode) {
    return fs
      .access(filePath, mode)
      .then(() => FILE_EXISTS)
      .catch(() => FILE_NOT_EXIST);
  }
}
