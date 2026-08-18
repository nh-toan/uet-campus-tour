import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ComponentRef,
} from 'react'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { hotspots } from '../../config/hotspots.config'
import {
  useCampusStore,
  type MapViewState,
} from '../../store/useCampusStore'
import { Hotspots } from '../Hotspots'

const BUILDING_SIZES: [number, number, number][] = [
  [3.6, 1.2, 1.1],
  [3.8, 2.8, 3],
  [2.8, 3.4, 2.6],
]
const GROUND_SIZE: [number, number] = [18, 16]
const KEY_LIGHT_POSITION: [number, number, number] = [6, 10, 8]
const MIN_CAMERA_DISTANCE = 7
const MAX_CAMERA_DISTANCE = 24
const MAX_POLAR_ANGLE = Math.PI / 2.05
const ANGLE_EPSILON_DEGREES = 0.1
const POSITION_EPSILON = 0.01
const FOV_EPSILON_DEGREES = 0.05

interface SceneColors {
  buildingGate: string
  buildingAcademic: string
  buildingLibrary: string
  ground: string
}

interface CampusMap3DProps {
  colors: SceneColors
}

function hasNumberChanged(current: number, next: number, epsilon: number) {
  return Math.abs(current - next) > epsilon
}

function hasYawChanged(current: number, next: number) {
  const shortestDelta = ((next - current + 540) % 360) - 180

  return Math.abs(shortestDelta) > ANGLE_EPSILON_DEGREES
}

interface SyncedOrbitControlsProps {
  initialTarget: MapViewState['target']
}

function SyncedOrbitControls({ initialTarget }: SyncedOrbitControlsProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)
  const direction = useMemo(() => new Vector3(), [])
  const camera = useThree((state) => state.camera)
  const setCamera = useCampusStore((state) => state.setCamera)
  const setMapView = useCampusStore((state) => state.setMapView)

  const syncCameraState = useCallback(() => {
    const controls = controlsRef.current

    if (!controls || !(camera instanceof PerspectiveCamera)) {
      return
    }

    camera.getWorldDirection(direction)

    const yaw = MathUtils.radToDeg(Math.atan2(direction.x, -direction.z))
    const pitch = MathUtils.radToDeg(
      Math.asin(MathUtils.clamp(direction.y, -1, 1)),
    )
    const { fov } = camera
    const currentState = useCampusStore.getState()
    const cameraChanged =
      hasYawChanged(currentState.camera.yaw, yaw) ||
      hasNumberChanged(
        currentState.camera.pitch,
        pitch,
        ANGLE_EPSILON_DEGREES,
      ) ||
      hasNumberChanged(currentState.camera.fov, fov, FOV_EPSILON_DEGREES)

    if (cameraChanged) {
      setCamera({ yaw, pitch, fov })
    }

    const { position } = camera
    const { target } = controls
    const mapViewChanged =
      hasNumberChanged(
        currentState.mapView.position[0],
        position.x,
        POSITION_EPSILON,
      ) ||
      hasNumberChanged(
        currentState.mapView.position[1],
        position.y,
        POSITION_EPSILON,
      ) ||
      hasNumberChanged(
        currentState.mapView.position[2],
        position.z,
        POSITION_EPSILON,
      ) ||
      hasNumberChanged(
        currentState.mapView.target[0],
        target.x,
        POSITION_EPSILON,
      ) ||
      hasNumberChanged(
        currentState.mapView.target[1],
        target.y,
        POSITION_EPSILON,
      ) ||
      hasNumberChanged(
        currentState.mapView.target[2],
        target.z,
        POSITION_EPSILON,
      ) ||
      hasNumberChanged(currentState.mapView.fov, fov, FOV_EPSILON_DEGREES)

    if (mapViewChanged) {
      setMapView({
        position: [position.x, position.y, position.z],
        target: [target.x, target.y, target.z],
        fov,
      })
    }
  }, [camera, direction, setCamera, setMapView])

  useEffect(() => {
    syncCameraState()
  }, [syncCameraState])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      maxDistance={MAX_CAMERA_DISTANCE}
      maxPolarAngle={MAX_POLAR_ANGLE}
      minDistance={MIN_CAMERA_DISTANCE}
      onChange={syncCameraState}
      target={initialTarget}
    />
  )
}

export function CampusMap3D({ colors }: CampusMap3DProps) {
  const initialMapViewRef = useRef<MapViewState | null>(null)

  if (initialMapViewRef.current === null) {
    const { position, target, fov } = useCampusStore.getState().mapView

    initialMapViewRef.current = {
      position: [...position],
      target: [...target],
      fov,
    }
  }

  const initialMapView = initialMapViewRef.current
  const buildingColors = [
    colors.buildingGate,
    colors.buildingAcademic,
    colors.buildingLibrary,
  ]

  return (
    <Canvas
      camera={{
        fov: initialMapView.fov,
        position: initialMapView.position,
      }}
      className="touch-none"
    >
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

      <Hotspots />
      <SyncedOrbitControls initialTarget={initialMapView.target} />
    </Canvas>
  )
}
