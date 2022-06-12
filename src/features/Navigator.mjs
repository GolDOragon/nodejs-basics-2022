import fs from 'fs/promises';
import { Logger } from '../utils/Logger.mjs';
import { PathWorkerError } from '../utils/PathWorkerError.mjs';
import { PathWorker } from '../utils/PathWorker.mjs';

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
      this.workingDirectory = this.getPath('..');
    } catch (err) {
      if (err instanceof PathWorkerError) {
        this.#logger.showMessage('You already on the top!');
      } else {
        throw err;
      }
    }
  }

  /**
   * List all files and folder in current directory and print it to console
   */
  async ls() {
    const files = await fs.readdir(this.workingDirectory);
    this.#logger.showMessage(...files.map((file) => this.#logger.FgBlue + file));
  }

  /**
   * Go to dedicated folder from current directory
   * @param {string} pathToDirectory - path to directory, can be relative or absolute
   */
  async cd(pathToDirectory) {
    await this.isValidDirectory(pathToDirectory);
    this.workingDirectory = await this.getPath(pathToDirectory);
  }
}
