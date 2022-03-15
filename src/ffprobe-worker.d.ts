import type {
  Chapter,
  ChapterTag,
  FileInfo,
  Frame,
  FramesInfo,
  Stream,
} from "./ffprobe-wasm-shared";

export declare class FFprobeWorker {
  getFileInfo(file: File | string): Promise<FileInfo>;

  getFrames(file: File | string, offset: number): Promise<FramesInfo>;

  terminate(): void;
}

export { Chapter, ChapterTag, FileInfo, Frame, FramesInfo, Stream };
