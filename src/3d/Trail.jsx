import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Trail implemented as a set of glowy points (sprites) with per-point alpha.
// Records the player's position only when moving and when distance > sampleDistance.
export default function Trail({ targetRef, enabledRef, speedRef, length = 24, color = '#ffb86b', sampleDistance = 0.12, pointSize = 18 }) {
  const geomRef = useRef()
  const points = useRef([])
  const lastPos = useRef(new THREE.Vector3())

  // pre-alloc attribute buffers
  const buffersRef = useRef(null)
  useEffect(() => {
    const pos = new Float32Array(length * 3)
    const a = new Float32Array(length)
    buffersRef.current = { pos, a }
    geomRef.current.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geomRef.current.setAttribute('alpha', new THREE.BufferAttribute(a, 1))
  }, [length])

  useFrame(() => {
    if (!geomRef.current || !buffersRef.current || !targetRef?.current) return
    const buffers = buffersRef.current

    const p = targetRef.current.position ? targetRef.current.position : targetRef.current
    const running = enabledRef?.current
    const sp = speedRef?.current ?? 0

    const minDist = sampleDistance + sp * 0.02
    if (running) {
      if (points.current.length === 0 || lastPos.current.distanceToSquared(p) > minDist * minDist) {
        lastPos.current.copy(p)
        points.current.push(new THREE.Vector3(p.x, p.y + 0.08, p.z))
        if (points.current.length > length) points.current.shift()
      }
    } else {
      points.current.length = 0
    }

    // write buffers
    for (let i = 0; i < points.current.length; i++) {
      buffers.pos[i * 3 + 0] = points.current[i].x
      buffers.pos[i * 3 + 1] = points.current[i].y
      buffers.pos[i * 3 + 2] = points.current[i].z
      // alpha ramp (head is highest alpha)
      buffers.a[i] = (i + 1) / points.current.length
    }

    geomRef.current.setDrawRange(0, points.current.length)
    geomRef.current.attributes.position.needsUpdate = true
    geomRef.current.attributes.alpha.needsUpdate = true
  })

  // shader material for round glowy points with per-vertex alpha
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uPointSize: { value: pointSize } },
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
          float mask = 1.0 - smoothstep(0.35, 0.5, dist);
          gl_FragColor = vec4(uColor, vAlpha * mask);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }, [color, pointSize])

  useEffect(() => () => material.dispose(), [material])

  return (
    <points>
      <bufferGeometry ref={geomRef} />
      <primitive object={material} attach="material" />
    </points>
  )
}
