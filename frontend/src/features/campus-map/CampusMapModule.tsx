import { useEffect, useState } from 'react';
import { RadarMinimap } from './components/RadarMinimap';
import { TourControls } from './components/TourControls';
import { CampusMap3D } from './scenes/CampusMap3D';
import { PanoramaViewer } from './scenes/PanoramaViewer';
import { useCampusStore, type ViewMode } from './store/useCampusStore';
import './styles/map.css';

const VIEW_TRANSITION_MS = 300;

const SCENE_COLORS = {
  buildingGate: '#2F80FF',
  buildingAcademic: '#C9A227',
  buildingLibrary: '#14335E',
  ground: '#64748B',
};

export default function CampusMapModule() {
  const viewMode = useCampusStore((state) => state.viewMode);
  const setViewMode = useCampusStore((state) => state.setViewMode);
  const [displayedViewMode, setDisplayedViewMode] =
    useState<ViewMode>(viewMode);
  const [sceneVisible, setSceneVisible] = useState(true);

  useEffect(() => {
    if (viewMode === displayedViewMode) {
      setSceneVisible(true);
      return;
    }

    setSceneVisible(false);

    const transitionTimer = window.setTimeout(() => {
      setDisplayedViewMode(viewMode);
    }, VIEW_TRANSITION_MS);

    return () => window.clearTimeout(transitionTimer);
  }, [displayedViewMode, viewMode]);

  const sceneClassName = [
    'campus-map-scene',
    sceneVisible && 'campus-map-scene--visible',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="campus-map-root">
      <div className={sceneClassName}>
        {displayedViewMode === 'map3d' ? (
          <CampusMap3D colors={SCENE_COLORS} />
        ) : (
          <PanoramaViewer />
        )}

        {displayedViewMode === 'map3d' ? (
          <div className="campus-map-radar-anchor">
            <RadarMinimap />
          </div>
        ) : (
          <button
            aria-label="Quay lại bản đồ"
            className="campus-map-back-button"
            onClick={() => setViewMode('map3d')}
            type="button"
          >
            <span aria-hidden="true">←</span>
            <span>Bản đồ</span>
          </button>
        )}
      </div>

      <div className="campus-map-controls-anchor">
        <TourControls />
      </div>
    </div>
  );
}
