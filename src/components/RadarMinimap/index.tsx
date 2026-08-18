import { useCampusStore } from '../../store/useCampusStore'

const VIEWBOX_SIZE = 120
const RADAR_CENTER = VIEWBOX_SIZE / 2
const RADAR_RADIUS = 50
const CONE_RADIUS = 42
const MIN_CONE_FOV = 10
const MAX_CONE_FOV = 150

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function createConePath(fov: number) {
  const halfFovRadians =
    (clamp(fov, MIN_CONE_FOV, MAX_CONE_FOV) * Math.PI) / 360
  const horizontalOffset = Math.sin(halfFovRadians) * CONE_RADIUS
  const verticalOffset = Math.cos(halfFovRadians) * CONE_RADIUS
  const leftX = RADAR_CENTER - horizontalOffset
  const rightX = RADAR_CENTER + horizontalOffset
  const edgeY = RADAR_CENTER - verticalOffset

  return [
    `M ${RADAR_CENTER} ${RADAR_CENTER}`,
    `L ${leftX} ${edgeY}`,
    `A ${CONE_RADIUS} ${CONE_RADIUS} 0 0 1 ${rightX} ${edgeY}`,
    'Z',
  ].join(' ')
}

export function RadarMinimap() {
  const yaw = useCampusStore((state) => state.camera.yaw)
  const fov = useCampusStore((state) => state.camera.fov)
  const conePath = createConePath(fov)

  return (
    <aside className="rounded-full border border-uet-cloud/40 bg-uet-navy/90 p-1 shadow-lg">
      <svg
        aria-label="Radar hướng nhìn"
        className="block size-32"
        role="img"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      >
        <circle
          className="fill-uet-navy-soft/80 stroke-uet-cloud/70"
          cx={RADAR_CENTER}
          cy={RADAR_CENTER}
          r={RADAR_RADIUS}
          strokeWidth="1.5"
        />
        <circle
          className="fill-none stroke-uet-cloud/20"
          cx={RADAR_CENTER}
          cy={RADAR_CENTER}
          r={RADAR_RADIUS / 2}
          strokeWidth="1"
        />
        <path
          className="stroke-uet-cloud/20"
          d={`M ${RADAR_CENTER} ${RADAR_CENTER - RADAR_RADIUS} V ${RADAR_CENTER + RADAR_RADIUS} M ${RADAR_CENTER - RADAR_RADIUS} ${RADAR_CENTER} H ${RADAR_CENTER + RADAR_RADIUS}`}
          strokeDasharray="3 4"
          strokeWidth="1"
        />

        <g transform={`rotate(${yaw} ${RADAR_CENTER} ${RADAR_CENTER})`}>
          <path
            className="fill-uet-blue/30 stroke-uet-blue"
            d={conePath}
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <line
            className="stroke-uet-gold"
            x1={RADAR_CENTER}
            x2={RADAR_CENTER}
            y1={RADAR_CENTER}
            y2={RADAR_CENTER - CONE_RADIUS}
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>

        <circle
          className="fill-uet-cloud stroke-uet-navy"
          cx={RADAR_CENTER}
          cy={RADAR_CENTER}
          r="4"
          strokeWidth="2"
        />
        <text
          className="fill-uet-cloud font-uet-mono text-[9px] font-bold"
          dominantBaseline="middle"
          textAnchor="middle"
          x={RADAR_CENTER}
          y="8"
        >
          N
        </text>
      </svg>
    </aside>
  )
}
