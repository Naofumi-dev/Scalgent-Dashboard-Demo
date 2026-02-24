import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { mockAnalytics } from '../lib/mockData'
import { TrendingUp, TrendingDown } from 'lucide-react'
import './Analytics.css'

const CHART_TOOLTIP_STYLE = {
    contentStyle: { background: '#22252a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 },
    labelStyle: { color: '#8b8fa8' },
}

export default function Analytics() {
    const { leadsByDay, pipeline, kpis } = mockAnalytics

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
                {/* Lead volume */}
                <div className="card card-dark chart-card">
                    <div className="font-bold text-sm" style={{ color: '#fff', marginBottom: 16 }}>Lead Volume & Conversions</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={leadsByDay} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...CHART_TOOLTIP_STYLE} />
                            <Bar dataKey="leads" fill="#6c5ce7" radius={[4, 4, 0, 0]} name="Leads" />
                            <Bar dataKey="converted" fill="#00b894" radius={[4, 4, 0, 0]} name="Converted" />
                        </BarChart>
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
                <div className="font-bold text-sm" style={{ color: '#fff', marginBottom: 14 }}>AI Lead Scoring</div>
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
