const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Icon = ({ size = 18, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
    {children}
  </svg>
)

export const Arrow = (p) => (
  <Icon size={16} className="arrow" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
export const Check = (p) => (
  <Icon size={14} strokeWidth={2.2} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
)
export const Bell = (p) => (
  <Icon {...p}>
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
)
export const TrendUp = (p) => (
  <Icon {...p}>
    <path d="M3 17l5-5 4 3 8-8" />
    <path d="M3 21l18-12" strokeDasharray="2 3" opacity=".6" />
  </Icon>
)
export const Bars = (p) => (
  <Icon {...p}>
    <rect x="4" y="13" width="3.5" height="7" rx="1" opacity=".55" />
    <rect x="10.25" y="9" width="3.5" height="11" rx="1" opacity=".75" />
    <rect x="16.5" y="4" width="3.5" height="16" rx="1" />
  </Icon>
)
export const Pulse = (p) => (
  <Icon {...p}>
    <path d="M3 13h3l2.5-6 4 11 3-8 1.5 3H21" />
  </Icon>
)
export const Fibo = (p) => (
  <Icon {...p}>
    <path d="M4 6h16M4 10h16M4 14h16M4 18h16M7 20L17 4" />
  </Icon>
)
export const Spread = (p) => (
  <Icon {...p}>
    <path d="M3 18l6-6 4 3 8-8M15 7h6v6" />
  </Icon>
)
export const Signal = (p) => (
  <Icon {...p}>
    <path d="M6 20v-4M10 20v-7M14 20v-10M18 20V5" />
  </Icon>
)
export const Download = (p) => (
  <Icon {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </Icon>
)
export const Clock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
)
export const Gauge = (p) => (
  <Icon {...p}>
    <path d="M4.5 16a8 8 0 1 1 15 0" />
    <path d="M12 14l4-4" />
  </Icon>
)
export const Fork = (p) => (
  <Icon {...p}>
    <path d="M12 21V9M12 9L6 15M12 9l6 6M12 3v6" />
  </Icon>
)
export const Pie = (p) => (
  <Icon {...p}>
    <path d="M21 12a9 9 0 1 1-9-9v9z" />
    <path d="M15 3.5A9 9 0 0 1 20.5 9H15z" />
  </Icon>
)
export const LineChart = (p) => (
  <Icon {...p}>
    <path d="M4 4v16h16" />
    <path d="M8 15l3.5-4 3 2.5L19 8" />
  </Icon>
)
export const Drawdown = (p) => (
  <Icon {...p}>
    <path d="M4 5l7 9 3-4 6 9" />
    <path d="M14 10v9" opacity=".4" />
  </Icon>
)
export const Peaks = (p) => (
  <Icon {...p}>
    <path d="M3 18l5-9 4 6 3-4 6 7" />
  </Icon>
)
export const Sliders = (p) => (
  <Icon {...p}>
    <path d="M4 8h10M18 8h2M4 16h3M11 16h9" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="9" cy="16" r="2" />
  </Icon>
)
export const Calendar = (p) => (
  <Icon {...p}>
    <rect x="4" y="5" width="16" height="15" rx="2.5" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </Icon>
)
