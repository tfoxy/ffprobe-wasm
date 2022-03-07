import { createRequire } from "module";
import { parentPort } from "worker_threads";
import type { FFprobe } from "./ffprobe-wasm.js";
import { createListener } from "./worker.mjs";

if (!parentPort) {
  throw new Error("parentPort must be defined. Are you sure you are in a worker context?");
}

const require = createRequire(import.meta.url);

const listener = createListener(new Promise((resolve) => {
  const ffprobe: FFprobe = require('./ffprobe-wasm.js')
  ffprobe.onRuntimeInitialized = () => {
    resolve(ffprobe);
  }
}), "NODEFS");

parentPort.on("message", listener);
