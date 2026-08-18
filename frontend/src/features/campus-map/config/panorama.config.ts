import mockPanoramaUrl from '../assets/mock/sample-panorama-grid.svg';
import type { PanoramaScene } from '../types/campus-map.types';

// TODO: Replace the Phase-1 mock panorama with verified campus imagery.
export const panoramaScenes: PanoramaScene[] = [
  {
    id: 'panorama-gate',
    buildingId: 'building-gate',
    title: 'Cổng chính UET Hòa Lạc',
    imageUrlMobile: mockPanoramaUrl,
    imageUrlDesktop: mockPanoramaUrl,
    initialYawPitch: [0, 0],
  },
  {
    id: 'panorama-academic',
    buildingId: 'building-academic',
    title: 'Khu giảng đường',
    imageUrlMobile: mockPanoramaUrl,
    imageUrlDesktop: mockPanoramaUrl,
    initialYawPitch: [0, 0],
  },
  {
    id: 'panorama-library',
    buildingId: 'building-library',
    title: 'Thư viện',
    imageUrlMobile: mockPanoramaUrl,
    imageUrlDesktop: mockPanoramaUrl,
    initialYawPitch: [0, 0],
  },
];
