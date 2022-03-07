import type { MessagePort as NodeMessagePort } from "worker_threads";
import type { Chapter, ChapterTag, FFprobe, FileInfo, FramesInfo, FSFilesystems, FSMountOptions, Stream } from "./ffprobe-wasm-shared";

export type IncomingMessage = { port: MessagePort | NodeMessagePort } & IncomingData;

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

  async function getFileInfo(fileName: string, mountOptions: FSMountOptions): Promise<FileInfo> {
    const { FS, get_file_info } = await ffprobePromise;
    try {
      if (!FS.analyzePath("/work").exists) {
        FS.mkdir("/work");
      }
      FS.mount(FS.filesystems[fsType], mountOptions, "/work");

      // Call the wasm module.
      const rawInfo = get_file_info(`/work/${fileName}`);

      // Remap streams into collection.
      const streams: Stream[] = [];
      for (let i = 0; i < rawInfo.streams.size(); i++) {
        streams.push(rawInfo.streams.get(i));
      }

      // Remap chapters into collection.
      const chapters: Chapter[] = [];
      for (let i = 0; i < rawInfo.chapters.size(); i++) {
        const rawChapter = rawInfo.chapters.get(i);

        const tags: ChapterTag[] = [];
        for (let j = 0; j < rawChapter.tags.size(); j++) {
          tags.push(rawChapter.tags.get(j));
        }

        chapters.push({ ...rawChapter, tags });
      }

      return {
        ...rawInfo,
        streams,
        chapters,
      };
    } finally {
      // Cleanup mount.
      FS.unmount("/work");
    }
  }

  async function getFrames(fileName: string, mountOptions: FSMountOptions, offset: number): Promise<FramesInfo> {
    const { FS, get_frames } = await ffprobePromise;
    try {
      if (!FS.analyzePath("/work").exists) {
        FS.mkdir("/work");
      }
      FS.mount(FS.filesystems.WORKERFS, mountOptions, "/work");

      // Call the wasm module.
      const framesInfo = get_frames(`/work/${fileName}`, offset);

      // Remap frames into collection.
      const frames = [];
      for (let i = 0; i < framesInfo.frames.size(); i++) {
        frames.push(framesInfo.frames.get(i));
      }

      return {
        ...framesInfo,
        frames,
      };
    } finally {
      // Cleanup mount.
      FS.unmount("/work");
    }
  }
}
