import type { Chapter, ChapterTag, FileInfo, Frame, FramesInfo, Stream } from "./ffprobe-wasm.mjs";
import type {
  IncomingMessage,
  IncomingData,
  OutgoingMessage,
} from "./worker.mjs";

export class FFprobeWorker {
  readonly #worker: Worker;

  constructor() {
    this.#worker = new Worker("./worker-browser.mjs");
  }

  async getFileInfo(file: File): Promise<FileInfo> {
    return this.#postMessage({ type: "getFileInfo", payload: [file.name, { files: [file] }] });
  }

  async getFrames(file: File, offset: number): Promise<FramesInfo> {
    return this.#postMessage({ type: "getFrames", payload: [file.name, { files: [file] }, offset] });
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
      channel.port1.onmessage = (event: MessageEvent<OutgoingMessage>) => {
        const { data } = event;
        if (data.status === "success") {
          resolve(data.payload);
        } else {
          reject(new Error(data.message));
        }
      }
    });
  }
}

export type { Chapter, ChapterTag, FileInfo, Frame, FramesInfo, Stream };
