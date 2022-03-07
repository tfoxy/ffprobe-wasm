import { FFprobe } from "./ffprobe-wasm-shared";

export * from "./ffprobe-wasm-shared";

declare const ffprobe: FFprobe;

export default ffprobe;
