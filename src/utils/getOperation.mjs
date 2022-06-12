export const UP_OPERATION = 'UP_OPERATION';
export const CHANGE_DIRECTORY_OPERATION = 'CHANGE_DIRECTORY_OPERATION';
export const LIST_OPERATION = 'LIST_OPERATION';

export const READ_OPERATION = 'READ_OPERATION';
export const CREATE_OPERATION = 'CREATE_OPERATION';
export const RENAME_OPERATION = 'RENAME_OPERATION';
export const COPY_OPERATION = 'COPY_OPERATION';
export const MOVE_OPERATION = 'MOVE_OPERATION';
export const DELETE_OPERATION = 'DELETE_OPERATION';

export const SYSTEM_INFO_OPERATION = 'SYSTEM_INFO_OPERATION';

export const HASH_CALCULATION_OPERATION = 'HASH_CALCULATION_OPERATION';

export const COMPRESS_OPERATION = 'COMPRESS_OPERATION';
export const DECOMPRESS_OPERATION = 'DECOMPRESS_OPERATION';

export const EXIT_OPERATION = '.exit';
export const INVALID_OPERATION = 'INVALID_OPERATION';

export const getOperation = (rawString) => {
  const data = rawString.toString().trim();
  const options = data.split(' ').slice(1);

  // Navigation
  if (data === 'up') {
    return { operation: UP_OPERATION };
  }
  if (data.startsWith('cd ')) {
    return { operation: CHANGE_DIRECTORY_OPERATION, options };
  }
  if (data === 'ls') {
    return { operation: LIST_OPERATION };
  }

  // File operations
  if (data.startsWith('cat ')) {
    return { operation: READ_OPERATION, options };
  }
  if (data.startsWith('add ')) {
    return { operation: CREATE_OPERATION, options };
  }
  if (data.startsWith('rn ')) {
    return { operation: RENAME_OPERATION, options };
  }
  if (data.startsWith('cp ')) {
    return { operation: COPY_OPERATION, options };
  }
  if (data.startsWith('mv ')) {
    return { operation: MOVE_OPERATION, options };
  }
  if (data.startsWith('rm ')) {
    return { operation: DELETE_OPERATION, options };
  }

  // Operating system info
  if (data.startsWith('os ')) {
    return { operation: SYSTEM_INFO_OPERATION, options };
  }

  // Hash calculation
  if (data.startsWith('hash ')) {
    return { operation: HASH_CALCULATION_OPERATION, options };
  }

  // Compress operations
  if (data.startsWith('compress ')) {
    return { operation: COMPRESS_OPERATION, options };
  }
  if (data.startsWith('decompress ')) {
    return { operation: DECOMPRESS_OPERATION, options };
  }

  // Exit
  if (data === '.exit') {
    return { operation: EXIT_OPERATION };
  }

  return { operation: INVALID_OPERATION };
};
