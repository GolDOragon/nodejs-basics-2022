/**
 * implement function that parses command line arguments (given in format
 * `--propName value --prop2Name value2`, you don't need to validate it) and prints them
 * to the console in the format `propName is value, prop2Name is value2`
 */
export const parseArgs = () => {
  const rawArgs = process.argv.slice(2);
  const args = [];

  for (let i = 0; i < rawArgs.length; i += 1) {
    const current = rawArgs[i];

    if (current.startsWith("--")) {
      args.push([current]);
    } else {
      args[args.length - 1].push(current);
    }
  }

  console.log(args.map((current) => current.join(" is ")).join(", "));
};
