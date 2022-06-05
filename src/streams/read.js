import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that reads file `fileToRead.txt` content using Readable Stream and prints it's content into `process.stdout`
 */
export const read = async () => {
  const input = fs.createReadStream(
    path.resolve(__dirname, "files", "fileToRead.txt")
  );

  input.on("readable", () => {
    const data = input.read();
    if (data) {
      process.stdout.write(data);
    }
  });
};
