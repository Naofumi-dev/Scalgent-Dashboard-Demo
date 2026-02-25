import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { ArrowUpRight } from 'lucide-react'

// Smooth upward trending data
const mockData = [
    { value: 99.1 }, { value: 99.2 }, { value: 99.5 }, { value: 99.4 },
    { value: 99.7 }, { value: 99.8 }, { value: 99.9 }
]

export default function UptimeCard({ summary, loading }) {
    if (loading) return <div className="cashmate-card" style={{ opacity: 0.5 }}>Loading...</div>

    return (
        <div className="cashmate-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="cashmate-card-header">
                <span className="cashmate-card-title">WORKFLOW UPTIME</span>
                <span className="cashmate-card-subtitle">
                    System Health
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div>
                    <div className="cashmate-value-large">
                        99.9%
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <span className="cashmate-trend positive">
                            <ArrowUpRight size={12} style={{ marginRight: 4 }} /> 0.2%
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>Status: Optimal</span>
                    </div>
                </div>

                {/* Mini Line Chart */}
                <div style={{ width: '90px', height: '40px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#2ecc71"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
