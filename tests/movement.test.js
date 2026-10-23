import test from 'node:test'
import assert from 'node:assert/strict'
import { movementAxes, shortestAngleDifference } from '../src/3d/movement.js'

test('opposite movement inputs cancel and touch combines with keyboard', () => {
  assert.deepEqual(movementAxes({ w: true, s: true }, {}), { x: 0, z: 0 })
  assert.deepEqual(movementAxes({ w: true }, { s: true }), { x: 0, z: 0 })
})

test('diagonal movement has the same maximum speed as straight movement', () => {
  const axes = movementAxes({ w: true, d: true }, {})
  assert.ok(Math.abs(Math.hypot(axes.x, axes.z) - 1) < 1e-12)
  assert.ok(axes.x > 0 && axes.z > 0)
})

test('arrow keys use the same directions as WASD', () => {
  assert.deepEqual(movementAxes({ arrowup: true, arrowleft: true }, {}), movementAxes({ w: true, a: true }, {}))
  assert.deepEqual(movementAxes({ arrowdown: true }, {}), { x: 0, z: -1 })
})

test('rotation takes the short path across the -π/π boundary', () => {
  const difference = shortestAngleDifference(-Math.PI + 0.1, Math.PI - 0.1)
  assert.ok(Math.abs(difference - 0.2) < 1e-12)
})
