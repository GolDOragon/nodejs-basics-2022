export class AppError extends Error {
  code;

  constructor({ message, name, code }) {
    super(message);

    this.name = name;
    this.code = code;
  }
}
