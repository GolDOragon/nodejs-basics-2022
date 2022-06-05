import { Transform } from "stream";
import { pipeline } from "stream/promises";

/**
 * implement function that reads data from `process.stdin`, reverses
 * text using Transform Stream and then writes it into `process.stdout`
 */
export const transform = async () => {
  const transformStream = new Transform({
    transform(chunk, _, cb) {
      this.push(chunk.toString().split("").reverse().join(""));
      cb();
    },
  });

  pipeline(process.stdin, transformStream, process.stdout).catch((err) => {
    console.log(err);
  });
};
