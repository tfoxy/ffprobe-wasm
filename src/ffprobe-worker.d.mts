import { FileInfo, FramesInfo } from "./types.mjs";

export * from "./types.mjs";

export declare class FFprobeWorker {
  /**
   * This function tries to be equivalent to
   * ```
   * ffprobe -hide_banner -loglevel fatal -show_format -show_streams -show_chapters -show_private_data -print_format json
   * ```
   */
  getFileInfo(file: File | string): Promise<FileInfo>;

  getFrames(file: File | string, offset: number): Promise<FramesInfo>;

  terminate(): void;
}
