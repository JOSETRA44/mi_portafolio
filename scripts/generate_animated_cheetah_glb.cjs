// Generates an animated GLB with simple Idle/Walk/Run clips for testing.
// Run with: node scripts/generate_animated_cheetah_glb.cjs

const fs = require('fs')
const path = require('path')

function padBuffer(b) {
  while (b.length % 4 !== 0) b = Buffer.concat([b, Buffer.from([0])])
  return b
}

// simple triangle mesh positions (3 verts)
const positions = new Float32Array([0.0, 0.0, 0.0,  1.0, 0.0, 0.0,  0.0, 1.0, 0.0])
const positionsBuf = Buffer.from(positions.buffer)

// Animation data
// Idle: small rotation around X
const idleTimes = new Float32Array([0.0, 0.5, 1.0])
const angle = 0.15 // radians
const sinHalf = Math.sin(angle / 2)
const cosHalf = Math.cos(angle / 2)
const idleRots = new Float32Array([
  0, 0, 0, 1,
  sinHalf, 0, 0, cosHalf,
  0, 0, 0, 1,
])

// Walk: slow z bob
const walkTimes = new Float32Array([0.0, 0.5, 1.0])
const walkTrans = new Float32Array([
  0, 0, 0,
  0, 0, 0.2,
  0, 0, 0,
])

// Run: faster, longer stride
const runTimes = new Float32Array([0.0, 0.25, 0.5])
const runTrans = new Float32Array([
  0, 0, 0,
  0, 0, 0.6,
  0, 0, 0,
])

// concatenate binary data in a known order: positions, idleTimes, idleRots, walkTimes, walkTrans, runTimes, runTrans
let binBuffers = []
let offset = 0

const blob = Buffer.concat([
  positionsBuf
])

// helper to push and record offsets
function pushBuf(b) {
  const buf = Buffer.from(b.buffer ? b.buffer : b)
  const padded = padBuffer(buf)
  const len = padded.length
  const off = offset
  offset += len
  binBuffers.push(padded)
  return { byteOffset: off, byteLength: len }
}

const posInfo = pushBuf(positions)
const idleTimesInfo = pushBuf(idleTimes)
const idleRotsInfo = pushBuf(idleRots)
const walkTimesInfo = pushBuf(walkTimes)
const walkTransInfo = pushBuf(walkTrans)
const runTimesInfo = pushBuf(runTimes)
const runTransInfo = pushBuf(runTrans)

// Build json
const json = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [
    {
      name: 'Cheetah',
      mesh: 0,
      translation: [0, 0, 0],
    },
  ],
  meshes: [
    {
      primitives: [
        {
          attributes: { POSITION: 0 },
          mode: 4,
        },
      ],
    },
  ],
  accessors: [
    // 0 POSITION
    {
      bufferView: 0,
      byteOffset: 0,
      componentType: 5126,
      count: 3,
      type: 'VEC3',
      min: [0, 0, 0],
      max: [1, 1, 0],
    },
    // 1 idleTimes (SCALAR)
    {
      bufferView: 1,
      byteOffset: 0,
      componentType: 5126,
      count: idleTimes.length,
      type: 'SCALAR',
    },
    // 2 idleRots (VEC4)
    {
      bufferView: 2,
      byteOffset: 0,
      componentType: 5126,
      count: idleRots.length / 4,
      type: 'VEC4',
    },
    // 3 walkTimes
    {
      bufferView: 3,
      byteOffset: 0,
      componentType: 5126,
      count: walkTimes.length,
      type: 'SCALAR',
    },
    // 4 walkTrans (VEC3)
    {
      bufferView: 4,
      byteOffset: 0,
      componentType: 5126,
      count: walkTrans.length / 3,
      type: 'VEC3',
    },
    // 5 runTimes
    {
      bufferView: 5,
      byteOffset: 0,
      componentType: 5126,
      count: runTimes.length,
      type: 'SCALAR',
    },
    // 6 runTrans
    {
      bufferView: 6,
      byteOffset: 0,
      componentType: 5126,
      count: runTrans.length / 3,
      type: 'VEC3',
    },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: posInfo.byteOffset, byteLength: posInfo.byteLength, target: 34962 },
    { buffer: 0, byteOffset: idleTimesInfo.byteOffset, byteLength: idleTimesInfo.byteLength },
    { buffer: 0, byteOffset: idleRotsInfo.byteOffset, byteLength: idleRotsInfo.byteLength },
    { buffer: 0, byteOffset: walkTimesInfo.byteOffset, byteLength: walkTimesInfo.byteLength },
    { buffer: 0, byteOffset: walkTransInfo.byteOffset, byteLength: walkTransInfo.byteLength },
    { buffer: 0, byteOffset: runTimesInfo.byteOffset, byteLength: runTimesInfo.byteLength },
    { buffer: 0, byteOffset: runTransInfo.byteOffset, byteLength: runTransInfo.byteLength },
  ],
  buffers: [{ byteLength: offset }],
  animations: [
    {
      name: 'Idle',
      samplers: [
        { input: 1, output: 2, interpolation: 'LINEAR' },
      ],
      channels: [
        { sampler: 0, target: { node: 0, path: 'rotation' } },
      ],
    },
    {
      name: 'Walk',
      samplers: [
        { input: 3, output: 4, interpolation: 'LINEAR' },
      ],
      channels: [
        { sampler: 0, target: { node: 0, path: 'translation' } },
      ],
    },
    {
      name: 'Run',
      samplers: [
        { input: 5, output: 6, interpolation: 'LINEAR' },
      ],
      channels: [
        { sampler: 0, target: { node: 0, path: 'translation' } },
      ],
    },
  ],
}

let jsonText = JSON.stringify(json)
let jsonBuffer = Buffer.from(jsonText, 'utf8')
// pad json buffer to 4 bytes
while (jsonBuffer.length % 4 !== 0) jsonBuffer = Buffer.concat([jsonBuffer, Buffer.from(' ')])

const binChunk = Buffer.concat(binBuffers)

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
console.log('Wrote animated GLB:', outPath, 'size:', glb.length)
