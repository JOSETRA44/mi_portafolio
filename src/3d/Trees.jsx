import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function createTrees(count) {
  let seed = 7319
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
  return Array.from({ length: count }, () => {
    const angle = random() * Math.PI * 2
    const distance = 8 + random() * 38
    return {
      x: Math.cos(angle) * distance,
      z: Math.sin(angle) * distance,
      size: 0.7 + random() * 1.3,
      color: new THREE.Color().setHSL(0.29 + random() * 0.07, 0.24 + random() * 0.12, 0.24 + random() * 0.1),
    }
  })
}

export default function Trees({ count = 64 }) {
  const trunkRef = useRef()
  const crownRef = useRef()
  const trees = useMemo(() => createTrees(count), [count])

  useLayoutEffect(() => {
    const object = new THREE.Object3D()
    trees.forEach((tree, index) => {
      object.position.set(tree.x, tree.size * 0.8, tree.z)
      object.scale.set(0.16 * tree.size, 1.6 * tree.size, 0.16 * tree.size)
      object.rotation.set(0, 0, 0)
      object.updateMatrix()
      trunkRef.current.setMatrixAt(index, object.matrix)

      object.position.y = tree.size * 2.15
      object.scale.set(tree.size * 1.1, tree.size * 2.25, tree.size * 1.1)
      object.rotation.y = index * 1.9
      object.updateMatrix()
      crownRef.current.setMatrixAt(index, object.matrix)
      crownRef.current.setColorAt(index, tree.color)
    })
    trunkRef.current.instanceMatrix.needsUpdate = true
    crownRef.current.instanceMatrix.needsUpdate = true
    crownRef.current.instanceColor.needsUpdate = true
  }, [trees])

  return (
    <>
      <instancedMesh ref={trunkRef} args={[null, null, count]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.8, 1, 5]} />
        <meshStandardMaterial color="#6a5040" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[null, null, count]} castShadow receiveShadow>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </instancedMesh>
    </>
  )
}
