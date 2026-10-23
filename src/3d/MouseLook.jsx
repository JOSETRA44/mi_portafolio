import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export default function MouseLook({ mouseState, setDragging }) {
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement
    let lastX = 0
    let lastY = 0
    const onPointerDown = (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return
      canvas.focus()
      canvas.setPointerCapture(event.pointerId)
      lastX = event.clientX
      lastY = event.clientY
      mouseState.current.dragging = true
      setDragging(true)
    }
    const onPointerMove = (event) => {
      if (!mouseState.current.dragging) return
      mouseState.current.yaw -= (event.clientX - lastX) * 0.005
      mouseState.current.pitch = Math.max(-0.3, Math.min(0.65, mouseState.current.pitch + (event.clientY - lastY) * 0.004))
      lastX = event.clientX
      lastY = event.clientY
    }
    const onPointerEnd = () => {
      mouseState.current.dragging = false
      setDragging(false)
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerEnd)
    canvas.addEventListener('pointercancel', onPointerEnd)
    canvas.addEventListener('lostpointercapture', onPointerEnd)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerEnd)
      canvas.removeEventListener('pointercancel', onPointerEnd)
      canvas.removeEventListener('lostpointercapture', onPointerEnd)
    }
  }, [gl, mouseState, setDragging])

  return null
}
