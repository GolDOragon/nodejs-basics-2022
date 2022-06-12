export const getFilename = (pathToFile) => {
  const parts = pathToFile.split('/');
  return parts[parts.length - 1];
};
