import { useState, useEffect } from 'react'
import TotalLeadsCard from '../components/overview/TotalLeadsCard'
import UptimeCard from '../components/overview/UptimeCard'
import ForecastRevenueCard from '../components/overview/ForecastRevenueCard'
import RecentLogsList from '../components/overview/RecentLogsList'
import ErrorBreakdownChart from '../components/overview/ErrorBreakdownChart'
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
        <div className="overview-cashmate">
            {/* Top Row: Key Metrics */}
            <div className="overview-top-row">
                <TotalLeadsCard funnel={funnel} loading={loading} />
                <UptimeCard summary={summary} loading={loading} />
                <ForecastRevenueCard summary={summary} loading={loading} />
            </div>

            {/* Main Content Area */}
            <div className="overview-main-area">
                <div className="overview-left-col">
                    <RecentLogsList tasks={summary?.tasks} loading={loading} />
                </div>
                <div className="overview-right-col">
                    <ErrorBreakdownChart summary={summary} loading={loading} />
                </div>
            </div>
        </div>
    )
}
