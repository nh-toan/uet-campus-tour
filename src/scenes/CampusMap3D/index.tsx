import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { hotspots } from '../../config/hotspots.config'

const CAMERA_CONFIG = {
  position: [10, 8, 14] as [number, number, number],
  fov: 45,
}
const BUILDING_SIZES: [number, number, number][] = [
  [3.6, 1.2, 1.1],
  [3.8, 2.8, 3],
  [2.8, 3.4, 2.6],
]
const GROUND_SIZE: [number, number] = [18, 16]
const KEY_LIGHT_POSITION: [number, number, number] = [6, 10, 8]
const CONTROL_TARGET: [number, number, number] = [0, 1, 1]
const MIN_CAMERA_DISTANCE = 7
const MAX_CAMERA_DISTANCE = 24
const MAX_POLAR_ANGLE = Math.PI / 2.05

interface SceneColors {
  buildingGate: string
  buildingAcademic: string
  buildingLibrary: string
  ground: string
}

interface CampusMap3DProps {
  colors: SceneColors
}

export function CampusMap3D({ colors }: CampusMap3DProps) {
  const buildingColors = [
    colors.buildingGate,
    colors.buildingAcademic,
    colors.buildingLibrary,
  ]

  return (
    <Canvas camera={CAMERA_CONFIG}>
      <ambientLight intensity={1.1} />
      <directionalLight intensity={1.6} position={KEY_LIGHT_POSITION} />

      {hotspots.map((hotspot, index) => {
        const size = BUILDING_SIZES[index] ?? BUILDING_SIZES[0]
        const color = buildingColors[index] ?? colors.buildingGate

        return (
          <mesh
            key={hotspot.buildingId}
            name={hotspot.buildingId}
            position={[hotspot.position[0], size[1] / 2, hotspot.position[2]]}
          >
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} roughness={0.72} />
          </mesh>
        )
      })}

      <mesh position={[0, -0.04, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={GROUND_SIZE} />
        <meshStandardMaterial color={colors.ground} roughness={0.95} />
      </mesh>

      <OrbitControls
        enableDamping
        maxDistance={MAX_CAMERA_DISTANCE}
        maxPolarAngle={MAX_POLAR_ANGLE}
        minDistance={MIN_CAMERA_DISTANCE}
        target={CONTROL_TARGET}
      />
    </Canvas>
  )
}
