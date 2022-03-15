const { readFile, writeFile } = require("fs/promises");
const { dirname, resolve } = require("path");

main();

async function main() {
  const root = dirname(__dirname);

  const wasmJsPath = resolve(root, "dist/ffprobe-wasm.mjs");

  let content = await readFile(wasmJsPath, { encoding: "utf8" });

  content = `\
import initWasmInstance from "./ffprobe-wasm.wasm";
const initWasm = (info) =>
  initWasmInstance(info).then((exports) => ({ instance: { exports } }));
${content}`;

  content = content.replace(`import.meta.url`, `''`);

  content = content.replace(
    `instantiateAsync().catch(readyPromiseReject)`,
    `initWasm(info).then(receiveInstantiatedSource, readyPromiseReject)`
  );

  await writeFile(wasmJsPath, content, { encoding: "utf8" });
}
