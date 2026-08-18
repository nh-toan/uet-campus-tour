export interface Hotspot {
  id: string;
  buildingId: string;
  position: [number, number, number];
  label: string;
  panoramaSceneId: string;
}

export interface PanoramaScene {
  id: string;
  buildingId: string;
  title: string;
  imageUrlMobile: string;
  imageUrlDesktop: string;
  initialYawPitch: [number, number];
  linkedScenes?: {
    targetSceneId: string;
    yaw: number;
    pitch: number;
  }[];
}

export interface TourStop {
  order: number;
  sceneId: string;
  cameraTarget: [number, number, number];
  durationMs: number;
}
