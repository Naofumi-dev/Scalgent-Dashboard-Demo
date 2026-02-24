import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { mockAnalytics } from '../lib/mockData'
import { TrendingUp, TrendingDown, Sparkles, ShieldAlert } from 'lucide-react'
import './Analytics.css'

const CHART_TOOLTIP_STYLE = {
    contentStyle: { background: '#22252a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 },
    labelStyle: { color: '#8b8fa8' },
}

export default function Analytics() {
    const { pipeline, kpis } = mockAnalytics

    const revenueForecast = [
        { month: 'Jan', actual: 45000, projected: 45000 },
        { month: 'Feb', actual: 52000, projected: 52000 },
        { month: 'Mar', actual: 48000, projected: 48000 },
        { month: 'Apr', actual: 61000, projected: 61000 },
        { month: 'May', projected: 69000 },
        { month: 'Jun', projected: 78000 },
    ]

    return (
        <div className="analytics-layout animate-fade-in">
            {/* KPI row */}
            <div className="kpi-row">
                {kpis.map(kpi => (
                    <div key={kpi.label} className="card card-dark kpi-card">
                        <div className="text-xs text-secondary" style={{ marginBottom: 6 }}>{kpi.label}</div>
                        <div className="font-black text-2xl" style={{ color: '#fff', letterSpacing: '-0.5px' }}>
                            {kpi.value}
                        </div>
                        <div className={`flex items-center gap-1 ${kpi.change >= 0 ? 'text-green' : 'text-coral'}`} style={{ marginTop: 4, fontSize: 12 }}>
                            {kpi.change >= 0
                                ? <TrendingUp size={13} />
                                : <TrendingDown size={13} />}
                            <span>{kpi.change >= 0 ? '+' : ''}{kpi.change}%</span>
                            <span className="text-muted text-xs">vs last week</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="charts-row">
                {/* ML Revenue Forecast */}
                <div className="card card-dark chart-card" style={{ flex: 2 }}>
                    <div className="flex items-center gap-2 mb-4" style={{ marginBottom: 16 }}>
                        <Sparkles size={16} color="#a855f7" />
                        <div className="font-bold text-sm" style={{ color: '#fff' }}>AI Revenue Forecast (6mo)</div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueForecast}>
                            <defs>
                                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...CHART_TOOLTIP_STYLE} />
                            <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#actualGrad)" name="Actual Revenue" />
                            <Area type="monotone" dataKey="projected" stroke="#a855f7" strokeDasharray="5 5" strokeWidth={3} fillOpacity={1} fill="url(#projGrad)" name="AI Projected" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pipeline */}
                <div className="card card-dark chart-card">
                    <div className="font-bold text-sm" style={{ color: '#fff', marginBottom: 16 }}>Pipeline Health</div>
                    <div className="pipeline-chart-inner">
                        <ResponsiveContainer width={180} height={180}>
                            <PieChart>
                                <Pie dataKey="value" data={pipeline} cx="50%" cy="50%" innerRadius={55} outerRadius={80} strokeWidth={0}>
                                    {pipeline.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                </Pie>
                                <Tooltip {...CHART_TOOLTIP_STYLE} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pipeline-legend">
                            {pipeline.map(p => (
                                <div key={p.stage} className="flex items-center gap-2">
                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.fill, flexShrink: 0, display: 'inline-block' }} />
                                    <span className="text-xs text-secondary">{p.stage}</span>
                                    <span className="text-xs font-semibold" style={{ color: '#fff', marginLeft: 'auto' }}>{p.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead scoring table */}
            <div className="card card-dark">
                <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
                    <ShieldAlert size={16} color="#ec4899" />
                    <div className="font-bold text-sm" style={{ color: '#fff' }}>Predictive Churn Risk Ledger</div>
                </div>
                <table className="lead-table">
                    <thead>
                        <tr>
                            <th>Contact</th><th>Stage</th><th>Score</th><th>Churn Risk</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'Sarah Chen', stage: 'Qualified', score: 87, churn: 'Low', risk: 'green' },
                            { name: 'Marcus Rivera', stage: 'Proposal', score: 62, churn: 'Medium', risk: 'amber' },
                            { name: 'Priya Patel', stage: 'Won', score: 95, churn: 'Very Low', risk: 'green' },
                            { name: 'James Okafor', stage: 'New Lead', score: 41, churn: 'High', risk: 'coral' },
                            { name: 'Lucia Martinez', stage: 'Nurturing', score: 73, churn: 'Low', risk: 'green' },
                        ].map(row => (
                            <tr key={row.name}>
                                <td className="font-medium text-sm" style={{ color: '#fff' }}>{row.name}</td>
                                <td className="text-xs text-secondary">{row.stage}</td>
                                <td>
                                    <div className="score-bar-wrap">
                                        <div className="score-bar" style={{ width: `${row.score}%`, background: row.score > 80 ? 'var(--green)' : row.score > 60 ? 'var(--amber)' : 'var(--coral)' }} />
                                        <span className="text-xs font-semibold" style={{ color: '#fff' }}>{row.score}</span>
                                    </div>
                                </td>
                                <td><span className={`badge badge-${row.risk}`}>{row.churn}</span></td>
                                <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Nurture</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
