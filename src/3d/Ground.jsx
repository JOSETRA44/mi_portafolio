import React, { useMemo, useEffect } from 'react'
import * as THREE from 'three'

// procedural canvas texture
function makeCanvasTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // background
  ctx.fillStyle = '#777d58'
  ctx.fillRect(0, 0, size, size)

  // Subtle grain makes the large plane legible without a repeating vignette.
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const a = Math.random() * 0.12 + 0.02
    ctx.fillStyle = `rgba(224,205,150,${a})`
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
  useEffect(() => () => tex.dispose(), [tex])

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow {...props}>
      <planeGeometry args={[200, 200, 1, 1]} />
      <meshStandardMaterial map={tex} color="#ffffff" metalness={0.05} roughness={0.85} />
    </mesh>
  )
}
