export function movementAxes(keyboard, touch) {
  const pressed = (key) => Boolean(keyboard[key] || touch[key])
  const x = Number(pressed('d') || pressed('arrowright')) - Number(pressed('a') || pressed('arrowleft'))
  const z = Number(pressed('w') || pressed('arrowup')) - Number(pressed('s') || pressed('arrowdown'))
  const magnitude = Math.hypot(x, z)
  return magnitude === 0 ? { x: 0, z: 0 } : { x: x / magnitude, z: z / magnitude }
}

export function shortestAngleDifference(target, current) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current))
}
