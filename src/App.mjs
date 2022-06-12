import os from 'os';
import { Navigator } from './Navigator/Navigator.mjs';
import { AppError } from './AppError.mjs';
import { Parser } from './Parser/Parser.mjs';
import {
  CHANGE_DIRECTORY_OPERATION,
  COMPRESS_OPERATION,
  COPY_OPERATION,
  CREATE_OPERATION,
  DECOMPRESS_OPERATION,
  DELETE_OPERATION,
  EXIT_OPERATION,
  HASH_CALCULATION_OPERATION,
  LIST_OPERATION,
  MOVE_OPERATION,
  READ_OPERATION,
  RENAME_OPERATION,
  SYSTEM_INFO_OPERATION,
  UP_OPERATION,
} from './Parser/AvailableOperations.mjs';
import { AppLogger } from './AppLogger.mjs';
import { OSInspector } from './OSInspector/OSInspector.mjs';
import { HashWorker } from './HashWorker/HashWorker.mjs';
import { ZipWorker } from './ZipWorker/ZipWorker.mjs';
import { FileOperator } from './FileOperator/FileOperator.mjs';

export class App {
  #username;

  constructor() {
    this.#username = Parser.getUsername();
    this.logger = new AppLogger(this.#username);
    this.navigator = new Navigator(os.homedir());
    this.fileOperator = new FileOperator(os.homedir());
    this.OSInspector = new OSInspector();
    this.hashWorker = new HashWorker(os.homedir(), 'sha256');
    this.zipWorker = new ZipWorker(os.homedir());
  }

  run() {
    this.logger.sayHi();

    process.stdin.on('data', (data) => this.#executeOperation(data));

    process.on('SIGINT', () => {
      process.exit();
    });
    process.on('exit', () => {
      this.logger.sayBye();
    });
  }

  async #executeOperation(prompt) {
    try {
      const { operation, options } = Parser.getOperation(prompt);

      switch (operation) {
        case UP_OPERATION:
          await this.navigator.up();
          break;
        case LIST_OPERATION:
          await this.navigator.ls();
          break;
        case CHANGE_DIRECTORY_OPERATION:
          await this.navigator.cd(...options);
          break;

        case READ_OPERATION:
          await this.fileOperator.readFile(this.navigator.workingDirectory, ...options);
          break;
        case CREATE_OPERATION:
          await this.fileOperator.createEmptyFile(this.navigator.workingDirectory, ...options);
          break;
        case RENAME_OPERATION:
          await this.fileOperator.renameFile(this.navigator.workingDirectory, ...options);
          break;
        case COPY_OPERATION:
          await this.fileOperator.copyFile(this.navigator.workingDirectory, ...options);
          break;
        case MOVE_OPERATION:
          await this.fileOperator.moveFile(this.navigator.workingDirectory, ...options);
          break;
        case DELETE_OPERATION:
          await this.fileOperator.deleteFile(this.navigator.workingDirectory, ...options);
          break;

        case SYSTEM_INFO_OPERATION:
          await this.OSInspector.showInfo(...options);
          break;

        case HASH_CALCULATION_OPERATION:
          await this.hashWorker.calculateHash(this.navigator.workingDirectory, ...options);
          break;

        case COMPRESS_OPERATION:
          await this.zipWorker.compress(this.navigator.workingDirectory, ...options);
          break;
        case DECOMPRESS_OPERATION:
          await this.zipWorker.decompress(this.navigator.workingDirectory, ...options);
          break;

        case EXIT_OPERATION:
          process.exit();
          break;

        default:
          this.logger.showError('Invalid Operation');
      }
    } catch (err) {
      // console.log(err);
      if (err instanceof AppError) {
        this.logger.showError(`Operation failed [${err.code}]: ${err.message}`);
      } else {
        this.logger.showError(`Unknown error: ${err.message}`);
      }
    }
  }
}
