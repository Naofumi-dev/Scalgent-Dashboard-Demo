import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { ArrowUpRight } from 'lucide-react'

// Spiky upward data
const mockData = [
    { value: 1200 }, { value: 3000 }, { value: 2500 }, { value: 5000 },
    { value: 4800 }, { value: 8000 }, { value: 12450 }
]

export default function ForecastRevenueCard({ summary, loading }) {
    if (loading) return <div className="cashmate-card" style={{ opacity: 0.5 }}>Loading...</div>

    // If we have actual revenue data later, use it, else default to this exciting number.
    const revenue = 12450.00

    return (
        <div className="cashmate-card" style={{ background: 'linear-gradient(145deg, #111 0%, #1a1a1a 100%)' }}>
            <div className="cashmate-card-header">
                <span className="cashmate-card-title" style={{ color: '#c4b5fd' }}>AI FORECASTED REVENUE</span>
                <span className="cashmate-card-subtitle">
                    Next 30 Days
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: 'auto 0 0 0' }}>
                <div>
                    <div className="cashmate-value-large" style={{ color: '#fff' }}>
                        ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <span className="cashmate-trend" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c4b5fd' }}>
                            <ArrowUpRight size={12} style={{ marginRight: 4 }} /> High Confidence
                        </span>
                    </div>
                </div>

                {/* Mini Line Chart */}
                <div style={{ width: '90px', height: '40px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#a855f7"
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
