import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { Logger } from '../Logger.mjs';
import {
  NAVIGATION_ERROR_CODES,
  NAVIGATION_ERROR_MESSAGES,
  NavigationError,
} from './NavigationError.mjs';

export class Navigator {
  #workingDirectory;

  #homeDirectory;

  #logger;

  constructor() {
    this.#workingDirectory = os.homedir();
    this.#homeDirectory = os.homedir();
    this.#logger = new Logger();
  }

  /**
   * Go upper from current directory (when you are in the root folder this operation shouldn't
   * change working directory)
   */
  async up() {
    try {
      const newPath = path.resolve(this.#workingDirectory, '..');
      await this.#isValidPath(newPath);

      this.#workingDirectory = newPath;
    } catch (err) {
      if (err.code !== NAVIGATION_ERROR_CODES.PATH_OUTSIDE_HOME_DIRECTORY) {
        throw err;
      }

      this.#logger.showMessage('You already on the top!');
    }

    this.#showWorkingDirectory();
  }

  /**
   * List all files and folder in current directory and print it to console
   */
  async ls() {
    const files = await fs.readdir(this.#workingDirectory);
    files.forEach(this.#logger.showMessage);

    this.#showWorkingDirectory();
  }

  /**
   * Go to dedicated folder from current directory
   * @param {string} pathToDirectory - path to directory, can be relative or absolute
   */
  async cd(pathToDirectory) {
    await this.#isValidPath(pathToDirectory);
    this.#workingDirectory = this.#getPath(pathToDirectory);

    this.#showWorkingDirectory();
  }

  async #isValidPath(pathToDirectory) {
    const newPath = this.#getPath(pathToDirectory);

    if (!newPath.startsWith(this.#homeDirectory)) {
      throw new NavigationError(
        NAVIGATION_ERROR_CODES.PATH_OUTSIDE_HOME_DIRECTORY,
        NAVIGATION_ERROR_MESSAGES.PATH_OUTSIDE_HOME_DIRECTORY,
      );
    }

    return fs
      .access(newPath)
      .then(() => true)
      .catch(() => {
        throw new NavigationError(
          NAVIGATION_ERROR_CODES.NON_EXIST_DIRECTORY,
          NAVIGATION_ERROR_MESSAGES.NON_EXIST_DIRECTORY,
        );
      });
  }

  #getPath(pathToDirectory) {
    return path.isAbsolute(pathToDirectory)
      ? path.resolve(pathToDirectory)
      : path.resolve(this.#workingDirectory, pathToDirectory);
  }

  #showWorkingDirectory() {
    this.#logger.showMessage(`You are currently in ${this.#workingDirectory}`);
  }
}
