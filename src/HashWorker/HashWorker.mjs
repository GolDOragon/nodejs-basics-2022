import { createHash } from 'crypto';
import fs from 'fs';
import { Logger } from '../Logger.mjs';
import { PathWorker } from '../PathWorker.mjs';

export class HashWorker {
  #hash;

  #logger;

  #pathWorker;

  constructor(homedir, algorithm) {
    this.#hash = createHash(algorithm);

    this.#pathWorker = new PathWorker(homedir);
    this.#logger = new Logger();
  }

  async calculateHash(pathToFile) {
    await this.#pathWorker.isValidFile(pathToFile);
    const absolutePath = await this.#pathWorker.getPath(pathToFile);

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
}
