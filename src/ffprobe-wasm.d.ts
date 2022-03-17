import { FFprobe } from "./ffprobe-wasm-shared.mjs";

export * from "./ffprobe-wasm-shared.mjs";

declare const ffprobe: FFprobe;

export default ffprobe;
