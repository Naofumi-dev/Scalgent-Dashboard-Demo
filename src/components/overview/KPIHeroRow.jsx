import { TrendingUp, TrendingDown, Users, CheckCircle2, Zap, Target } from 'lucide-react'

const BENCHMARKS = {
    conversionRate: { label: 'Industry Avg', value: 18 },
    completionRate: { label: 'Best-in-class', value: 85 },
    avgLeadScore: { label: 'Healthy', value: 70 },
}

export default function KPIHeroRow({ kpis, loading }) {
    const cards = [
        {
            label: 'Conversion Rate',
            value: `${kpis?.conversionRate || 0}%`,
            icon: <Target size={18} />,
            trend: kpis?.conversionRate > 0 ? 12.5 : -3.2,
            color: '#6366f1',
            benchmark: BENCHMARKS.conversionRate,
            actual: kpis?.conversionRate || 0,
        },
        {
            label: 'Task Completion',
            value: `${kpis?.completionRate || 0}%`,
            icon: <CheckCircle2 size={18} />,
            trend: kpis?.completionRate > 50 ? 8.1 : -5.4,
            color: '#10b981',
            benchmark: BENCHMARKS.completionRate,
            actual: kpis?.completionRate || 0,
        },
        {
            label: 'Active Automations',
            value: kpis?.inProgress || 0,
            icon: <Zap size={18} />,
            trend: 4.2,
            color: '#f59e0b',
            subtitle: `${kpis?.blocked || 0} blocked`,
        },
        {
            label: 'Avg Lead Score',
            value: kpis?.avgLeadScore || 0,
            icon: <Users size={18} />,
            trend: (kpis?.avgLeadScore || 0) > 70 ? 6.7 : -2.1,
            color: '#a855f7',
            benchmark: BENCHMARKS.avgLeadScore,
            actual: kpis?.avgLeadScore || 0,
        },
    ]

    return (
        <div className="kpi-hero-row">
            {cards.map(card => (
                <div key={card.label} className="kpi-hero-card" style={{ '--accent': card.color }}>
                    <div className="kpi-hero-header">
                        <div className="kpi-hero-icon" style={{ background: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <span className="kpi-hero-label">{card.label}</span>
                    </div>
                    <div className="kpi-hero-value">
                        {loading ? <span className="kpi-skeleton" /> : card.value}
                    </div>
                    <div className="kpi-hero-footer">
                        <div className={`kpi-trend ${card.trend >= 0 ? 'positive' : 'negative'}`}>
                            {card.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>{card.trend >= 0 ? '+' : ''}{card.trend}%</span>
                        </div>
                        {card.benchmark && (
                            <div className="kpi-benchmark">
                                <span className="kpi-benchmark-label">{card.benchmark.label}:</span>
                                <span className="kpi-benchmark-val">{card.benchmark.value}%</span>
                            </div>
                        )}
                        {card.subtitle && (
                            <span className="kpi-subtitle">{card.subtitle}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
