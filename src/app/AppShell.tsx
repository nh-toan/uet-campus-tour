import { useEffect, useState } from 'react'
import { CampusMap3D } from '../scenes/CampusMap3D'

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

  return (
    <main className="h-svh w-full bg-uet-cloud">
      {sceneColors ? <CampusMap3D colors={sceneColors} /> : null}
    </main>
  )
}
