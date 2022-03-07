import { basename, dirname } from "path";
import { fileURLToPath } from 'url';
import { MessageChannel, Worker } from "worker_threads";
import type { Chapter, ChapterTag, FileInfo, Frame, FramesInfo, Stream } from "./ffprobe-wasm.mjs";
import type {
  IncomingMessage,
  IncomingData,
  OutgoingMessage,
} from "./worker.mjs";

export class FFprobeWorker {
  readonly #worker: Worker;

  constructor() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    this.#worker = new Worker(`${__dirname}/worker-node.mjs`);
  }

  async getFileInfo(filePath: string): Promise<FileInfo> {
    return this.#postMessage({ type: "getFileInfo", payload: [basename(filePath), { root: dirname(filePath) }] });
  }

  async getFrames(filePath: string, offset: number): Promise<FramesInfo> {
    return this.#postMessage({ type: "getFrames", payload: [basename(filePath), { root: dirname(filePath) }, offset] });
  }

  terminate(): void {
    this.#worker.terminate();
  }

  #postMessage(data: IncomingData): Promise<any> {
    const channel = new MessageChannel();
    const message: IncomingMessage = {
      ...data,
      port: channel.port2
    };

    this.#worker.postMessage(message, [channel.port2]);

    return new Promise((resolve, reject) => {
      channel.port1.on("message", (data: OutgoingMessage) => {
        if (data.status === "success") {
          resolve(data.payload);
        } else {
          reject(new Error(data.message));
        }
      });
    });
  }
}

export type { Chapter, ChapterTag, FileInfo, Frame, FramesInfo, Stream };
