import { fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * implement function spawnChildProcess that receives array of arguments args
 * and creates child process from file script.js, passing these args to it.
 * This function should create IPC-channel between stdin and stdout of master
 * process and child process
 */
export const spawnChildProcess = async (args) => {
  const filePath = path.resolve(__dirname, "files", "script.js");
  const child = fork(filePath, args, { silent: true });

  child.stdout.pipe(process.stdout);
  process.stdin.pipe(child.stdin);
};
