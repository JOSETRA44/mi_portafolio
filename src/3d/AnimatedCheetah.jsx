import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function AnimatedCheetah({ speedRef, movingRef, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/cheetah.glb')
  const { actions, mixer } = useAnimations(animations, group)
  const lastWeights = useRef({ idle: 1, walk: 0, run: 0 })

  // helper to find action by name heuristics
  const findAction = (names) => {
    if (!actions) return null
    for (const n of names) {
      if (actions[n]) return actions[n]
      const key = Object.keys(actions).find((k) => k.toLowerCase().includes(n.toLowerCase()))
      if (key) return actions[key]
    }
    return null
  }

  useEffect(() => {
    return () => {
      // cleanup mixer
      if (mixer) {
        mixer.stopAllAction()
      }
    }
  }, [mixer])

  // smoother blending using weights and timeScale based on speed
  useFrame((state, delta) => {
    if (!actions) return

    const idleAction = findAction(['idle', 'Idle'])
    const walkAction = findAction(['walk', 'Walk'])
    const runAction = findAction(['run', 'Run'])

    // compute normalized weights from refs
    const s = Math.max(0, speedRef?.current ?? 0)
    const walk = Math.max(0, Math.min(1, s / 3))
    const run = Math.max(0, Math.min(1, (s - 3) / 3))
    const dominant = Math.max(walk, run)
    const idle = Math.max(0, 1 - dominant)

    // smooth weights by lerping from last weights
    const lerp = (a, b, t) => a + (b - a) * t
    const smoothT = Math.min(1, delta * 6) // smoothing factor
    const wIdle = lerp(lastWeights.current.idle, idle, smoothT)
    const wWalk = lerp(lastWeights.current.walk, walk, smoothT)
    const wRun = lerp(lastWeights.current.run, run, smoothT)
    lastWeights.current = { idle: wIdle, walk: wWalk, run: wRun }

    const setWeight = (action, w) => {
      if (!action) return
      try {
        action.enabled = true
        action.setEffectiveWeight?.(w)
        action.weight = w
        if (!action.isRunning?.()) action.play()
      } catch {
        // fallback to crossfade when setEffectiveWeight not available
        if (w > 0.5) action.play()
      }
    }

    setWeight(idleAction, wIdle)
    setWeight(walkAction, wWalk)
    setWeight(runAction, wRun)

    // adjust playback speed of walk/run to match motion speed
    if (walkAction) walkAction.timeScale = Math.max(0.4, s / 2.5)
    if (runAction) runAction.timeScale = Math.max(0.6, s / 5)

    if (mixer) mixer.update(delta)
  })

  // fallback when no animations: simple idle bob and rotate when moving
  useFrame((state, delta) => {
    if (!group.current) return

    if (!actions || Object.keys(actions).length === 0) {
      const t = state.clock.getElapsedTime()
      const mv = movingRef?.current ?? false
      group.current.rotation.y += (mv ? 1.5 : 0.15) * delta
      group.current.position.y = Math.sin(t * 2) * 0.02
    }
  })

  return <primitive ref={group} object={scene} {...props} />
}

useGLTF.preload('/models/cheetah.glb')