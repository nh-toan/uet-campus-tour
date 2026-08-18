import type { TourStop } from '../types/campus-map.types';

// TODO: Replace Phase-1 mock stops with verified campus tour data.
export const tourStops: TourStop[] = [
  {
    order: 1,
    sceneId: 'panorama-gate',
    cameraTarget: [0, 1.5, 4],
    durationMs: 5000,
  },
  {
    order: 2,
    sceneId: 'panorama-academic',
    cameraTarget: [-4, 1.5, 0],
    durationMs: 5000,
  },
  {
    order: 3,
    sceneId: 'panorama-library',
    cameraTarget: [4, 1.5, 0],
    durationMs: 5000,
  },
];
