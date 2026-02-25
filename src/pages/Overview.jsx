import { useState, useEffect } from 'react'
import KPIHeroRow from '../components/overview/KPIHeroRow'
import ProcessFunnel from '../components/overview/ProcessFunnel'
import WorkflowHealthGrid from '../components/overview/WorkflowHealthGrid'
import AIOptimizerPanel from '../components/overview/AIOptimizerPanel'
import AnomalyFeed from '../components/overview/AnomalyFeed'
import PredictiveSimulator from '../components/overview/PredictiveSimulator'
import AILeadCard from '../components/cards/AILeadCard'
import './Overview.css'

export default function Overview() {
    const [summary, setSummary] = useState(null)
    const [funnel, setFunnel] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || ''

        Promise.all([
            fetch(`${apiUrl}/api/dashboard/summary`).then(r => r.json()),
            fetch(`${apiUrl}/api/dashboard/funnel`).then(r => r.json()),
        ])
            .then(([summaryData, funnelData]) => {
                setSummary(summaryData)
                setFunnel(funnelData)
            })
            .catch(err => console.error('Dashboard data fetch error:', err))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="overview-v2">
            {/* Row 1: KPI Hero Cards */}
            <KPIHeroRow kpis={summary?.kpis} loading={loading} />

            {/* Row 2: Main content grid */}
            <div className="overview-main-grid">
                <div className="overview-left-col">
                    <ProcessFunnel
                        funnel={funnel?.funnel}
                        totalContacts={funnel?.totalContacts}
                        bottleneck={funnel?.bottleneck}
                        loading={loading}
                    />
                    <WorkflowHealthGrid tasks={summary?.tasks} loading={loading} />
                </div>
                <div className="overview-right-col">
                    <AIOptimizerPanel />
                    <AnomalyFeed tasks={summary?.tasks} contacts={summary?.contacts} />
                </div>
            </div>

            {/* Row 3: Intelligence panel */}
            <div className="overview-intel-grid">
                <PredictiveSimulator kpis={summary?.kpis} />
                <AILeadCard />
            </div>
        </div>
    )
}
