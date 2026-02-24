import { useRef, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import './MapCard.css'

const POINTS = [
    { x: 52, y: 48, label: 'The Daily Grind', sub: 'Astoria, NY', change: '+1.1%', active: true },
    { x: 30, y: 62, label: 'Uptown HQ', sub: 'Manhattan, NY', change: '+0.8%', active: false },
    { x: 68, y: 70, label: 'Brooklyn Hub', sub: 'Brooklyn, NY', change: '+2.3%', active: false },
]

export default function MapCard() {
    return (
        <div className="card card-dark map-card animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <h2 className="font-black text-sm" style={{ letterSpacing: '0.05em', color: '#fff' }}>POINTS</h2>
                <div className="flex gap-2">
                    <button className="pill-select" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                        all points <span>▾</span>
                    </button>
                    <button className="btn btn-ghost btn-icon"><ArrowUpRight size={14} /></button>
                </div>
            </div>
            <div style={{ marginBottom: 8 }}>
                <button className="pill-select" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 11 }}>
                    profitability rate <span>▾</span>
                </button>
            </div>

            {/* Map */}
            <div className="map-canvas">
                {/* Grid overlay for city-map look */}
                <svg className="map-grid" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <g key={i}>
                            <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
                            <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
                        </g>
                    ))}
                    {/* Block fills */}
                    {[[10, 10, 15, 12], [30, 5, 18, 8], [55, 15, 12, 10], [20, 30, 25, 8], [45, 40, 18, 12], [65, 25, 20, 10],
                    [5, 50, 15, 15], [35, 55, 20, 10], [60, 60, 18, 12], [10, 70, 25, 8], [50, 70, 22, 10]
                    ].map(([x, y, w, h], i) => (
                        <rect key={i} x={x} y={y} width={w} height={h}
                            fill="rgba(100,120,160,0.12)" rx="1" />
                    ))}
                </svg>

                {/* Location pins */}
                {POINTS.map((pt, i) => (
                    <div
                        key={i}
                        className={`map-pin${pt.active ? ' active' : ''}`}
                        style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    >
                        <div className="map-pin-dot" />
                        {pt.active && (
                            <div className="map-pin-tooltip">
                                <div className="badge badge-green" style={{ marginBottom: 4 }}>{pt.change}</div>
                                <div className="font-semibold text-xs" style={{ color: '#fff' }}>{pt.label}</div>
                                <div className="text-xs text-muted">{pt.sub}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
