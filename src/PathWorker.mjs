import fs from 'fs/promises';
import path from 'path';
import {
  PATH_ERROR_CODES,
  PATH_ERROR_MESSAGES,
  PathWorkerError,
} from './Navigator/PathWorkerError.mjs';

export class PathWorker {
  #workingDirectory;

  #homeDirectory;

  constructor(homeDirectory) {
    this.#workingDirectory = homeDirectory;
    this.#homeDirectory = homeDirectory;
  }

  async getPath(pathTo) {
    await this.isValidPath(pathTo);
    return this.#getAbsolutePath(pathTo);
  }

  async isValidPath(pathTo) {
    const newPath = this.#getAbsolutePath(pathTo);

    if (!newPath.startsWith(this.#homeDirectory)) {
      throw new PathWorkerError(
        PATH_ERROR_CODES.PATH_OUTSIDE_HOME_DIRECTORY,
        PATH_ERROR_MESSAGES.PATH_OUTSIDE_HOME_DIRECTORY,
      );
    }

    return fs
      .access(newPath)
      .then(() => true)
      .catch(() => {
        throw new PathWorkerError(
          PATH_ERROR_CODES.NON_EXIST_PATH,
          PATH_ERROR_MESSAGES.NON_EXIST_PATH,
        );
      });
  }

  async isValidFile(pathToFile) {
    const absolutePath = await this.getPath(pathToFile);
    const status = await fs.lstat(absolutePath);

    if (!status.isFile()) {
      throw new PathWorkerError(
        PATH_ERROR_CODES.NON_EXIST_FILE,
        PATH_ERROR_MESSAGES.NON_EXIST_FILE,
      );
    }
    return true;
  }

  async isValidDirectory(pathToDirectory) {
    const absolutePath = await this.getPath(pathToDirectory);
    const status = await fs.lstat(absolutePath);

    if (!status.isDirectory()) {
      throw new PathWorkerError(
        PATH_ERROR_CODES.NON_EXIST_DIRECTORY,
        PATH_ERROR_MESSAGES.NON_EXIST_DIRECTORY,
      );
    }
    return true;
  }

  #getAbsolutePath(pathToDirectory) {
    return path.isAbsolute(pathToDirectory)
      ? path.resolve(pathToDirectory)
      : path.resolve(this.#workingDirectory, pathToDirectory);
  }

  get workingDirectory() {
    return this.#workingDirectory;
  }

  set workingDirectory(pathToDirectory) {
    this.#workingDirectory = pathToDirectory;
  }
}
