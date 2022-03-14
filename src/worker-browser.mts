import loadFFprobe from "./ffprobe-wasm.mjs";
import { createListener, IncomingMessage } from "./worker.mjs";

export interface BrowserWorkerOptions {
  scriptLocation?: string;
}

export type BrowserIncomingMessage = IncomingMessage | {
  type: "options";
  payload: BrowserWorkerOptions;
}

let scriptLocation = '.';

const listener = createListener(
  loadFFprobe({
    locateFile: (path) => `${scriptLocation}/${path}`
  }),
  "WORKERFS",
);

self.onmessage = (event: MessageEvent<BrowserIncomingMessage>) => {
  const { data } = event;
  if (data.type !== "options") {
    listener(data);
  } else if (typeof data.payload.scriptLocation !== 'undefined') {
    scriptLocation = data.payload.scriptLocation;
  }
}
