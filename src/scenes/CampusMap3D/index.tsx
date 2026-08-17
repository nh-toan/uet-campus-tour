import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

const CAMERA_CONFIG = {
  position: [3, 2, 5] as [number, number, number],
  fov: 50,
}
const BOX_SIZE: [number, number, number] = [1.5, 1.5, 1.5]
const KEY_LIGHT_POSITION: [number, number, number] = [3, 4, 2]
const MAX_POLAR_ANGLE = Math.PI / 2
const ROTATION_SPEED_X = 0.18
const ROTATION_SPEED_Y = 0.3

interface RotatingBoxProps {
  color: string
}

function RotatingBox({ color }: RotatingBoxProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    mesh.rotation.x += delta * ROTATION_SPEED_X
    mesh.rotation.y += delta * ROTATION_SPEED_Y
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={BOX_SIZE} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

interface CampusMap3DProps {
  accentColor: string
}

export function CampusMap3D({ accentColor }: CampusMap3DProps) {
  return (
    <Canvas camera={CAMERA_CONFIG}>
      <ambientLight intensity={0.8} />
      <directionalLight intensity={1.4} position={KEY_LIGHT_POSITION} />
      <RotatingBox color={accentColor} />
      <OrbitControls maxPolarAngle={MAX_POLAR_ANGLE} />
    </Canvas>
  )
}
