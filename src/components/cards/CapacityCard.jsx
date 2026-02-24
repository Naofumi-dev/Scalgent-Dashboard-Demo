import { mockCapacity } from '../../lib/mockData'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { ArrowUpRight } from 'lucide-react'
import './CapacityCard.css'

export default function CapacityCard() {
    const { weeks, locations } = mockCapacity

    return (
        <div className="card card-purple capacity-card animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <h2 className="font-black text-lg" style={{ color: '#fff', letterSpacing: '-0.3px' }}>
                    WORKFLOW CAPACITY
                </h2>
                <button className="pill-select">this week <span>▾</span></button>
            </div>

            {/* Day circles */}
            <div className="cap-days">
                {weeks.map(w => (
                    <div key={w.day} className={`cap-day${w.pct >= 90 ? ' highlighted' : ''}`}>
                        <span className="cap-day-label">{w.day}</span>
                        <div className="cap-circle">
                            <span className="cap-pct">{w.pct}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sparkline */}
            <div style={{ height: 50, margin: '12px 0 6px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeks}>
                        <defs>
                            <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="pct"
                            stroke="rgba(255,255,255,0.7)"
                            strokeWidth={2}
                            fill="url(#capGrad)"
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="cap-legend">
                {locations.map(loc => (
                    <div key={loc.name} className="cap-legend-item">
                        <span className="cap-legend-dot" style={{ background: loc.color }} />
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>{loc.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
