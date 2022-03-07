ffprobe-wasm
==========

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
import { FFprobeWorker } from 'ffprobe-wasm/node.mjs';

const worker = new FFprobeWorker();

const fileInfo = await worker.getFileInfo('file.mp4');
console.log(fileInfo);
```

Browser

```ts
import { FFprobeWorker } from 'ffprobe-wasm/browser.mjs';

const worker = new FFprobeWorker();

// input is the reference to a <input type="file" /> element
input.addEventListener('change', (event) => {
  const file = event.target.files[0]
  const fileInfo = await worker.getFileInfo(file);
  console.log(fileInfo);
});
```
