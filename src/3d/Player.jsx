import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import AnimatedCheetah from './AnimatedCheetah'
import Trail from './Trail'
import DustParticles from './DustParticles'

export default function Player(props) {
  const group = useRef()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const keys = useRef({})
  const speed = 4 // units per second

  useEffect(() => {
    const handleDown = (e) => {
      keys.current[e.key.toLowerCase()] = true
    }
    const handleUp = (e) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', handleDown)
    window.addEventListener('keyup', handleUp)
    return () => {
      window.removeEventListener('keydown', handleDown)
      window.removeEventListener('keyup', handleUp)
    }
  }, [])

  // camera follow logic
  const { camera } = useThree()
  const cameraOffset = new THREE.Vector3(0, 2.2, 5)
  const target = new THREE.Vector3()

  // refs to expose motion to animated cheetah and effects
  const movingRef = useRef(false)
  const speedRef = useRef(0)
  const spawnRef = useRef(null) // used to signal particle spawn position (world vector)
  const lastStepTime = useRef(0)

  useFrame((state, delta) => {
    if (!group.current) return

    // movement input
    const forward = keys.current['w'] ? 1 : keys.current['s'] ? -1 : 0
    const right = keys.current['d'] ? 1 : keys.current['a'] ? -1 : 0

    // compute direction relative to world
    direction.current.set(right, 0, forward).normalize()

    // if there's input, rotate model to face movement direction and set velocity
    if (direction.current.lengthSq() > 0) {
      // compute angle
      const angle = Math.atan2(direction.current.x, direction.current.z)
      // rotate smoothly towards angle
      const currentY = group.current.rotation.y
      const diff = angle - currentY
      group.current.rotation.y += diff * Math.min(12 * delta, 1)

      // forward based on facing
      const forwardVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), group.current.rotation.y)
      velocity.current.lerp(forwardVec.multiplyScalar(speed), 8 * delta)
    } else {
      // damping
      velocity.current.lerp(new THREE.Vector3(0, 0, 0), 6 * delta)
    }

    // apply movement
    group.current.position.addScaledVector(velocity.current, delta)

    // update motion refs
    const speedMag = velocity.current.length()
    speedRef.current = speedMag
    movingRef.current = speedMag > 0.05

    // spawn particles when stepping (every fixed interval while moving)
    const now = state.clock.getElapsedTime()
    if (movingRef.current && now - lastStepTime.current > Math.max(0.09, 0.4 - speedMag * 0.06)) {
      lastStepTime.current = now
      // spawn point slightly behind player
      spawnRef.current = group.current.position.clone().add(new THREE.Vector3(0, 0.05, -0.3).applyAxisAngle(new THREE.Vector3(0,1,0), group.current.rotation.y))
    }

    // speed-based visual effect (run glow)
    const glowScale = Math.min(1, speedMag / speed)
    if (group.current.getObjectByName) {
      const glow = group.current.getObjectByName('__run_glow')
      if (glow && glow.material) {
        glow.visible = glowScale > 0.05
        glow.material.emissiveIntensity = 0.3 + glowScale * 2.5
        glow.material.emissive.set(`#ff7a18`)
        glow.scale.setScalar(1 + glowScale * 1.4)
      }
    }

    // apply mouse look offsets if provided
    const yaw = props.mouseState?.current?.yaw || 0
    const pitch = props.mouseState?.current?.pitch || 0

    // camera desired position (rotate offset by player rotation + yaw)
    const totalYaw = group.current.rotation.y + yaw
    const offsetRotated = cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), totalYaw)
    // apply pitch by offsetting the camera's y additionally
    const pitchOffset = Math.sin(pitch) * 2

    const desiredCamPos = group.current.position.clone().add(offsetRotated)
    desiredCamPos.y += pitchOffset

    camera.position.lerp(desiredCamPos, 6 * delta)

    // camera look at player but consider pitch
    target.copy(group.current.position).add(new THREE.Vector3(0, 1.2 + Math.sin(pitch) * 0.8, 0))
    camera.lookAt(target)
  })

  // render single consistent structure: glow + animated cheetah
  return (
    <group ref={group} {...props} dispose={null}>
          <mesh name="__run_glow" position={[0, 0.3, -0.6]} visible={false}>
        <torusGeometry args={[0.32, 0.06, 8, 32]} />
        <meshStandardMaterial emissive="#ff7a18" emissiveIntensity={0} metalness={0.2} roughness={0.4} />
      </mesh>
      <AnimatedCheetah movingRef={movingRef} speedRef={speedRef} scale={[0.8, 0.8, 0.8]} />

      {/* effects tied to player */}
      <Trail targetRef={group} enabledRef={movingRef} speedRef={speedRef} />
      <DustParticles spawnRef={spawnRef} enabledRef={movingRef} speedRef={speedRef} />
    </group>
  )
}



