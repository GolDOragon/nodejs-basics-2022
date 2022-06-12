import fs from 'fs/promises';
import { Logger } from '../Logger.mjs';
import { PathWorkerError } from './PathWorkerError.mjs';
import { PathWorker } from '../PathWorker.mjs';

export class Navigator extends PathWorker {
  #logger;

  constructor(homedir) {
    super(homedir);
    this.#logger = new Logger();
  }

  /**
   * Go upper from current directory (when you are in the root folder this operation shouldn't
   * change working directory)
   */
  async up() {
    try {
      this.workingDirectory = await this.getPath('..');
    } catch (err) {
      if (!(err instanceof PathWorkerError)) {
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
    const files = await fs.readdir(this.workingDirectory);
    this.#logger.showMessage(...files);
    this.#showWorkingDirectory();
  }

  /**
   * Go to dedicated folder from current directory
   * @param {string} pathToDirectory - path to directory, can be relative or absolute
   */
  async cd(pathToDirectory) {
    await this.isValidDirectory(pathToDirectory);
    this.workingDirectory = await this.getPath(pathToDirectory);

    this.#showWorkingDirectory();
  }

  #showWorkingDirectory() {
    this.#logger.showMessage(`You are currently in ${this.workingDirectory}`);
  }
}
