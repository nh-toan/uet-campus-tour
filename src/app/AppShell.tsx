import { useEffect, useState } from 'react'
import { RadarMinimap } from '../components/RadarMinimap'
import { CampusMap3D } from '../scenes/CampusMap3D'
import { PanoramaViewer } from '../scenes/PanoramaViewer'
import {
  useCampusStore,
  type ViewMode,
} from '../store/useCampusStore'

const VIEW_TRANSITION_MS = 300

const SCENE_COLOR_TOKENS = {
  buildingGate: '--color-tech-blue',
  buildingAcademic: '--color-academic-gold',
  buildingLibrary: '--color-navy-700',
  ground: '--color-slate-500',
} as const

interface SceneColors {
  buildingGate: string
  buildingAcademic: string
  buildingLibrary: string
  ground: string
}

export function AppShell() {
  const [sceneColors, setSceneColors] = useState<SceneColors | null>(null)
  const viewMode = useCampusStore((state) => state.viewMode)
  const setViewMode = useCampusStore((state) => state.setViewMode)
  const [displayedViewMode, setDisplayedViewMode] =
    useState<ViewMode>(viewMode)
  const [sceneVisible, setSceneVisible] = useState(true)

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement)
    const resolvedColors: SceneColors = {
      buildingGate: rootStyles
        .getPropertyValue(SCENE_COLOR_TOKENS.buildingGate)
        .trim(),
      buildingAcademic: rootStyles
        .getPropertyValue(SCENE_COLOR_TOKENS.buildingAcademic)
        .trim(),
      buildingLibrary: rootStyles
        .getPropertyValue(SCENE_COLOR_TOKENS.buildingLibrary)
        .trim(),
      ground: rootStyles.getPropertyValue(SCENE_COLOR_TOKENS.ground).trim(),
    }

    if (Object.values(resolvedColors).every(Boolean)) {
      setSceneColors(resolvedColors)
    }
  }, [])

  useEffect(() => {
    if (viewMode === displayedViewMode) {
      setSceneVisible(true)
      return
    }

    setSceneVisible(false)

    const transitionTimer = window.setTimeout(() => {
      setDisplayedViewMode(viewMode)
    }, VIEW_TRANSITION_MS)

    return () => window.clearTimeout(transitionTimer)
  }, [displayedViewMode, viewMode])

  const sceneClassName = [
    'h-full w-full transition-opacity duration-300 ease-in-out',
    sceneVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
  ].join(' ')

  return (
    <main className="relative h-svh w-full overflow-hidden bg-uet-navy">
      <div className={sceneClassName}>
        {displayedViewMode === 'map3d' ? (
          sceneColors ? (
            <CampusMap3D colors={sceneColors} />
          ) : null
        ) : (
          <PanoramaViewer />
        )}

        {displayedViewMode === 'map3d' ? (
          <div className="pointer-events-none absolute top-3 right-3 z-10">
            <RadarMinimap />
          </div>
        ) : (
          <button
            aria-label="Quay lại bản đồ"
            className="absolute top-3 left-3 z-20 flex min-h-11 min-w-11 touch-manipulation items-center gap-2 rounded-full border border-uet-cloud/40 bg-uet-navy/90 px-4 py-2 font-uet-body text-sm font-semibold text-uet-cloud shadow-lg outline-none active:bg-uet-navy-soft focus-visible:ring-2 focus-visible:ring-uet-gold"
            onClick={() => setViewMode('map3d')}
            type="button"
          >
            <span aria-hidden="true">←</span>
            <span>Bản đồ</span>
          </button>
        )}
      </div>
    </main>
  )
}
