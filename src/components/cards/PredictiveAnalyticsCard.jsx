import { AlertTriangle, TrendingDown, ShieldAlert, ArrowRight } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

const churnData = [
    { day: 'Mon', risk: 12 },
    { day: 'Tue', risk: 14 },
    { day: 'Wed', risk: 18 },
    { day: 'Thu', risk: 15 },
    { day: 'Fri', risk: 24 },
    { day: 'Sat', risk: 28 },
    { day: 'Sun', risk: 32 },
]

export default function PredictiveAnalyticsCard() {
    return (
        <div className="card card-dark animate-fade-in" style={{ display: 'flex', flexDirection: 'column', padding: 24, background: 'linear-gradient(145deg, rgba(30, 27, 36, 0.8) 0%, rgba(20, 18, 26, 0.95) 100%)', border: '1px solid rgba(236, 72, 153, 0.15)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div className="flex items-center gap-2">
                    <ShieldAlert size={16} color="#ec4899" />
                    <h2 className="font-bold text-sm" style={{ letterSpacing: '0.05em', color: '#fff' }}>
                        CHURN FORECAST (ML)
                    </h2>
                </div>
                <button className="pill-select" style={{ borderColor: 'rgba(236,72,153,0.3)', color: '#ec4899' }}>next 7 days <span>▾</span></button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.5 }}>
                AI models predict a <strong style={{ color: '#ec4899' }}>32% spike</strong> in churn risk for the 'SaaS Founders' segment based on recent email engagement drops.
            </p>

            <div style={{ height: 60, width: '100%', marginBottom: 20 }}>
                <ResponsiveContainer>
                    <AreaChart data={churnData}>
                        <defs>
                            <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ background: '#1e1c26', border: 'none', borderRadius: 8, fontSize: 12, color: '#fff' }} itemStyle={{ color: '#ec4899' }} />
                        <Area type="monotone" dataKey="risk" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#churnGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2">
                {[
                    { name: 'TechFlow Inc.', mrr: '$2,400/mo', prob: '89%' },
                    { name: 'Growth Labs', mrr: '$1,100/mo', prob: '74%' },
                    { name: 'Elevate SaaS', mrr: '$3,800/mo', prob: '68%' }
                ].map(company => (
                    <div key={company.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex flex-col">
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{company.name}</span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>{company.mrr} Risk</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#ec4899' }}>{company.prob}</span>
                            <button style={{ background: 'rgba(236,72,153,0.15)', color: '#fbcfe8', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Mitigate</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
