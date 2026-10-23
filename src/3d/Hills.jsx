const hills = [
  { position: [-43, -2.5, 55], scale: [22, 9, 12], color: '#677f72' },
  { position: [-12, -3, 62], scale: [29, 12, 14], color: '#748a78' },
  { position: [31, -3.5, 58], scale: [27, 10, 13], color: '#607a6e' },
  { position: [59, -3, 22], scale: [19, 8, 18], color: '#729080' },
  { position: [-56, -2.5, 0], scale: [19, 8, 22], color: '#6c8274' },
]

export default function Hills() {
  return hills.map((hill) => (
    <mesh key={hill.position.join(',')} position={hill.position} scale={hill.scale} receiveShadow>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={hill.color} roughness={1} flatShading />
    </mesh>
  ))
}
