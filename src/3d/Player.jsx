import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Cheetah from './Cheetah'
import DustParticles from './DustParticles'
import { movementAxes, shortestAngleDifference } from './movement'

export default function Player({ mouseState, controlsRef, ...props }) {
  const group = useRef()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const forwardVector = useRef(new THREE.Vector3())
  const upAxis = useRef(new THREE.Vector3(0, 1, 0))
  const cameraOffset = useRef(new THREE.Vector3(0, 3.3, -7))
  const desiredCamera = useRef(new THREE.Vector3())
  const target = useRef(new THREE.Vector3())
  const spawnOffset = useRef(new THREE.Vector3())
  const keys = useRef({})
  const speed = 4 // units per second

  const { camera, gl } = useThree()

  useEffect(() => {
    const focusTarget = gl.domElement.closest('[data-scene-focus]')
    const handleDown = (e) => {
      if (document.activeElement !== focusTarget) return
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]')) return
      const key = e.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) e.preventDefault()
      keys.current[key] = true
    }
    const handleUp = (e) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', handleDown)
    window.addEventListener('keyup', handleUp)
    const clearKeys = () => { keys.current = {} }
    window.addEventListener('blur', clearKeys)
    return () => {
      window.removeEventListener('keydown', handleDown)
      window.removeEventListener('keyup', handleUp)
      window.removeEventListener('blur', clearKeys)
    }
  }, [gl])

  // refs to expose motion to the cheetah and effects
  const movingRef = useRef(false)
  const speedRef = useRef(0)
  const spawnRef = useRef(null) // used to signal particle spawn position (world vector)
  const lastStepTime = useRef(0)

  useFrame((state, delta) => {
    if (!group.current) return

    // movement input
    const { x, z } = movementAxes(keys.current, controlsRef.current)

    // Movement follows the camera: W always moves away from the viewer.
    direction.current.set(x, 0, z).applyAxisAngle(upAxis.current, mouseState.current.yaw)

    // if there's input, rotate model to face movement direction and set velocity
    if (direction.current.lengthSq() > 0) {
      // compute angle
      const angle = Math.atan2(direction.current.x, direction.current.z)
      // rotate smoothly towards angle
      const currentY = group.current.rotation.y
      const diff = shortestAngleDifference(angle, currentY)
      group.current.rotation.y += diff * Math.min(12 * delta, 1)

      // forward based on facing
      forwardVector.current.set(0, 0, 1).applyAxisAngle(upAxis.current, group.current.rotation.y).multiplyScalar(speed)
      velocity.current.lerp(forwardVector.current, Math.min(8 * delta, 1))
    } else {
      // damping
      velocity.current.multiplyScalar(Math.max(0, 1 - 6 * delta))
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
      spawnOffset.current.set(0, 0.05, -0.3).applyAxisAngle(upAxis.current, group.current.rotation.y)
      if (!spawnRef.current) spawnRef.current = new THREE.Vector3()
      spawnRef.current.copy(group.current.position).add(spawnOffset.current)
    }

    // apply mouse look offsets if provided
    const yaw = mouseState?.current?.yaw || 0
    const pitch = mouseState?.current?.pitch || 0

    // Orbit stays independent of the cheetah's facing direction.
    desiredCamera.current.copy(cameraOffset.current).applyAxisAngle(upAxis.current, yaw)
    // apply pitch by offsetting the camera's y additionally
    const pitchOffset = Math.sin(pitch) * 2

    desiredCamera.current.add(group.current.position)
    desiredCamera.current.y += pitchOffset

    camera.position.lerp(desiredCamera.current, Math.min(6 * delta, 1))

    // camera look at player but consider pitch
    target.current.copy(group.current.position)
    target.current.y += 1.2 + Math.sin(pitch) * 0.8
    camera.lookAt(target.current)
  })

  // The trail and dust live beside the player so their positions stay in world space.
  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <Cheetah movingRef={movingRef} speedRef={speedRef} scale={[0.8, 0.8, 0.8]} />
      </group>
      <DustParticles spawnRef={spawnRef} enabledRef={movingRef} speedRef={speedRef} />
    </>
  )
}
