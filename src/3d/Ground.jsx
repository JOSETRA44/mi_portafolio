import React, { useMemo } from 'react'
import * as THREE from 'three'

// procedural canvas texture
function makeCanvasTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // background
  ctx.fillStyle = '#08121a'
  ctx.fillRect(0, 0, size, size)

  // radial vignette
  const grd = ctx.createRadialGradient(size / 2, size / 2, size / 8, size / 2, size / 2, size / 1.8)
  grd.addColorStop(0, 'rgba(20,30,50,0.0)')
  grd.addColorStop(1, 'rgba(0,0,0,0.6)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)

  // subtle noise
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const a = (Math.random() * 0.5 + 0.02)
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fillRect(x, y, 1, 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 6)
  texture.anisotropy = 4
  return texture
}

export default function Ground(props) {
  const tex = useMemo(() => makeCanvasTexture(), [])

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow {...props}>
      <planeGeometry args={[200, 200, 1, 1]} />
      <meshStandardMaterial map={tex} color={'#081826'} metalness={0.05} roughness={0.85} />
    </mesh>
  )
}
