import { createHash } from 'crypto';
import fs from 'fs';
import { Logger } from '../utils/Logger.mjs';
import { PathWorker } from '../utils/PathWorker.mjs';

export class HashWorker {
  #hash;

  #logger;

  #pathWorker;

  constructor(homedir, algorithm) {
    this.#hash = createHash(algorithm);

    this.#pathWorker = new PathWorker(homedir);
    this.#logger = new Logger();
  }

  async calculateHash(workingDirectory, pathToFile) {
    const absolutePath = this.#getAbsolutePath(workingDirectory, pathToFile);
    await this.#pathWorker.isValidFile(absolutePath);

    const fileData = fs.createReadStream(absolutePath);

    fileData.on('readable', () => {
      const data = fileData.read();
      if (data) {
        this.#hash.update(data);
      } else {
        this.#logger.showMessage(this.#hash.digest('hex'));
      }
    });
  }

  #getAbsolutePath(workingDirectory, pathFile) {
    this.#pathWorker.workingDirectory = workingDirectory;
    return this.#pathWorker.getPath(pathFile);
  }
}
