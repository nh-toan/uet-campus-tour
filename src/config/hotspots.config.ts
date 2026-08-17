import type { Hotspot } from '../types/campus.types'

// TODO: thay bằng dữ liệu thật
export const hotspots: Hotspot[] = [
  {
    id: 'hotspot-gate',
    buildingId: 'building-gate',
    position: [0, 1.5, 4],
    label: 'Cổng chính',
    panoramaSceneId: 'panorama-gate',
  },
  {
    id: 'hotspot-academic',
    buildingId: 'building-academic',
    position: [-4, 1.5, 0],
    label: 'Khu giảng đường',
    panoramaSceneId: 'panorama-academic',
  },
  {
    id: 'hotspot-library',
    buildingId: 'building-library',
    position: [4, 1.5, 0],
    label: 'Thư viện',
    panoramaSceneId: 'panorama-library',
  },
]
