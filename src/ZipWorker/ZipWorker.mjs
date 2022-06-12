import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip, createUnzip } from 'zlib';
import { Logger } from '../Logger.mjs';
import { PathWorker } from '../PathWorker.mjs';

export class ZipWorker {
  #pathWorker;

  #logger;

  #zip;

  #unzip;

  constructor(homedir) {
    this.#pathWorker = new PathWorker(homedir);
    this.#logger = new Logger();

    this.#zip = createGzip();
    this.#unzip = createUnzip();
  }

  async compress(pathToFile, pathToArchive) {
    const filePath = this.#pathWorker.getPath(pathToFile);
    const archivePath = `${this.#pathWorker.getPath(pathToArchive)}.gz`;

    await pipeline(createReadStream(filePath), this.#zip, createWriteStream(archivePath)).then(
      () => {
        this.#logger.showMessage(
          'The file was compressed. The archive is in',
          `${this.#logger.FgBlue}${archivePath}`,
        );
      },
    );
  }

  async decompress(pathToArchive, pathToFile) {
    const archivePath = await this.#pathWorker.getPath(pathToArchive);
    const filePath = await this.#pathWorker.getPath(pathToFile);

    await pipeline(createReadStream(archivePath), this.#unzip, createWriteStream(filePath)).then(
      () => {
        this.#logger.showMessage(
          'The archive was decompressed. The file is in',
          `${this.#logger.FgBlue}${filePath}`,
        );
      },
    );
  }
}
