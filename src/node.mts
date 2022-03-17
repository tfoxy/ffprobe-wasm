import { stat } from "fs/promises";
import { basename, dirname } from "path";
import { fileURLToPath } from "url";
import { MessageChannel, Worker } from "worker_threads";
import type { FFprobeWorker as AbstractFFprobeWorker } from "./ffprobe-worker.mjs";
import type {
  Chapter,
  Disposition,
  FileInfo,
  Format,
  Frame,
  FramesInfo,
  Rational,
  Stream,
} from "./types.mjs";
import type {
  IncomingMessage,
  IncomingData,
  OutgoingMessage,
} from "./worker.mjs";

export class FFprobeWorker implements AbstractFFprobeWorker {
  readonly #worker: Worker;

  constructor() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    this.#worker = new Worker(`${__dirname}/worker-node.mjs`);
  }

  async getFileInfo(filePath: string): Promise<FileInfo> {
    this.#validateFile(filePath);
    const fileInfo: FileInfo = await this.#postMessage({
      type: "getFileInfo",
      payload: [basename(filePath), { root: dirname(filePath) }],
    });
    fileInfo.format.filename = filePath;
    fileInfo.format.size = (await stat(filePath)).size.toString();
    return fileInfo;
  }

  async getFrames(filePath: string, offset: number): Promise<FramesInfo> {
    this.#validateFile(filePath);
    return this.#postMessage({
      type: "getFrames",
      payload: [basename(filePath), { root: dirname(filePath) }, offset],
    });
  }

  terminate(): void {
    this.#worker.terminate();
  }

  #validateFile(filePath: string | File): asserts filePath is string {
    if (typeof filePath === "object") {
      throw new Error(
        "File object only supported in Browser, you must provide a string (path)",
      );
    }
  }

  #postMessage(data: IncomingData): Promise<any> {
    const channel = new MessageChannel();
    const message: IncomingMessage = {
      ...data,
      port: channel.port2,
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

export type {
  Chapter,
  Disposition,
  FileInfo,
  Format,
  Frame,
  FramesInfo,
  Rational,
  Stream,
};
