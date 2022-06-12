import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { Logger } from '../utils/Logger.mjs';
import { PathWorker } from '../utils/PathWorker.mjs';

export class ZipWorker {
  #pathWorker;

  #logger;

  #zip;

  #unzip;

  constructor(homedir) {
    this.#pathWorker = new PathWorker(homedir);
    this.#logger = new Logger();

    this.#zip = createBrotliCompress();
    this.#unzip = createBrotliDecompress();
  }

  async compress(workingDirectory, pathToFile, pathToArchive) {
    const filePath = this.#getAbsolutePath(workingDirectory, pathToFile);
    const archivePath = this.#getAbsolutePath(workingDirectory, `${pathToArchive}.br`);

    await pipeline(createReadStream(filePath), this.#zip, createWriteStream(archivePath)).then(
      () => {
        this.#logger.showMessage(
          'The file was compressed. The archive is in',
          `${this.#logger.FgBlue}${archivePath}`,
        );
      },
    );
  }

  async decompress(workingDirectory, pathToArchive, pathToFile) {
    const archivePath = this.#getAbsolutePath(workingDirectory, pathToArchive);
    const filePath = this.#getAbsolutePath(workingDirectory, pathToFile);

    await pipeline(createReadStream(archivePath), this.#unzip, createWriteStream(filePath)).then(
      () => {
        this.#logger.showMessage(
          'The archive was decompressed. The file is in',
          `${this.#logger.FgBlue}${filePath}`,
        );
      },
    );
  }

  #getAbsolutePath(workingDirectory, pathFile) {
    this.#pathWorker.workingDirectory = workingDirectory;
    return this.#pathWorker.getPath(pathFile);
  }
}
