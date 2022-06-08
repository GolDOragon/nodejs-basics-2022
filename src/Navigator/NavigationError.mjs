import { AppError } from '../AppError.mjs';

export class NavigationError extends AppError {
  /**
   * navigation error builder
   * @param code - status code
   * @param message - error message
   */
  constructor(code, message) {
    super({
      name: 'NavigationError',
      code,
      message,
    });
  }
}

export const NAVIGATION_ERROR_CODES = {
  PATH_OUTSIDE_HOME_DIRECTORY: 41,
  NON_EXIST_DIRECTORY: 42,
};

export const NAVIGATION_ERROR_MESSAGES = {
  PATH_OUTSIDE_HOME_DIRECTORY: 'The directory is outside of the home directory',
  NON_EXIST_DIRECTORY: "The directory doesn't exist",
};
