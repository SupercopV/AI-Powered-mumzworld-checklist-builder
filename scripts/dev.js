import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runScript(scriptName) {
  return spawn(npmCommand, ["run", scriptName], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

const children = [runScript("server"), runScript("dev:client")];

function shutdown() {
  for (const child of children) {
    if (child && !child.killed) {
      child.kill();
    }
  }
}

for (const child of children) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
    }
    shutdown();
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
