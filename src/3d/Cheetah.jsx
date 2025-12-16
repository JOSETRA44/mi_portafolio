import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Cheetah(props) {
  // The scene will try to load /models/cheetah.glb from public/
  // Replace that file with your optimized .glb later.
  const { scene } = useGLTF('/models/cheetah.glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('/models/cheetah.glb')
