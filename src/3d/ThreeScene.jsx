import React, { Suspense } from 'react'
import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import Player from './Player'
import MouseLook from './MouseLook'
import Ground from './Ground'
import Rocks from './Rocks'

export default function ThreeScene() {
  const mouseState = useRef({ yaw: 0, pitch: 0, enabled: false })
  const [locked, setLocked] = useState(false)

  return (
    <div className="canvas-container">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 2, -6], fov: 60 }}>
        {/* background and fog to give spatial depth */}
        <color attach="background" args={["#071326"]} />
        <fog attach="fog" args={["#071326", 10, 200]} />

        <ambientLight intensity={0.45} color="#ffffff" />
        <directionalLight castShadow position={[5, 12, 5]} intensity={1.1} color="#ffd8a8" />

        <MouseLook mouseState={mouseState} setLocked={setLocked} />

        <Suspense
          fallback={
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.5, 0.8, 2]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          }
        >
          <Player position={[0, 0.0, 0]} mouseState={mouseState} />
        </Suspense>

        <Ground />
        <Rocks count={18} />

        <Sky sunPosition={[100, 10, 100]} turbidity={6} rayleigh={0.6} />

      </Canvas>
      <div className="ui-hint">WASD — mover</div>
      <div className="ui-hint pointer">
        {locked ? 'Pointer locked — Presiona Esc para salir' : 'Haz click en la escena para habilitar mirar (pointer lock)'}
      </div>
    </div>
  )
}
