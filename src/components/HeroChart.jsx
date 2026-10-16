import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell } from './Icons'
import { ease } from './Reveal'

const W = 562
const H = 290
const RANGES = ['1A', '5A', '10A', 'MAX']

// Offsets above (+) / below (-) the trend line, in px, at fractions of the width.
const SHAPES = {
  '1A': [[0, 10], [0.15, -20], [0.3, 25], [0.42, -38], [0.55, 5], [0.68, 45], [0.8, 20], [0.9, 60], [1, 40]],
  '5A': [[0, -10], [0.12, 35], [0.25, -5], [0.35, -42], [0.5, 30], [0.63, 10], [0.75, 65], [0.88, 15], [1, 25]],
  '10A': [[0, -5], [0.1, 45], [0.18, 8], [0.25, 40], [0.33, -5], [0.4, -45], [0.47, 10], [0.55, 18], [0.62, -32], [0.66, 0], [0.74, 70], [0.78, 72], [0.86, 30], [0.93, 38], [1, 15]],
  MAX: [[0, 20], [0.1, -30], [0.22, 30], [0.32, -10], [0.45, -48], [0.55, 25], [0.65, -15], [0.78, 55], [0.9, 25], [1, 30]],
}

const trendY = (x) => 238 - (150 * x) / W

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function build(range) {
  const keys = SHAPES[range]
  const rand = rng(range.length * 977 + range.charCodeAt(0) * 31)
  const pts = []
  let noise = 0
  for (let x = 0; x <= W; x += 3) {
    const f = x / W
    let i = 0
    while (i < keys.length - 2 && keys[i + 1][0] < f) i++
    const [f0, o0] = keys[i]
    const [f1, o1] = keys[i + 1]
    const t = Math.min(1, Math.max(0, (f - f0) / (f1 - f0)))
    const s = t * t * (3 - 2 * t)
    noise = noise * 0.6 + (rand() - 0.5) * 9
    const off = o0 + (o1 - o0) * s + noise
    pts.push([x, trendY(x) - off, off])
  }
  // Mark buy signals: local minima well below trend
  const signals = []
  for (let i = 2; i < pts.length - 2; i++) {
    const p = pts[i]
    if (p[2] < -30 && p[1] > pts[i - 1][1] && p[1] >= pts[i + 1][1]) {
      if (!signals.length || p[0] - signals[signals.length - 1][0] > 9) signals.push(p)
    }
  }
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  return { d, area: `${d} L${W} ${H} L0 ${H} Z`, signals: signals.slice(0, 5), last: pts[pts.length - 1] }
}

const band = (off) => `M0 ${trendY(0) - off} L${W} ${trendY(W) - off}`

export default function HeroChart() {
  const [range, setRange] = useState('10A')
  const data = useMemo(() => build(range), [range])

  return (
    <motion.div
      className="chart-wrap"
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.35, ease }}
    >
      <div className="chart-card">
        <div className="chart-head">
          <div className="chart-asset">
            <div className="tag">MSCI</div>
            <div>
              <div className="title">ETF MSCI World</div>
              <div className="sub">[ISIN] · EUR · Hebdo</div>
            </div>
          </div>
          <div className="ranges">
            {RANGES.map((r) => (
              <button key={r} className={r === range ? 'active' : ''} onClick={() => setRange(r)}>
                {r === range && <motion.div layoutId="range-pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span>{r}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="chart-price">
          <span className="px">[COURS] €</span>
          <span className="var">▲ [VAR] %</span>
        </div>

        <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3ddc97" stopOpacity=".28" />
              <stop offset="100%" stopColor="#3ddc97" stopOpacity="0" />
            </linearGradient>
            <clipPath id="reveal">
              <motion.rect
                key={range}
                x="0" y="0" height={H}
                initial={{ width: 0 }}
                animate={{ width: W }}
                transition={{ duration: 2, ease: [0.45, 0, 0.2, 1], delay: 0.2 }}
              />
            </clipPath>
          </defs>

          {/* σ channel */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            <path d={`${band(38)} L${W} ${trendY(W) + 38} L0 ${trendY(0) + 38} Z`} fill="#3ddc97" opacity=".07" />
            <path d={`${band(-38)} L${W} ${trendY(W) + 72} L0 ${trendY(0) + 72} Z`} fill="#3ddc97" opacity=".045" />
            <path d={band(72)} stroke="#f05a5a" strokeOpacity=".45" strokeDasharray="1.5 4" />
            <path d={band(0)} stroke="#8b95a3" strokeOpacity=".45" strokeDasharray="5 5" />
            <path d={band(-72)} stroke="#3ddc97" strokeOpacity=".5" strokeDasharray="1.5 4" />
          </motion.g>

          <g clipPath="url(#reveal)">
            <path d={data.area} fill="url(#area)" />
            <path d={data.d} fill="none" stroke="#3ddc97" strokeWidth="1.8" strokeLinejoin="round" />
          </g>

          <g key={range}>
              {data.signals.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={p[0]} cy={p[1]} r="4.5"
                  fill="#0c1016" stroke="#f5b544" strokeWidth="1.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + (p[0] / W) * 2, type: 'spring', stiffness: 500, damping: 18 }}
                  style={{ transformOrigin: `${p[0]}px ${p[1]}px` }}
                />
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                <circle cx={data.last[0] - 2} cy={data.last[1]} r="9" fill="#3ddc97" opacity=".25">
                  <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values=".4;0;.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={data.last[0] - 2} cy={data.last[1]} r="4" fill="#3ddc97" />
              </motion.g>
          </g>
        </svg>

        <div className="chart-foot">
          <div>
            <div className="k">Écart à la tendance</div>
            <div className="v mono">−0,8 σ</div>
          </div>
          <div>
            <div className="k">Zone actuelle</div>
            <div className="v green">Achat favorable</div>
          </div>
          <div>
            <div className="k">DCA suggéré</div>
            <div className="v mono amber">× 1,25</div>
          </div>
        </div>
      </div>

      <motion.div
        className="signal-toast"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.4, type: 'spring', stiffness: 260, damping: 22 }}
      >
        <motion.div
          className="ic"
          animate={{ rotate: [0, -14, 12, -8, 6, 0] }}
          transition={{ delay: 2.9, duration: 0.8, repeat: Infinity, repeatDelay: 5 }}
        >
          <Bell size={17} />
        </motion.div>
        <div>
          <div className="row">
            <b>Signal VegaDesk</b>
            <span>à l'instant</span>
          </div>
          <p>MSCI World passe sous −1σ. Zone d'achat renforcée : versement DCA × 1,5 suggéré.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
