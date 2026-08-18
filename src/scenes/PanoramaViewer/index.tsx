import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import {
  BackSide,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from 'three'
import { panoramaScenes } from '../../config/panorama.config'
import { useCampusStore } from '../../store/useCampusStore'
import type { PanoramaScene } from '../../types/campus.types'

const PANORAMA_RADIUS = 10
const CAMERA_ORBIT_RADIUS = 0.1
const CAMERA_FOV = 75
const PANORAMA_FORWARD_ROTATION = Math.PI / 2
const CONTROL_TARGET: [number, number, number] = [0, 0, 0]
const MIN_POLAR_ANGLE = 0.05
const MAX_POLAR_ANGLE = Math.PI - MIN_POLAR_ANGLE

function createInitialCameraPosition(
  initialYawPitch: [number, number],
): [number, number, number] {
  const [yaw, pitch] = initialYawPitch
  const yawRadians = (yaw * Math.PI) / 180
  const pitchRadians = (pitch * Math.PI) / 180
  const horizontalScale = Math.cos(pitchRadians) * CAMERA_ORBIT_RADIUS

  return [
    -Math.sin(yawRadians) * horizontalScale,
    -Math.sin(pitchRadians) * CAMERA_ORBIT_RADIUS,
    Math.cos(yawRadians) * horizontalScale,
  ]
}

interface PanoramaSphereProps {
  texture: Texture
}

function PanoramaSphere({ texture }: PanoramaSphereProps) {
  return (
    <mesh rotation={[0, PANORAMA_FORWARD_ROTATION, 0]}>
      <sphereGeometry args={[PANORAMA_RADIUS, 48, 32]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  )
}

interface PanoramaStatusProps {
  detail: string
  role: 'alert' | 'status'
  title: string
}

function PanoramaStatus({ detail, role, title }: PanoramaStatusProps) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-uet-cloud p-6"
      role={role}
    >
      <div className="max-w-sm rounded-xl border border-uet-slate/30 bg-uet-cloud p-5 text-center font-uet-body text-uet-navy shadow-lg">
        <p className="font-uet-display text-lg font-bold">{title}</p>
        <p className="mt-2 text-sm text-uet-slate">{detail}</p>
      </div>
    </div>
  )
}

function describeTextureError(error: unknown, sceneId: string) {
  if (error instanceof Error) {
    return `${error.message} (scene: ${sceneId})`
  }

  if (error instanceof Event && error.target instanceof HTMLImageElement) {
    return `Không thể decode texture cho scene ${sceneId}`
  }

  return `TextureLoader không thể tải texture cho scene ${sceneId}`
}

interface PanoramaCanvasProps {
  scene: PanoramaScene
}

function PanoramaCanvas({ scene }: PanoramaCanvasProps) {
  const [texture, setTexture] = useState<Texture | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const loader = new TextureLoader()
    const pendingTexture = loader.load(
      scene.imageUrlMobile,
      (loadedTexture) => {
        if (!active) {
          loadedTexture.dispose()
          return
        }

        loadedTexture.colorSpace = SRGBColorSpace
        loadedTexture.wrapS = RepeatWrapping
        loadedTexture.repeat.x = -1
        loadedTexture.offset.x = 1
        loadedTexture.needsUpdate = true
        setTexture(loadedTexture)
      },
      undefined,
      (error) => {
        if (active) {
          const errorMessage = describeTextureError(error, scene.id)

          setLoadError(errorMessage)
        }
      },
    )

    return () => {
      active = false
      pendingTexture.dispose()
    }
  }, [scene.id, scene.imageUrlMobile])

  if (loadError) {
    return (
      <PanoramaStatus
        detail={loadError}
        role="alert"
        title="Không tải được panorama"
      />
    )
  }

  if (!texture) {
    return (
      <PanoramaStatus
        detail={scene.title}
        role="status"
        title="Đang tải panorama…"
      />
    )
  }

  const cameraPosition = createInitialCameraPosition(scene.initialYawPitch)

  return (
    <Canvas
      camera={{
        far: PANORAMA_RADIUS * 2,
        fov: CAMERA_FOV,
        near: 0.01,
        position: cameraPosition,
      }}
      className="touch-none"
    >
      <PanoramaSphere texture={texture} />
      <OrbitControls
        enableDamping
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={MAX_POLAR_ANGLE}
        minPolarAngle={MIN_POLAR_ANGLE}
        target={CONTROL_TARGET}
      />
    </Canvas>
  )
}

export function PanoramaViewer() {
  const activeSceneId = useCampusStore((state) => state.activeSceneId)
  const panoramaScene = panoramaScenes.find(
    (scene) => scene.id === activeSceneId,
  )

  if (!panoramaScene) {
    return (
      <PanoramaStatus
        detail={`activeSceneId: ${activeSceneId ?? 'null'}`}
        role="alert"
        title="Không tìm thấy panorama"
      />
    )
  }

  return <PanoramaCanvas key={panoramaScene.id} scene={panoramaScene} />
}
