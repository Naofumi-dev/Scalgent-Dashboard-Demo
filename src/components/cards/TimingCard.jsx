import { ArrowUpRight } from 'lucide-react'
import './TimingCard.css'

const HOUR_MARKS = Array.from({ length: 12 }, (_, i) => i * 30)
const DATA_POINTS = [
    { angle: 0, r: 0.55 },
    { angle: 30, r: 0.70 },
    { angle: 60, r: 0.85 },
    { angle: 90, r: 0.90 },
    { angle: 120, r: 0.75 },
    { angle: 150, r: 0.60 },
    { angle: 180, r: 0.50 },
    { angle: 210, r: 0.45 },
    { angle: 240, r: 0.55 },
    { angle: 270, r: 0.65 },
    { angle: 300, r: 0.80 },
    { angle: 330, r: 0.70 },
]

function polarToXY(angleDeg, r, cx, cy, maxR) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
        x: cx + Math.cos(rad) * r * maxR,
        y: cy + Math.sin(rad) * r * maxR,
    }
}

export default function TimingCard() {
    const cx = 90, cy = 90, maxR = 75

    // Build radar path
    const points = DATA_POINTS.map(d => polarToXY(d.angle, d.r, cx, cy, maxR))
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'

    // Clock hand at ~10:47
    const hourAngle = ((10 * 60 + 47) / 720) * 360
    const minAngle = (47 / 60) * 360
    const hourEnd = polarToXY(hourAngle, 0.42, cx, cy, maxR)
    const minEnd = polarToXY(minAngle, 0.68, cx, cy, maxR)

    return (
        <div className="card card-dark timing-card animate-fade-in">
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <h2 className="font-black text-sm" style={{ letterSpacing: '0.05em', color: '#fff' }}>
                    OPERATIONAL<br />TIMING
                </h2>
                <button className="btn btn-ghost btn-icon"><ArrowUpRight size={14} /></button>
            </div>

            <div className="timing-chart-wrap">
                <svg viewBox="0 0 180 180" className="timing-svg">
                    {/* Concentric rings */}
                    {[0.25, 0.5, 0.75, 1].map(r => (
                        <circle
                            key={r}
                            cx={cx} cy={cy} r={maxR * r}
                            fill="none"
                            stroke="rgba(255,255,255,0.07)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Hour spokes */}
                    {HOUR_MARKS.map(angle => {
                        const outer = polarToXY(angle, 1.0, cx, cy, maxR)
                        return (
                            <line
                                key={angle}
                                x1={cx} y1={cy}
                                x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="1"
                            />
                        )
                    })}

                    {/* Radar fill */}
                    <path d={pathD} fill="rgba(232,97,74,0.15)" stroke="rgba(232,97,74,0.5)" strokeWidth="1.5" />

                    {/* Hour numbers */}
                    {[12, 3, 6, 9].map((n, i) => {
                        const angles = [0, 90, 180, 270]
                        const p = polarToXY(angles[i], 1.16, cx, cy, maxR)
                        return (
                            <text key={n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                                fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="Inter">
                                {n}
                            </text>
                        )
                    })}

                    {/* Clock hands */}
                    <line
                        x1={cx} y1={cy} x2={hourEnd.x.toFixed(1)} y2={hourEnd.y.toFixed(1)}
                        stroke="#fff" strokeWidth="3" strokeLinecap="round"
                    />
                    <line
                        x1={cx} y1={cy} x2={minEnd.x.toFixed(1)} y2={minEnd.y.toFixed(1)}
                        stroke="var(--coral)" strokeWidth="2" strokeLinecap="round"
                    />
                    <circle cx={cx} cy={cy} r="4" fill="var(--coral)" />
                </svg>
            </div>

            {/* Legend */}
            <div className="timing-legend">
                <div className="flex items-center gap-2">
                    <span className="timing-dot" style={{ background: 'var(--coral)' }} />
                    <span className="text-xs text-secondary">Peak</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="timing-dot" style={{ background: 'var(--text-muted)' }} />
                    <span className="text-xs text-secondary">Completion</span>
                </div>
                <div className="text-xs text-secondary" style={{ marginLeft: 'auto' }}>UTC–5</div>
            </div>
            <div className="timing-time">12:47:33</div>
        </div>
    )
}
