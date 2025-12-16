import React, { useRef, useMemo } from 'react'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Trail implemented as a set of glowy points (sprites) with per-point alpha.
// Records the player's position only when moving and when distance > sampleDistance.
export default function Trail({ targetRef, enabledRef, speedRef, length = 24, color = '#ffb86b', sampleDistance = 0.12, pointSize = 18 }) {
  const geomRef = useRef()
  const points = useRef(Array.from({ length }, () => new THREE.Vector3()))
  const alphas = useRef(new Float32Array(length).fill(0))
  const lastPos = useRef(new THREE.Vector3())

  // pre-alloc attribute buffers
  const buffers = useMemo(() => {
    const pos = new Float32Array(length * 3)
    const a = new Float32Array(length)
    for (let i = 0; i < length; i++) a[i] = 0
    return { pos, a }
  }, [length])

  // simple LIFO circular shift for positions
  function pushPoint(vec) {
    points.current.shift()
    points.current.push(vec.clone())
  }

  const ctrl = useControls('Trail', {
    enabled: true,
    color: { value: color },
    pointSize: { value: pointSize, min: 2, max: 64 },
    sampleDistance: { value: sampleDistance, min: 0, max: 1, step: 0.01 }
  })

  useFrame((state, delta) => {
    if (!geomRef.current || !targetRef?.current) return

    if (!ctrl.enabled) return

    const p = targetRef.current.position ? targetRef.current.position : targetRef.current
    const running = enabledRef?.current
    const sp = speedRef?.current ?? 0

    // add point only when moving and moved enough, sampleDistance scales with speed
    const minDist = ctrl.sampleDistance + sp * 0.02
    if (running) {
      if (lastPos.current.distanceToSquared(p) > minDist * minDist) {
        lastPos.current.copy(p)
        // a little lift so it sits above ground
        pushPoint(new THREE.Vector3(p.x, p.y + 0.08, p.z))
      }
    } else {
      // when idle, slowly lerp head toward player
      const head = points.current[points.current.length - 1]
      head.lerp(new THREE.Vector3(p.x, p.y + 0.08, p.z), Math.min(1, delta * 1.6))
    }

    // write buffers
    for (let i = 0; i < points.current.length; i++) {
      buffers.pos[i * 3 + 0] = points.current[i].x
      buffers.pos[i * 3 + 1] = points.current[i].y
      buffers.pos[i * 3 + 2] = points.current[i].z
      // alpha ramp (head is highest alpha)
      buffers.a[i] = i / points.current.length
    }

    geomRef.current.setAttribute('position', new THREE.BufferAttribute(buffers.pos, 3))
    geomRef.current.setAttribute('alpha', new THREE.BufferAttribute(buffers.a, 1))
    geomRef.current.attributes.position.needsUpdate = true
    geomRef.current.attributes.alpha.needsUpdate = true
  })

  // shader material for round glowy points with per-vertex alpha
  const ctrlMat = useControls('Trail-Material', { pointSizeVal: { value: pointSize, min: 2, max: 64 } })
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(ctrl.color) }, uPointSize: { value: ctrlMat.pointSizeVal } },
      vertexShader: `
        attribute float alpha;
        uniform float uPointSize;
        varying float vAlpha;
        void main(){
          vAlpha = alpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uPointSize * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main(){
          float dist = length(gl_PointCoord - vec2(0.5));
          float mask = smoothstep(0.5, 0.45, dist);
          gl_FragColor = vec4(uColor, vAlpha * mask);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }, [color, ctrlMat.pointSizeVal])

  return (
    <points>
      <bufferGeometry ref={geomRef} />
      <primitive object={material} attach="material" />
    </points>
  )
}
