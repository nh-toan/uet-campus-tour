import { create } from 'zustand';

export type ViewMode = 'map3d' | 'panorama';
export type TourStatus = 'idle' | 'playing' | 'paused';

export interface CameraState {
  yaw: number;
  pitch: number;
  fov: number;
}

export interface MapViewState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface TourState {
  status: TourStatus;
  currentIndex: number;
}

export interface CampusState {
  viewMode: ViewMode;
  activeSceneId: string | null;
  camera: CameraState;
  mapView: MapViewState;
  tour: TourState;
  setViewMode: (mode: ViewMode) => void;
  setActiveScene: (id: string | null) => void;
  setCamera: (camera: Partial<CameraState>) => void;
  setMapView: (view: Partial<MapViewState>) => void;
  playTour: () => void;
  pauseTour: () => void;
  stopTour: () => void;
  setTourIndex: (index: number) => void;
}

export const useCampusStore = create<CampusState>((set) => ({
  viewMode: 'map3d',
  activeSceneId: null,
  camera: {
    yaw: 0,
    pitch: 0,
    fov: 75,
  },
  mapView: {
    position: [8, 6, 8],
    target: [0, 0, 0],
    fov: 50,
  },
  tour: {
    status: 'idle',
    currentIndex: 0,
  },
  setViewMode: (viewMode) => set({ viewMode }),
  setActiveScene: (activeSceneId) => set({ activeSceneId }),
  setCamera: (camera) =>
    set((state) => ({ camera: { ...state.camera, ...camera } })),
  setMapView: (mapView) =>
    set((state) => ({ mapView: { ...state.mapView, ...mapView } })),
  playTour: () =>
    set((state) => ({ tour: { ...state.tour, status: 'playing' } })),
  pauseTour: () =>
    set((state) => ({ tour: { ...state.tour, status: 'paused' } })),
  stopTour: () => set({ tour: { status: 'idle', currentIndex: 0 } }),
  setTourIndex: (currentIndex) =>
    set((state) => ({ tour: { ...state.tour, currentIndex } })),
}));
