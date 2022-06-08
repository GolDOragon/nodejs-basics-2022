import * as os from 'os';

const { stdout } = process;

export class Logger {
  #name;

  constructor(name) {
    this.#name = name;
  }

  sayHi() {
    this.showMessage(`Welcome to the File Manager, ${this.#name}!`);
  }

  sayBye() {
    this.showMessage(`Thank you for using File Manager, ${this.#name}!`);
  }

  showError(error) {
    this.showMessage(`Error: ${error}`);
  }

  showMessage(message) {
    stdout.write(`${message}${os.EOL}`);
  }
}
