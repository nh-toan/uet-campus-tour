import { useCampusStore } from '../../store/useCampusStore';

const VIEWBOX_SIZE = 120;
const RADAR_CENTER = VIEWBOX_SIZE / 2;
const RADAR_RADIUS = 50;
const CONE_RADIUS = 42;
const MIN_CONE_FOV = 10;
const MAX_CONE_FOV = 150;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function createConePath(fov: number) {
  const halfFovRadians =
    (clamp(fov, MIN_CONE_FOV, MAX_CONE_FOV) * Math.PI) / 360;
  const horizontalOffset = Math.sin(halfFovRadians) * CONE_RADIUS;
  const verticalOffset = Math.cos(halfFovRadians) * CONE_RADIUS;
  const leftX = RADAR_CENTER - horizontalOffset;
  const rightX = RADAR_CENTER + horizontalOffset;
  const edgeY = RADAR_CENTER - verticalOffset;

  return [
    `M ${RADAR_CENTER} ${RADAR_CENTER}`,
    `L ${leftX} ${edgeY}`,
    `A ${CONE_RADIUS} ${CONE_RADIUS} 0 0 1 ${rightX} ${edgeY}`,
    'Z',
  ].join(' ');
}

export function RadarMinimap() {
  const yaw = useCampusStore((state) => state.camera.yaw);
  const fov = useCampusStore((state) => state.camera.fov);
  const conePath = createConePath(fov);

  return (
    <aside className="campus-map-radar">
      <svg
        aria-label="Radar hướng nhìn"
        className="campus-map-radar__svg"
        role="img"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      >
        <circle
          className="campus-map-radar__disc"
          cx={RADAR_CENTER}
          cy={RADAR_CENTER}
          r={RADAR_RADIUS}
          strokeWidth="1.5"
        />
        <circle
          className="campus-map-radar__grid"
          cx={RADAR_CENTER}
          cy={RADAR_CENTER}
          r={RADAR_RADIUS / 2}
          strokeWidth="1"
        />
        <path
          className="campus-map-radar__grid"
          d={`M ${RADAR_CENTER} ${RADAR_CENTER - RADAR_RADIUS} V ${RADAR_CENTER + RADAR_RADIUS} M ${RADAR_CENTER - RADAR_RADIUS} ${RADAR_CENTER} H ${RADAR_CENTER + RADAR_RADIUS}`}
          strokeDasharray="3 4"
          strokeWidth="1"
        />
        <g transform={`rotate(${yaw} ${RADAR_CENTER} ${RADAR_CENTER})`}>
          <path
            className="campus-map-radar__cone"
            d={conePath}
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <line
            className="campus-map-radar__bearing"
            x1={RADAR_CENTER}
            x2={RADAR_CENTER}
            y1={RADAR_CENTER}
            y2={RADAR_CENTER - CONE_RADIUS}
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
        <circle
          className="campus-map-radar__center"
          cx={RADAR_CENTER}
          cy={RADAR_CENTER}
          r="4"
          strokeWidth="2"
        />
        <text
          className="campus-map-radar__north"
          dominantBaseline="middle"
          textAnchor="middle"
          x={RADAR_CENTER}
          y="8"
        >
          N
        </text>
      </svg>
    </aside>
  );
}
