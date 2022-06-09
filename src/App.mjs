import { Navigator } from './Navigator/Navigator.mjs';
import { AppError } from './AppError.mjs';
import { Parser } from './Parser/Parser.mjs';
import {
  CHANGE_DIRECTORY_OPERATION,
  EXIT_OPERATION,
  LIST_OPERATION,
  SYSTEM_INFO_OPERATION,
  UP_OPERATION,
} from './Parser/AvailableOperations.mjs';
import { AppLogger } from './AppLogger.mjs';
import { OSInspector } from './OSInspector/OSInspector.mjs';

export class App {
  #username;

  constructor() {
    this.#username = Parser.getUsername();
    this.logger = new AppLogger(this.#username);
    this.navigator = new Navigator();
    this.OSInspector = new OSInspector();
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

        case SYSTEM_INFO_OPERATION:
          await this.OSInspector.showInfo(...options);
          break;

        case EXIT_OPERATION:
          process.exit();
          break;

        default:
          // TODO: remove
          Object.keys(_colors).forEach((key) => {
            console['log' + key]('key: ', key);
          });
      }
    } catch (err) {
      if (err instanceof AppError) {
        this.logger.showError(`Operation failed [${err.code}]: ${err.message}`);
      }
    }
  }
}

/**
 * 1. start and finish program
 * 2. work with directories
 * 3. error handler
 * 4. invalid input handler
 * 5. up, cd, ls, cat, add, rn, cp, mv, rm
 * 6. os work
 * 7. hash
 * 8. compress/decompress
 */
// TODO: remove
// ==========
const _colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

const enableColorLogging = function () {
  Object.keys(_colors).forEach((key) => {
    console['log' + key] = function () {
      return console.log(_colors[key], ...arguments, _colors.Reset);
    };
  });
};

enableColorLogging();
