import { lazy, Suspense } from 'react';
import '../styles/map.css';

const ExternalVirtualTour = lazy(() => import('../features/campus-map/ExternalVirtualTour'));

export default function MapPage() {
  return <section className="explorer-page" aria-label="Bản đồ khuôn viên UET">
    <div id="map-viewer" className="explorer-map-viewer">
      <Suspense fallback={<div className="map-wait" role="status"><strong>Đang tải bản đồ khuôn viên…</strong><span>Đang chuẩn bị không gian tham quan.</span></div>}>
        <ExternalVirtualTour />
      </Suspense>
    </div>
  </section>;
}
