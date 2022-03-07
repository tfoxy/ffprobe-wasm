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

export interface FileInfo {
  bit_rate: number
  chapters: Chapter[]
  duration: number
  flags: number
  name: string
  nb_chapters: number
  nb_streams: number
  streams: Stream[]
  url: string
}

export interface Collection<T> {
  count: { value: number }
  ptr: number;
  ptrType: any;
  get(index: number): T;
  size(): number;
}

export type Raw<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? Collection<Raw<U>> : T[K]
}

export interface Chapter {
  end: number
  id: number
  start: number
  tags: ChapterTag[]
  /**
   * @example "1/1000"
   */
  time_base: string
}

export interface ChapterTag {
  key: string
  value: string
}

export interface Stream {
  bit_rate: number
  channels: number
  codec_name: string
  codec_type: number
  duration: number
  format: string
  frame_size: number
  height: number
  id: number
  level: number
  profile: string
  sample_rate: number
  start_time: number
  width: number
}

export interface FramesInfo {
  avg_frame_rate: number
  duration: number
  frames: Frame[]
  gop_size: number
  nb_frames: number
  time_base: number
}

export interface Frame {
  dts: number
  frame_number: number
  pict_type: number
  pkt_size: number
  pos: number
  pts: number
}
