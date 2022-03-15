import loadFFprobe from "./ffprobe-wasm.mjs";
import { createListener, IncomingMessage } from "./worker.mjs";

const listener = createListener(loadFFprobe(), "WORKERFS");

self.onmessage = (event: MessageEvent<IncomingMessage>) => listener(event.data);
