import { useState } from 'react';
import './styles/external-virtual-tour.css';

const UET_VIRTUAL_TOUR_URL =
  'https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;';

export default function ExternalVirtualTour() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="external-virtual-tour">
      {!isLoaded && (
        <div className="external-virtual-tour__loading" role="status">
          <div className="external-virtual-tour__loading-content">
            <span
              aria-hidden="true"
              className="external-virtual-tour__spinner"
            />
            <p className="external-virtual-tour__loading-title">
              Đang tải bản đồ khuôn viên...
            </p>
            <p className="external-virtual-tour__loading-detail">
              Đang kết nối tới UET Virtual Campus Tour
            </p>
            <a
              className="external-virtual-tour__fallback"
              href={UET_VIRTUAL_TOUR_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Mở bản đồ 3D trong cửa sổ mới
            </a>
          </div>
        </div>
      )}
      <iframe
        allow="fullscreen"
        allowFullScreen
        className={`external-virtual-tour__frame${isLoaded ? ' external-virtual-tour__frame--loaded' : ''}`}
        onLoad={() => setIsLoaded(true)}
        src={UET_VIRTUAL_TOUR_URL}
        title="UET Virtual Campus Tour"
      />
    </div>
  );
}
