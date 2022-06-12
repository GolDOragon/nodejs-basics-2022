export const getUsername = () => {
  const username = process.argv.find((arg) => arg.startsWith('--username='));

  return username.split('=')[1];
};
