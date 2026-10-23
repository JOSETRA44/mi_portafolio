import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const fur = '#d8a65d'
const lightFur = '#efd6a0'
const dark = '#33271f'

const legs = [
  { x: -0.32, z: 0.55, phase: 0 },
  { x: 0.32, z: 0.55, phase: Math.PI },
  { x: -0.32, z: -0.58, phase: Math.PI },
  { x: 0.32, z: -0.58, phase: 0 },
]

const spots = Array.from({ length: 35 }, (_, index) => {
  const row = Math.floor(index / 5)
  const column = index % 5
  const z = -0.72 + row * 0.24 + (column % 2) * 0.04
  const angle = 0.25 + column * 0.66 + (row % 2) * 0.16
  const radius = Math.sqrt(Math.max(0, 1 - z * z))
  return [Math.cos(angle) * 0.46 * radius, 0.94 + Math.sin(angle) * 0.39 * radius, z]
})

function Spots() {
  const meshRef = useRef()

  useLayoutEffect(() => {
    const transform = new THREE.Object3D()
    spots.forEach((position, index) => {
      transform.position.set(...position)
      transform.scale.set(0.045, 0.022, 0.055)
      transform.updateMatrix()
      meshRef.current.setMatrixAt(index, transform.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={meshRef} args={[null, null, spots.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 5]} />
      <meshStandardMaterial color={dark} />
    </instancedMesh>
  )
}

export default function Cheetah({ movingRef, speedRef, ...props }) {
  const bodyRef = useRef()
  const tailRef = useRef()
  const legRefs = useRef([])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const speed = Math.min(1, (speedRef.current ?? 0) / 4)
    const stride = time * (4 + speed * 8)
    if (bodyRef.current) bodyRef.current.position.y = Math.sin(stride * 2) * 0.025 * speed
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(time * 2.4) * 0.22
    legRefs.current.forEach((leg, index) => {
      if (leg) leg.rotation.x = Math.sin(stride + legs[index].phase) * 0.5 * speed
    })
    if (!movingRef.current && bodyRef.current) bodyRef.current.position.y = Math.sin(time * 1.8) * 0.012
  })

  return (
    <group {...props}>
      <group ref={bodyRef}>
        <mesh position={[0, 0.94, 0]} scale={[0.46, 0.39, 1]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color={fur} roughness={0.9} /></mesh>
        <mesh position={[0, 1.02, 0.72]} scale={[0.33, 0.4, 0.35]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={lightFur} /></mesh>
        <mesh position={[0, 1.2, 0.93]} scale={[0.32, 0.27, 0.34]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={fur} /></mesh>
        <mesh position={[0, 1.08, 1.18]} scale={[0.21, 0.12, 0.2]} castShadow><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={lightFur} /></mesh>
        <mesh position={[0, 1.08, 1.37]} scale={[0.07, 0.05, 0.05]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={dark} /></mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.23, 1.42, 0.87]} scale={[0.1, 0.15, 0.09]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={dark} /></mesh>
            <mesh position={[side * 0.18, 1.24, 1.2]} scale={[0.055, 0.045, 0.025]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={dark} /></mesh>
            <mesh position={[side * 0.19, 1.17, 1.22]} scale={[0.025, 0.09, 0.015]} rotation-z={side * 0.2}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={dark} /></mesh>
          </group>
        ))}
        <Spots />
        <group ref={tailRef} position={[0, 1.05, -0.9]}>
          <mesh position={[0, 0.04, -0.23]} rotation-x={-0.18} scale={[0.09, 0.1, 0.38]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={fur} /></mesh>
          <mesh position={[0, 0.15, -0.55]} rotation-x={-0.45} scale={[0.08, 0.1, 0.27]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={dark} /></mesh>
        </group>
      </group>
      {legs.map((leg, index) => (
        <group key={index} ref={(node) => { legRefs.current[index] = node }} position={[leg.x, 0.78, leg.z]}>
          <mesh position={[0, -0.24, 0]} scale={[0.11, 0.32, 0.12]} castShadow><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={fur} /></mesh>
          <mesh position={[0, -0.54, 0.04]} scale={[0.085, 0.24, 0.09]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={lightFur} /></mesh>
          <mesh position={[0, -0.71, 0.12]} scale={[0.13, 0.07, 0.19]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={dark} /></mesh>
        </group>
      ))}
    </group>
  )
}
