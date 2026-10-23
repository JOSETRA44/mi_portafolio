import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function Rocks({ count = 14 }) {
  const meshRef = useRef()
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
      const angle = rand() * Math.PI * 2
      const distance = 3 + rand() * 26
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance
      const y = 0.02
      const rot = rand() * Math.PI * 2
      const hue = Math.round((20 + (i * 6) % 40))
      const light = Math.round(38 + rand() * 15)
      out.push({ position: [x, y, z], rotation: [0, rot, 0], scale, color: `hsl(${hue},19%,${light}%)` })
    }
    return out
  }, [count])

  useLayoutEffect(() => {
    const transform = new THREE.Object3D()
    rocks.forEach((rock, index) => {
      transform.position.set(...rock.position)
      transform.rotation.set(...rock.rotation)
      transform.scale.setScalar(rock.scale)
      transform.updateMatrix()
      meshRef.current.setMatrixAt(index, transform.matrix)
      meshRef.current.setColorAt(index, new THREE.Color(rock.color))
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.instanceColor.needsUpdate = true
  }, [rocks])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow receiveShadow frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.8} />
    </instancedMesh>
  )
}
