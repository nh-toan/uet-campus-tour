import { useCallback, useEffect } from 'react';
import { panoramaScenes } from '../../config/panorama.config';
import { tourStops } from '../../config/tour.config';
import { useCampusStore } from '../../store/useCampusStore';

const orderedTourStops = [...tourStops].sort(
  (first, second) => first.order - second.order,
);
const lastTourIndex = Math.max(orderedTourStops.length - 1, 0);

function clampTourIndex(index: number) {
  return Math.min(Math.max(index, 0), lastTourIndex);
}

const TOUR_STATUS_LABELS = {
  idle: 'Sẵn sàng',
  paused: 'Đã tạm dừng',
  playing: 'Đang phát',
} as const;

export function TourControls() {
  const status = useCampusStore((state) => state.tour.status);
  const currentIndex = useCampusStore((state) => state.tour.currentIndex);
  const playTour = useCampusStore((state) => state.playTour);
  const pauseTour = useCampusStore((state) => state.pauseTour);
  const stopTour = useCampusStore((state) => state.stopTour);
  const setTourIndex = useCampusStore((state) => state.setTourIndex);
  const setActiveScene = useCampusStore((state) => state.setActiveScene);
  const setViewMode = useCampusStore((state) => state.setViewMode);
  const hasTourStops = orderedTourStops.length > 0;
  const safeCurrentIndex = clampTourIndex(currentIndex);
  const currentStop = orderedTourStops[safeCurrentIndex];
  const currentScene = panoramaScenes.find(
    (scene) => scene.id === currentStop?.sceneId,
  );
  const progressValue = hasTourStops
    ? ((safeCurrentIndex + 1) / orderedTourStops.length) * 100
    : 0;

  const goToStop = useCallback(
    (requestedIndex: number) => {
      if (!hasTourStops) {
        return;
      }

      const nextIndex = clampTourIndex(requestedIndex);
      const nextStop = orderedTourStops[nextIndex];

      if (!nextStop) {
        return;
      }

      setTourIndex(nextIndex);
      setActiveScene(nextStop.sceneId);
      setViewMode('panorama');
    },
    [hasTourStops, setActiveScene, setTourIndex, setViewMode],
  );

  const resetTour = useCallback(() => {
    stopTour();

    const firstStop = orderedTourStops[0];

    if (firstStop) {
      setActiveScene(firstStop.sceneId);
    }
  }, [setActiveScene, stopTour]);

  useEffect(() => {
    if (status !== 'playing' || !currentStop) {
      return;
    }

    const timerId = window.setTimeout(() => {
      const latestTourState = useCampusStore.getState().tour;

      if (
        latestTourState.status !== 'playing' ||
        latestTourState.currentIndex !== currentIndex
      ) {
        return;
      }

      if (currentIndex >= lastTourIndex) {
        resetTour();
        return;
      }

      goToStop(currentIndex + 1);
    }, currentStop.durationMs);

    return () => window.clearTimeout(timerId);
  }, [currentIndex, currentStop, goToStop, resetTour, status]);

  const handlePlayPause = () => {
    if (!hasTourStops) {
      return;
    }

    if (status === 'playing') {
      pauseTour();
      return;
    }

    const latestIndex = clampTourIndex(
      useCampusStore.getState().tour.currentIndex,
    );

    goToStop(latestIndex);
    playTour();
  };

  const moveBy = (offset: number) => {
    const latestIndex = useCampusStore.getState().tour.currentIndex;

    goToStop(latestIndex + offset);
  };

  return (
    <section aria-label="Điều khiển tour tham quan" className="campus-map-tour">
      <div className="campus-map-tour__header">
        <div className="campus-map-tour__copy">
          <p className="campus-map-tour__eyebrow">Tour tham quan</p>
          <p className="campus-map-tour__title">
            {currentScene?.title ?? 'Chưa có điểm tham quan'}
          </p>
        </div>
        <button
          className="campus-map-tour__stop"
          disabled={status === 'idle' || !hasTourStops}
          onClick={resetTour}
          type="button"
        >
          Dừng
        </button>
      </div>

      <div className="campus-map-tour__progress-group">
        <div className="campus-map-tour__meta">
          <span>{TOUR_STATUS_LABELS[status]}</span>
          <span>
            {hasTourStops ? safeCurrentIndex + 1 : 0}/
            {orderedTourStops.length}
          </span>
        </div>
        <div
          aria-label="Tiến độ tour"
          aria-valuemax={orderedTourStops.length}
          aria-valuemin={hasTourStops ? 1 : 0}
          aria-valuenow={hasTourStops ? safeCurrentIndex + 1 : 0}
          className="campus-map-tour__progress"
          role="progressbar"
        >
          <div
            className="campus-map-tour__progress-fill"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      <div className="campus-map-tour__actions">
        <button
          className="campus-map-tour__button"
          disabled={!hasTourStops || safeCurrentIndex === 0}
          onClick={() => moveBy(-1)}
          type="button"
        >
          ← Trước
        </button>
        <button
          aria-label={status === 'playing' ? 'Tạm dừng tour' : 'Phát tour'}
          className="campus-map-tour__button campus-map-tour__button--primary"
          disabled={!hasTourStops}
          onClick={handlePlayPause}
          type="button"
        >
          {status === 'playing' ? 'Tạm dừng' : 'Phát'}
        </button>
        <button
          className="campus-map-tour__button"
          disabled={!hasTourStops || safeCurrentIndex === lastTourIndex}
          onClick={() => moveBy(1)}
          type="button"
        >
          Tiếp →
        </button>
      </div>
    </section>
  );
}
