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

  get workingDirectory() {
    return this.#workingDirectory;
  }

  set workingDirectory(pathToDirectory) {
    this.#isPathInsideHomeDir(pathToDirectory);
    this.#workingDirectory = pathToDirectory;
  }

  getPath(pathTo) {
    this.#isPathInsideHomeDir(pathTo);
    return this.#getAbsolutePath(pathTo);
  }

  async isValidFile(pathTo) {
    const filePath = this.#getAbsolutePath(pathTo);
    this.#isPathInsideHomeDir(filePath);
    await this.#isPathExist(filePath);

    const status = await fs.lstat(filePath);
    if (!status.isFile()) {
      throw new PathWorkerError(
        PATH_ERROR_CODES.NON_EXIST_FILE,
        PATH_ERROR_MESSAGES.NON_EXIST_FILE,
      );
    }
    return true;
  }

  async isValidDirectory(pathTo) {
    const directoryPath = this.#getAbsolutePath(pathTo);
    this.#isPathInsideHomeDir(directoryPath);
    await this.#isPathExist(directoryPath);

    const status = await fs.lstat(directoryPath);
    if (!status.isDirectory()) {
      throw new PathWorkerError(
        PATH_ERROR_CODES.NON_EXIST_DIRECTORY,
        PATH_ERROR_MESSAGES.NON_EXIST_DIRECTORY,
      );
    }
    return true;
  }

  #isPathInsideHomeDir(pathTo) {
    const newPath = this.#getAbsolutePath(pathTo);

    if (!newPath.startsWith(this.#homeDirectory)) {
      throw new PathWorkerError(
        PATH_ERROR_CODES.PATH_OUTSIDE_HOME_DIRECTORY,
        PATH_ERROR_MESSAGES.PATH_OUTSIDE_HOME_DIRECTORY,
      );
    }

    return true;
  }

  #getAbsolutePath(pathTo) {
    return path.isAbsolute(pathTo) ? pathTo : path.resolve(this.#workingDirectory, pathTo);
  }

  #isPathExist(pathTo) {
    const newPath = this.#getAbsolutePath(pathTo);

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
}
