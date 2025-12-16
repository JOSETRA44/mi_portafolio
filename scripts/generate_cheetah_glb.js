// Generates a minimal GLB with a single triangle mesh as a placeholder.
// Run with: node scripts/generate_cheetah_glb.js

const fs = require('fs')
const path = require('path')

// simple triangle positions (3 vertices, XYZ)
const positions = new Float32Array([0.0, 0.0, 0.0,  1.0, 0.0, 0.0,  0.0, 1.0, 0.0])
const binBuffer = Buffer.from(positions.buffer)

const json = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, mode: 4 }] }],
  accessors: [
    {
      bufferView: 0,
      byteOffset: 0,
      componentType: 5126, // FLOAT
      count: 3,
      type: 'VEC3',
      min: [0, 0, 0],
      max: [1, 1, 0],
    },
  ],
  bufferViews: [
    {
      buffer: 0,
      byteOffset: 0,
      byteLength: binBuffer.length,
      target: 34962, // ARRAY_BUFFER
    },
  ],
  buffers: [{ byteLength: binBuffer.length }],
}

let jsonText = JSON.stringify(json)
let jsonBuffer = Buffer.from(jsonText, 'utf8')
// pad json buffer to 4 bytes
while (jsonBuffer.length % 4 !== 0) jsonBuffer = Buffer.concat([jsonBuffer, Buffer.from(' ')])

let binChunk = binBuffer
while (binChunk.length % 4 !== 0) binChunk = Buffer.concat([binChunk, Buffer.from([0])])

const jsonChunkHeader = Buffer.alloc(8)
jsonChunkHeader.writeUInt32LE(jsonBuffer.length, 0)
jsonChunkHeader.write('JSON', 4, 4, 'ascii')

const binChunkHeader = Buffer.alloc(8)
binChunkHeader.writeUInt32LE(binChunk.length, 0)
binChunkHeader.write('BIN\0', 4, 4, 'ascii')

const header = Buffer.alloc(12)
header.write('glTF', 0, 4, 'ascii')
header.writeUInt32LE(2, 4) // version
const totalLength = 12 + 8 + jsonBuffer.length + 8 + binChunk.length
header.writeUInt32LE(totalLength, 8)

const glb = Buffer.concat([header, jsonChunkHeader, jsonBuffer, binChunkHeader, binChunk])

const outDir = path.join(__dirname, '..', 'public', 'models')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
const outPath = path.join(outDir, 'cheetah.glb')
fs.writeFileSync(outPath, glb)
console.log('Wrote placeholder GLB:', outPath, 'size:', glb.length)
