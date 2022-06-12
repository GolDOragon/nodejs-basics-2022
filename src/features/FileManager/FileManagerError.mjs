import { AppError } from '../../AppError.mjs';

export class FileManagerError extends AppError {
  /**
   * file operations error builder
   * @param code - status code
   * @param message - error message
   */
  constructor(code, message) {
    super({
      name: 'FileManagerError',
      code,
      message,
    });
  }
}

export const FILE_OPERATION_ERROR_CODES = {
  FILE_ALREADY_EXISTS: 71,
  FILE_NOT_EXIST: 72,
  DIRECTORY_NOT_EXIST: 73,
};

export const FILE_OPERATION_ERROR_MESSAGES = {
  FILE_ALREADY_EXISTS: 'File already exists.',
  FILE_NOT_EXIST: "File doesn't exist.",
  DIRECTORY_NOT_EXIST: "Directory doesn't exist.",
};
