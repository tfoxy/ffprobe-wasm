import { FileInfo, FramesInfo } from "./types.mjs";

export interface FFprobe {
  get_file_info(path: string): Raw<FileInfo>;
  get_frames(path: string, offset: number): Raw<FramesInfo>;
  FS: FS;
  avutil_version(): string;
  avcodec_version(): string;
  avformat_version(): string;
  onRuntimeInitialized(): void;
}

export type FSMountOptions = WorkerFSMountOptions | NodeFSMountOptions;

export interface WorkerFSMountOptions {
  files?: File[];
  blobs?: Blob[];
  packages?: any[];
}

export interface NodeFSMountOptions {
  root: string;
}

export interface FSFilesystemMountOptions {
  type: FSFilesystem;
  opts: FSFilesystemMountOptions;
  mountpoint: string;
  mounts: any[];
}

export interface FSFilesystem {
  mount(opts: FSFilesystemMountOptions): FSNode;
}

export interface FSNode {
  contents: Record<string, FSNode>;
  id: number;
  mode: number;
  name: string;
  parent: FSNode;
  timestamp: number;
  isDevice(): boolean;
  isFolder(): boolean;
  [key: string]: any;
}

export interface FSFilesystems {
  MEMFS: FSFilesystem;
  WORKERFS: FSFilesystem;
  NODEFS: FSFilesystem;
}

export interface FS {
  analyzePath(path: string, dontResolveLastLink?: boolean): AnalyzePathReturn;
  mkdir(path: string, mode?: number): number;
  mount(type: FSFilesystem, opts: FSMountOptions, mountpoint: string): FSNode;
  unmount(mountpoint: string): void;
  filesystems: FSFilesystems;
}

export interface AnalyzePathReturn {
  isRoot: boolean;
  exists: boolean;
  error: number;
  name: string | null;
  path: string | null;
  object: any | null;
  parentExists: boolean;
  parentPath: string | null;
  parentObject: any | null;
}

export interface Vector<T> {
  count: { value: number };
  ptr: number;
  ptrType: any;
  get(index: number): T;
  size(): number;
}

export interface DictionaryEntry {
  key: string;
  value: string;
}

export type Raw<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? Vector<Raw<U>>
    : T[K] extends Record<string, string>
    ? Vector<DictionaryEntry>
    : T[K] extends string | number | boolean | undefined | null
    ? T[K]
    : Raw<T[K]>;
};
