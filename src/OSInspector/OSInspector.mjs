import os from 'os';
import { Logger } from '../Logger.mjs';
import {
  OS_INSPECTOR_ERROR_CODES,
  OS_INSPECTOR_ERROR_MESSAGES,
  OSInspectorError,
} from './OSInspectorError.mjs';

export class OSInspector {
  #logger;

  constructor() {
    this.#logger = new Logger();
  }

  showInfo(option) {
    switch (option.slice(1).trim()) {
      case '-EOL':
      case 'e':
        this.#showEOL();
        break;
      case '-cpus':
      case 'c':
        this.#showCPUs();
        break;
      case '-homedir':
      case 'h':
        this.#showHomedir();
        break;
      case '-username':
      case 'u':
        this.#showSystemUsername();
        break;
      case '-architecture':
      case 'a':
        this.#showArchitecture();
        break;

      default:
        throw new OSInspectorError(
          OS_INSPECTOR_ERROR_CODES.UNKNOWN_OPTION,
          OS_INSPECTOR_ERROR_MESSAGES.UNKNOWN_OPTION,
        );
    }
  }

  /**
   * Get EOL (default system End-Of-Line)
   * @returns {string}
   */
  #showEOL() {
    const isPOSIX = os.EOL === '\n';
    const stringEOL = isPOSIX ? '\\n' : '\\r\\n';

    this.#logger.showMessage(
      `End-Of-Line is ${this.#logger.BgGreen}"${stringEOL}"${this.#logger.Reset}`,
      `or${this.#logger.BgGreen}${os.EOL}`,
    );
  }

  /**
   * Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz)
   * for each of them)
   */
  #showCPUs() {
    const cpusInfo = os.cpus().map(({ model, speed }) => ({ model, speed }));
    this.#logger.showMessage(...cpusInfo);
  }

  /**
   * Get home directory
   */
  #showHomedir() {
    const homedir = os.homedir();
    this.#logger.showMessage('Current homedir is', this.#logger.FgBlue + homedir);
  }

  /**
   * Get current system username
   */
  #showSystemUsername() {
    const { username } = os.userInfo();

    this.#logger.showMessage('Current user is', this.#logger.FgBlue + username);
  }

  /**
   * Get CPU architecture for which Node.js binary has compiled
   */
  #showArchitecture() {
    this.#logger.showMessage('CPU architecture is', this.#logger.FgBlue + os.arch());
  }
}
