import React, { lazy, Suspense } from 'react'

const ThreeScene = lazy(() => import('../3d/ThreeScene'))

export default function Home() {
  return (
    <main className="page home">
      <h1>Mi Portafolio 3D</h1>
      <p>Explora un mundo 3D y navega con tu guepardo (cheetah).</p>
      <Suspense fallback={<div className="scene-loading" role="status">Cargando escena 3D…</div>}>
        <ThreeScene />
      </Suspense>
    </main>
  )
}
