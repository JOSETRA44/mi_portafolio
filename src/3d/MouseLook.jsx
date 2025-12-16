import { useEffect } from 'react'

export default function MouseLook({ mouseState, setLocked }) {
  useEffect(() => {
    const { body } = document

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement != null
      if (mouseState) mouseState.current.enabled = locked
      if (setLocked) setLocked(locked)
    }

    const onMouseMove = (e) => {
      if (!mouseState.current.enabled) return
      const movementX = e.movementX || 0
      const movementY = e.movementY || 0
      // sensitivity
      mouseState.current.yaw -= movementX * 0.002
      mouseState.current.pitch -= movementY * 0.002
      // clamp pitch
      const maxPitch = Math.PI / 3
      const minPitch = -Math.PI / 6
      if (mouseState.current.pitch > maxPitch) mouseState.current.pitch = maxPitch
      if (mouseState.current.pitch < minPitch) mouseState.current.pitch = minPitch
    }

    const onClick = (e) => {
      // request pointer lock on the canvas or body
      const el = document.querySelector('canvas') || body
      if (el && el.requestPointerLock) el.requestPointerLock()
    }

    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('click', onClick)
    }
  }, [mouseState, setLocked])

  return null
}
