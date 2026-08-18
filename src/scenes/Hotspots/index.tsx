import { Html } from '@react-three/drei'
import { hotspots } from '../../config/hotspots.config'
import { useCampusStore } from '../../store/useCampusStore'

export function Hotspots() {
  const setActiveScene = useCampusStore((state) => state.setActiveScene)
  const setViewMode = useCampusStore((state) => state.setViewMode)

  return hotspots.map((hotspot) => (
    <Html
      center
      key={hotspot.id}
      position={hotspot.position}
      zIndexRange={[9, 0]}
    >
      <button
        aria-label={`Mở ${hotspot.label}`}
        className="flex min-h-11 min-w-11 touch-manipulation select-none items-center gap-2 whitespace-nowrap rounded-full border-2 border-uet-cloud bg-uet-navy px-3 py-2 font-uet-body text-sm font-semibold text-uet-cloud shadow-lg outline-none active:bg-uet-navy-soft focus-visible:border-uet-gold focus-visible:ring-2 focus-visible:ring-uet-gold/60"
        onClick={(event) => {
          event.stopPropagation()
          setActiveScene(hotspot.panoramaSceneId)
          setViewMode('panorama')
        }}
        onPointerDown={(event) => event.stopPropagation()}
        type="button"
      >
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-uet-gold"
        />
        <span>{hotspot.label}</span>
      </button>
    </Html>
  ))
}
