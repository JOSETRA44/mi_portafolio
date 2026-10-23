import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simple instanced particle system: spawns small particles behind the player when running
export default function DustParticles({ count = 40, spawnRef, enabledRef, speedRef, color = '#f3d7b6' }) {
  const meshRef = useRef()
  const pool = useRef([])
  const dummyRef = useRef(new THREE.Object3D())

  const lifeArrayRef = useRef(null)
  useEffect(() => {
    pool.current = Array.from({ length: count }, () => ({ pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0, size: 1, active: false, maxLife: 0 }))
    lifeArrayRef.current = new Float32Array(count)
    meshRef.current.geometry.setAttribute('aLife', new THREE.InstancedBufferAttribute(lifeArrayRef.current, 1))
  }, [count])

  const particleMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) } },
      vertexShader: `
        attribute float aLife;
        varying float vLife;
        void main(){
          vLife = aLife;
          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vLife;
        void main(){
          float alpha = smoothstep(0.0, 1.0, vLife);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }, [color])

  useEffect(() => () => particleMat.dispose(), [particleMat])

  useFrame((state, delta) => {
    if (!meshRef.current || !lifeArrayRef.current) return
    const lifeArray = lifeArrayRef.current

    // spawn particles when enabled and spawnRef indicates a step
    if (enabledRef?.current && spawnRef?.current) {
      // spawn count scaled by speed
      const sp = speedRef?.current ?? 0
      const spawnCount = Math.min(4, Math.max(1, Math.round(1 + sp * 0.5)))
      for (let s = 0; s < spawnCount; s++) {
        const p = pool.current.find((x) => !x.active)
        if (!p) break
        p.active = true
        p.life = 0.5 + Math.random() * 0.6 + sp * 0.2
        p.maxLife = p.life
        // position near spawnRef
        const base = spawnRef.current
        p.pos.set(base.x + (Math.random() - 0.5) * 0.35, base.y + 0.02, base.z + (Math.random() - 0.5) * 0.35)
        p.vel.set((Math.random() - 0.5) * (0.6 + sp * 0.6), 0.3 + Math.random() * (0.6 + sp * 0.6), (Math.random() - 0.5) * (0.6 + sp * 0.6))
        p.size = 0.02 + Math.random() * 0.06 + sp * 0.02
      }
      spawnRef.current = null
    }

    // update instances
    const dummy = dummyRef.current
    let idx = 0
    for (let i = 0; i < pool.current.length; i++) {
      const p = pool.current[i]
      if (!p.active) {
        continue
      }
      p.life -= delta
      if (p.life <= 0) {
        p.active = false
        continue
      }
      // simple physics
      p.vel.y -= 1.4 * delta
      p.pos.addScaledVector(p.vel, delta)
      dummy.position.copy(p.pos)
      const s = p.size * Math.max(0.001, p.life / p.maxLife)
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(idx, dummy.matrix)
      // normalized life for shader
      lifeArray[idx] = p.life / p.maxLife
      idx++
    }
    meshRef.current.count = idx
    if (meshRef.current.instanceMatrix) meshRef.current.instanceMatrix.needsUpdate = true
    // update instanced life attribute
    if (meshRef.current.geometry) {
      meshRef.current.geometry.attributes.aLife.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <primitive object={particleMat} attach="material" />
    </instancedMesh>
  )
}
