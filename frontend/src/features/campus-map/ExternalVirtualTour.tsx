import { useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import './styles/external-virtual-tour.css';

const UET_VIRTUAL_TOUR_URL =
  'https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;';
const UET_GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+H%E1%BB%8Dc+C%C3%B4ng+Ngh%E1%BB%87+(VNU)/@20.9970845,105.4959939,17z/data=!3m1!4b1!4m6!3m5!1s0x31345d2197188227:0x2390e80a3d7fa0cf!8m2!3d20.9970845!4d105.4985688!16s%2Fg%2F11l35dkqvh?entry=ttu&g_ep=EgoyMDI2MDgyMy4wIKXMDSoASAFQAw%3D%3D';

export default function ExternalVirtualTour() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="external-virtual-tour">
      <a
        className="external-virtual-tour__google-maps"
        href={UET_GOOGLE_MAPS_URL}
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Xem Trường Đại học Công nghệ trên Google Maps (mở trong tab mới)"
      >
        <span className="external-virtual-tour__google-maps-icon" aria-hidden="true">
          <MapPin size={21} strokeWidth={2.2} />
        </span>
        <span className="external-virtual-tour__google-maps-copy">
          <span className="external-virtual-tour__google-maps-label">Vị trí UET Hòa Lạc</span>
          <strong>Xem trên Google Maps</strong>
        </span>
        <ExternalLink className="external-virtual-tour__google-maps-external" size={17} aria-hidden="true" />
      </a>
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
