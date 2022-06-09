import { Logger } from './Logger.mjs';

export class AppLogger extends Logger {
  #name;

  constructor(name) {
    super();
    this.#name = name;
  }

  sayHi() {
    this.showMessage(`${this.BgGreen}Welcome to the File Manager, ${this.#name}!`);
  }

  sayBye() {
    this.showMessage(`${this.BgGreen}Thank you for using File Manager, ${this.#name}!`);
  }
}
