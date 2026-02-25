import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts'
import { ArrowUpRight } from 'lucide-react'

// Mock 7-day trend data for the mini chart
const mockData = [
    { value: 40 }, { value: 30 }, { value: 60 }, { value: 50 },
    { value: 70 }, { value: 85 }, { value: 110 }
]

export default function TotalLeadsCard({ funnel, loading }) {
    if (loading) return <div className="cashmate-card" style={{ opacity: 0.5 }}>Loading...</div>

    const total = funnel?.totalContacts || 1245

    return (
        <div className="cashmate-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="cashmate-card-header">
                <span className="cashmate-card-title">TOTAL LEADS PROCESSED</span>
                <span className="cashmate-card-subtitle">
                    Last 7 Days
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div>
                    <div className="cashmate-value-large">
                        {total.toLocaleString()}
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <span className="cashmate-trend positive">
                            <ArrowUpRight size={12} style={{ marginRight: 4 }} /> 18.2%
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>vs last period</span>
                    </div>
                </div>

                {/* Mini Bar Chart */}
                <div style={{ width: '80px', height: '40px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockData}>
                            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                {mockData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === mockData.length - 1 ? '#2ecc71' : 'rgba(255,255,255,0.1)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
