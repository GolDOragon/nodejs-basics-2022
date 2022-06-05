import { cpus } from "os";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function that creates number of worker threads (equal to the number of
 * host machine logical CPU cores) from file worker.js and able to send data to
 * those threads and to receive result of the computation from them.
 */
export const performCalculations = async () => {
  const coresCount = cpus().length;
  const filePath = path.resolve(__dirname, "worker.js");

  let threads = [];

  for (let i = 0; i < coresCount; i += 1) {
    const worker = new Worker(filePath, { workerData: i + 10 });

    threads.push(
      new Promise((res, rej) => {
        worker.on("message", (data) => res({ status: "resolved", data }));
        worker.on("error", () => rej({ status: "error", data: null }));

        worker.on("exit", (code) => {
          if (code !== 0)
            rej(new Error(`Worker stopped with exit code ${code}`));
        });
      })
    );
  }

  return Promise.all(threads);
};
