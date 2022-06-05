import path from "path";
import { createHash } from "crypto";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that calculates SHA256 hash for file `fileToCalculateHashFor.txt` and
 * return it as `hex`
 */
export const calculateHash = async () => {
  const hash = createHash("sha256");
  const filePath = path.resolve(
    __dirname,
    "files",
    "fileToCalculateHashFor.txt"
  );

  const file = fs.createReadStream(filePath);
  file.on("readable", () => {
    const data = file.read();
    if (data) {
      hash.update(data);
    } else {
      console.log(hash.digest("hex"));
    }
  });
};
