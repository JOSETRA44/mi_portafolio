import React, { Suspense } from 'react'
import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Player from './Player'
import MouseLook from './MouseLook'
import Ground from './Ground'
import Rocks from './Rocks'
import Trees from './Trees'
import Hills from './Hills'

export default function ThreeScene() {
  const mouseState = useRef({ yaw: 0, pitch: 0, dragging: false })
  const controlsRef = useRef({ w: false, a: false, s: false, d: false })
  const [dragging, setDragging] = useState(false)

  return (
    <div className="canvas-container">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 3.3, -7], fov: 58 }} tabIndex={0} data-scene-focus="" aria-label="Escena interactiva. Usa W, A, S, D o las flechas para mover al guepardo. Arrastra para girar la cámara.">
        {/* background and fog to give spatial depth */}
        <color attach="background" args={["#b4c6bd"]} />
        <fog attach="fog" args={["#b4c6bd", 38, 105]} />

        <hemisphereLight intensity={1.45} color="#e4eee5" groundColor="#746b52" />
        <directionalLight castShadow position={[-8, 15, -5]} intensity={2} color="#ffdfb2" shadow-mapSize={[1024, 1024]} shadow-camera-left={-34} shadow-camera-right={34} shadow-camera-top={34} shadow-camera-bottom={-34} />

        <MouseLook mouseState={mouseState} setDragging={setDragging} />

        <Suspense
          fallback={
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.5, 0.8, 2]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          }
        >
          <Player position={[0, 0.0, 0]} mouseState={mouseState} controlsRef={controlsRef} />
        </Suspense>

        <Ground />
        <Rocks count={24} />
        <Trees />
        <Hills />

      </Canvas>
      <div className="touch-controls" aria-label="Controles de movimiento">
        {[
          ['w', '↑', 'Avanzar'], ['a', '←', 'Mover a la izquierda'],
          ['s', '↓', 'Retroceder'], ['d', '→', 'Mover a la derecha'],
        ].map(([key, symbol, label]) => (
          <button key={key} type="button" aria-label={label}
            onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); controlsRef.current[key] = true }}
            onPointerUp={() => { controlsRef.current[key] = false }}
            onPointerCancel={() => { controlsRef.current[key] = false }}
            onLostPointerCapture={() => { controlsRef.current[key] = false }}>
            {symbol}
          </button>
        ))}
      </div>
      <div className="scene-badge"><span className="scene-badge-dot" /> Explora el paisaje</div>
      <div className="ui-hint ui-hint-desktop">{dragging ? 'Gira para mirar alrededor' : 'Clic en la escena · WASD o flechas para caminar · Arrastra para mirar'}</div>
      <div className="ui-hint ui-hint-mobile">Usa las flechas para caminar · Arrastra el paisaje para mirar</div>
    </div>
  )
}
