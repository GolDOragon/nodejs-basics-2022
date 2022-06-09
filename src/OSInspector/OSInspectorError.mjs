import { AppError } from '../AppError.mjs';

export class OSInspectorError extends AppError {
  /**
   * inspector error builder
   * @param code - status code
   * @param message - error message
   */
  constructor(code, message) {
    super({
      name: 'OSInspectorError',
      code,
      message,
    });
  }
}

export const OS_INSPECTOR_ERROR_CODES = {
  UNKNOWN_OPTION: 10,
};

export const OS_INSPECTOR_ERROR_MESSAGES = {
  UNKNOWN_OPTION: 'Unknown option',
};
