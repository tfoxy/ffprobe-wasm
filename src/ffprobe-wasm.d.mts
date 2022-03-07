import { FFprobe } from "./ffprobe-wasm-shared";

export * from "./ffprobe-wasm-shared";

export default function loadFFprobe(ffprobe?: FFprobeInit): Promise<FFprobe>;

export interface FFprobeInit {
  locateFile?(path: string, scriptDirectory: string): string;
}
