import { Html } from '@react-three/drei';
import { hotspots } from '../../config/hotspots.config';
import { useCampusStore } from '../../store/useCampusStore';

export function Hotspots() {
  const setActiveScene = useCampusStore((state) => state.setActiveScene);
  const setViewMode = useCampusStore((state) => state.setViewMode);

  return hotspots.map((hotspot) => (
    <Html
      center
      key={hotspot.id}
      position={hotspot.position}
      zIndexRange={[9, 0]}
    >
      <button
        aria-label={`Mở ${hotspot.label}`}
        className="campus-map-hotspot"
        onClick={(event) => {
          event.stopPropagation();
          setActiveScene(hotspot.panoramaSceneId);
          setViewMode('panorama');
        }}
        onPointerDown={(event) => event.stopPropagation()}
        type="button"
      >
        <span aria-hidden="true" className="campus-map-hotspot__marker" />
        <span>{hotspot.label}</span>
      </button>
    </Html>
  ));
}
