export interface CampusInfo {
  name: string;
  slogan: string;
  address: string;
  stats: { label: string; value: string }[];
}

export interface Faculty {
  id: string;
  name: string;
  dean: string;
  programs: string[];
  description?: string;
}

export interface Club {
  id: string;
  name: string;
  category: "academic" | "sports" | "arts" | "volunteer" | "other";
  memberCount?: number;
  description: string;
  logoUrl?: string;
}

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
