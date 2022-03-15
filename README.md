# ffprobe-wasm

Gather information from multimedia streams. Works on the browser and Node.js.

Uses the code at [alfg/ffprobe-wasm](https://github.com/alfg/ffprobe-wasm), but in a packaged format, so it can be reused in other projects.

_Note_: This project doesn't build or use FFProbe. Instead it uses FFmpeg's libavformat and libavcodec to output similar results.

## Installation

```sh
npm install ffprobe-wasm
```

## Examples

Node.js

```ts
import { FFprobeWorker } from "ffprobe-wasm";

const worker = new FFprobeWorker();

const fileInfo = await worker.getFileInfo("file.mp4");
console.log(fileInfo);
```

Browser

```ts
import { FFprobeWorker } from "ffprobe-wasm";

const worker = new FFprobeWorker();

// input is the reference to an <input type="file" /> element
input.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const fileInfo = await worker.getFileInfo(file);
  console.log(fileInfo);
});
```

## Notes

- In browser, `SharedArrayBuffer` is being used. To enable this in your server, read [Security requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements).
- In browser, everything is bundled in the `browser.mjs` script. When gzipped, this file is bigger than 1 MiB, so it's recommended to use `import()` to lazy load the asset. The good side of this is that you don't have to configure your bundler to include the worker or wasm files and you won't face [same-origin](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) issues with the worker.
