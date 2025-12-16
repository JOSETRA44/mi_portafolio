import React from 'react'
import ThreeScene from '../3d/ThreeScene'

export default function Home() {
  return (
    <main className="page home">
      <h1>Mi Portafolio 3D</h1>
      <p>Explora un mundo 3D y navega con tu guepardo (cheetah).</p>
      <ThreeScene />
    </main>
  )
}
