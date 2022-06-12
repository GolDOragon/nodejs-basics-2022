import { AppError } from '../AppError.mjs';

export class PathWorkerError extends AppError {
  /**
   * navigation error builder
   * @param code - status code
   * @param message - error message
   */
  constructor(code, message) {
    super({
      name: 'PathWorkerError',
      code,
      message,
    });
  }
}

export const PATH_ERROR_CODES = {
  PATH_OUTSIDE_HOME_DIRECTORY: 41,
  NON_EXIST_PATH: 42,

  NON_EXIST_DIRECTORY: 43,
  NON_EXIST_FILE: 44,
};

export const PATH_ERROR_MESSAGES = {
  PATH_OUTSIDE_HOME_DIRECTORY: 'The path goes outside of the home directory',
  NON_EXIST_PATH: "The directory/file doesn't exist",

  NON_EXIST_DIRECTORY: "The directory doesn't exist",
  NON_EXIST_FILE: "The file doesn't exist",
};
