import React, { useMemo } from 'react'
import * as THREE from 'three'

export default function Rocks({ count = 14 }) {
  // deterministic pseudo-random generator (LCG) so results are stable across renders
  const rocks = useMemo(() => {
    const out = []
    let seed = 12345
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0xffffffff
    }
    for (let i = 0; i < count; i++) {
      const scale = 0.12 + rand() * 0.6
      const x = (rand() - 0.5) * 120
      const z = (rand() - 0.5) * 120
      const y = 0.02
      const rot = rand() * Math.PI * 2
      const hue = Math.round((20 + (i * 6) % 40))
      const light = Math.round(20 + rand() * 10)
      out.push({ position: [x, y, z], rotation: [0, rot, 0], scale, color: `hsl(${hue},30%,${light}%)` })
    }
    return out
  }, [count])

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.position} rotation={r.rotation} scale={[r.scale, r.scale, r.scale]} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={r.color} metalness={0.1} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
