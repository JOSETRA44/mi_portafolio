import React, { useMemo } from 'react'
import * as THREE from 'three'

export default function Rocks({ count = 14 }) {
  const rocks = useMemo(() => {
    const out = []
    for (let i = 0; i < count; i++) {
      const scale = 0.12 + Math.random() * 0.6
      const x = (Math.random() - 0.5) * 120
      const z = (Math.random() - 0.5) * 120
      const y = 0.02
      const rot = Math.random() * Math.PI * 2
      out.push({ position: [x, y, z], rotation: [0, rot, 0], scale })
    }
    return out
  }, [count])

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.position} rotation={r.rotation} scale={[r.scale, r.scale, r.scale]} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={`hsl(${20 + i * 6 % 40}, 30%, ${20 + Math.random() * 10}%)`} metalness={0.1} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
