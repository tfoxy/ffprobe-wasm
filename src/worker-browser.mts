import loadFFprobe from "./ffprobe-wasm.mjs";
import { createListener, IncomingMessage } from "./worker.mjs";

const listener = createListener(
  loadFFprobe({
    locateFile: (path) => `${location.origin}/node_modules/ffprobe-wasm/${path}`
  }),
  "WORKERFS",
);

self.onmessage = (event: MessageEvent<IncomingMessage>) => listener(event.data);
