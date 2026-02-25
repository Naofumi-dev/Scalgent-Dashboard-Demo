import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Time-series mock data for the stacked bar chart
const mockData = [
    { name: 'May', apiFailures: 400, leadDrops: 240, timeouts: 150 },
    { name: 'Jun', apiFailures: 300, leadDrops: 139, timeouts: 220 },
    { name: 'Jul', apiFailures: 200, leadDrops: 480, timeouts: 110 },
    { name: 'Aug', apiFailures: 278, leadDrops: 390, timeouts: 90 },
    { name: 'Sep', apiFailures: 189, leadDrops: 200, timeouts: 80 },
    { name: 'Oct', apiFailures: 120, leadDrops: 90, timeouts: 45 },
]

export default function ErrorBreakdownChart({ summary, loading }) {
    if (loading) return <div className="cashmate-card" style={{ opacity: 0.5 }}>Loading...</div>

    return (
        <div className="cashmate-card" style={{ height: '100%', minHeight: '400px' }}>
            <div className="cashmate-card-header" style={{ marginBottom: '32px' }}>
                <div>
                    <span className="cashmate-card-title">ERROR BREAKDOWN (6 MONTHS)</span>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                        <span className="cashmate-value-large">255</span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Total this month</span>
                        <span className="cashmate-trend positive" style={{ marginLeft: '8px' }}>-45%</span>
                    </div>
                </div>

                {/* Custom Legend to match CASHMATE top-right stats area */}
                <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
                    <div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>API Failures</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#e74c3c' }}>1,487</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Lead Drops</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#f39c12' }}>1,539</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Timeouts</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#9b59b6' }}>695</div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="apiFailures" stackId="a" fill="#e74c3c" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="leadDrops" stackId="a" fill="#f39c12" />
                        <Bar dataKey="timeouts" stackId="a" fill="#9b59b6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
