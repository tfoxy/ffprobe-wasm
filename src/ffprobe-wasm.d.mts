import { FFprobe } from "./ffprobe-wasm-shared.mjs";

export * from "./ffprobe-wasm-shared.mjs";

export default function loadFFprobe(ffprobe?: FFprobeInit): Promise<FFprobe>;

export interface FFprobeInit {
  locateFile?(path: string, scriptDirectory: string): string;
}
