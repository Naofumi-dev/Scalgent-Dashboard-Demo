import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { mockRevenue } from '../../lib/mockData'
import './RevenueCard.css'

const ACTIVE_DAY = 'Thu'

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rev-tooltip">
            <div className="text-xs text-muted">{label}</div>
            <div className="font-semibold text-sm">${payload[0].value.toLocaleString()}</div>
        </div>
    )
}

export default function RevenueCard() {
    const { gross, avgOrder, grossChange, avgOrderChange, weekly } = mockRevenue
    const maxVal = Math.max(...weekly.map(w => w.value))

    return (
        <div className="card card-coral revenue-card animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div className="flex items-center gap-2">
                    <div className="rev-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </div>
                    <h2 className="font-black text-2xl" style={{ letterSpacing: '-1px', color: '#fff' }}>
                        REVENUE
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button className="pill-select">this week <span>▾</span></button>
                    <button className="pill-select">USD, $ <span>▾</span></button>
                </div>
            </div>

            {/* Chart */}
            <div className="rev-chart-wrap">
                <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={weekly} barSize={22} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                            {weekly.map((entry) => (
                                <Cell
                                    key={entry.day}
                                    fill={entry.day === ACTIVE_DAY
                                        ? '#fff'
                                        : 'rgba(255,255,255,0.25)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {/* Day labels */}
                <div className="rev-days">
                    {weekly.map(w => (
                        <span
                            key={w.day}
                            className={`rev-day${w.day === ACTIVE_DAY ? ' active' : ''}`}
                        >{w.day}</span>
                    ))}
                </div>
            </div>

            {/* KPIs */}
            <div className="rev-kpis">
                <div className="rev-kpi">
                    <div className="rev-kpi-label">GROSS REVENUE</div>
                    <div className="rev-kpi-badge">+{grossChange}%</div>
                    <div className="rev-kpi-value">${gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="rev-kpi-divider" />
                <div className="rev-kpi">
                    <div className="rev-kpi-label">AVG. ORDER VALUE</div>
                    <div className="rev-kpi-badge">+{avgOrderChange}%</div>
                    <div className="rev-kpi-value">
                        ${avgOrder.toFixed(2)}
                        <span className="rev-kpi-sub">Growth vs.<br />Last week</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
