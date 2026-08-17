import { useEffect, useState } from 'react'
import { CampusMap3D } from '../scenes/CampusMap3D'

const TECH_BLUE_TOKEN = '--color-tech-blue'

export function AppShell() {
  const [accentColor, setAccentColor] = useState<string | null>(null)

  useEffect(() => {
    const resolvedColor = getComputedStyle(document.documentElement)
      .getPropertyValue(TECH_BLUE_TOKEN)
      .trim()

    if (resolvedColor) {
      setAccentColor(resolvedColor)
    }
  }, [])

  return (
    <main className="h-svh w-full bg-uet-cloud">
      {accentColor ? <CampusMap3D accentColor={accentColor} /> : null}
    </main>
  )
}
