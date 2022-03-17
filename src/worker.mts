import type { MessagePort as NodeMessagePort } from "worker_threads";
import type {
  DictionaryEntry,
  FFprobe,
  FSFilesystems,
  FSMountOptions,
  Raw,
  Vector,
} from "./ffprobe-wasm-shared.mjs";
import { FileInfo, FramesInfo, Stream } from "./types.mjs";

export type IncomingMessage = {
  port: MessagePort | NodeMessagePort;
} & IncomingData;

export type IncomingData =
  | {
      type: "getFileInfo";
      payload: [fileName: string, mountOptions: FSMountOptions];
    }
  | {
      type: "getFrames";
      payload: [fileName: string, mountOptions: FSMountOptions, offset: number];
    };

export type OutgoingMessage =
  | ({ status: "success" } & OutgoingData)
  | { status: "error"; message: string };

export type OutgoingData =
  | {
      type: "getFileInfo";
      payload: FileInfo;
    }
  | {
      type: "getFrames";
      payload: FramesInfo;
    };

export function createListener(
  ffprobePromise: Promise<FFprobe>,
  fsType: keyof FSFilesystems,
) {
  return onmessage;

  async function onmessage(data: IncomingMessage) {
    try {
      switch (data.type) {
        case "getFileInfo":
          data.port.postMessage({
            status: "success",
            payload: await getFileInfo(...data.payload),
            type: data.type,
          });
          break;
        case "getFrames":
          data.port.postMessage({
            status: "success",
            payload: await getFrames(...data.payload),
            type: data.type,
          });
          break;
        default:
          const _: never = data;
          throw new Error(`Unknown event: ${JSON.stringify(_)}`);
      }
    } catch (error) {
      console.error(error);
      data.port.postMessage({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  function vectorToArray<T>(vector: Vector<T>): T[] {
    const array: T[] = [];
    for (let i = 0; i < vector.size(); i++) {
      array.push(vector.get(i));
    }
    return array;
  }

  function dictionaryVectorToRecord(
    vector: Vector<DictionaryEntry>,
  ): Record<string, string> {
    return Object.fromEntries(
      vectorToArray(vector).map(({ key, value }) => [key, value]),
    );
  }

  function serializeStreams(streams: Vector<Raw<Stream>>) {
    return vectorToArray(streams).map((stream) => ({
      ...stream,
      tags: dictionaryVectorToRecord(stream.tags),
    }));
  }

  async function getFileInfo(
    fileName: string,
    mountOptions: FSMountOptions,
  ): Promise<FileInfo> {
    const { FS, get_file_info } = await ffprobePromise;
    try {
      if (!FS.analyzePath("/work").exists) {
        FS.mkdir("/work");
      }
      FS.mount(FS.filesystems[fsType], mountOptions, "/work");

      const rawInfo = get_file_info(`/work/${fileName}`);

      return {
        streams: serializeStreams(rawInfo.streams),
        chapters: vectorToArray(rawInfo.chapters).map((chapter) => ({
          ...chapter,
          tags: dictionaryVectorToRecord(chapter.tags),
        })),
        format: {
          ...rawInfo.format,
          tags: dictionaryVectorToRecord(rawInfo.format.tags),
        },
      };
    } finally {
      // Cleanup mount.
      FS.unmount("/work");
    }
  }

  async function getFrames(
    fileName: string,
    mountOptions: FSMountOptions,
    offset: number,
  ): Promise<FramesInfo> {
    const { FS, get_frames } = await ffprobePromise;
    try {
      if (!FS.analyzePath("/work").exists) {
        FS.mkdir("/work");
      }
      FS.mount(FS.filesystems.WORKERFS, mountOptions, "/work");

      const framesInfo = get_frames(`/work/${fileName}`, offset);

      return {
        ...framesInfo,
        frames: vectorToArray(framesInfo.frames),
      };
    } finally {
      // Cleanup mount.
      FS.unmount("/work");
    }
  }
}
