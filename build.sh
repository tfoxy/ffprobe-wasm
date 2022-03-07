#/bin/sh

# Exit on error
set -e

# Clean
rm -rf dist
rm -rf ffprobe-wasm-app/dist

# Build wasm
cd ffprobe-wasm-app
# sed -i -e 's/ffprobe-wasm\.js/ffprobe-wasm.mjs/g;s/-o dist\/ffprobe-wasm\.mjs \\/-o dist\/ffprobe-wasm.mjs -s EXPORT_NAME=ffprobe \\/' Makefile
docker-compose run ffprobe-wasm make
cd ..
cp -R ffprobe-wasm-app/dist dist
cp src/*.d.* dist

# Build browser/node workers
npm run build

# Copy package.json
cp package.json dist
