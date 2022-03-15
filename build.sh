#/bin/sh

# Exit on error
set -e

# Clean
rm -rf dist
rm -rf ffprobe-wasm-app/dist

# Build wasm
cd ffprobe-wasm-app
docker-compose run ffprobe-wasm make
cd ..
cp -R ffprobe-wasm-app/dist dist
node scripts/replace.js
cp src/*.d.* dist

# Build browser/node workers
npm run build

# Remove unnecessary files
rm dist/browser-vite.* dist/ffprobe-wasm.d.mts dist/ffprobe-wasm.mjs dist/worker-browser.*

# Copy files for npm publish
cp package.json LICENSE README.md dist
