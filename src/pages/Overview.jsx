import RevenueCard from '../components/cards/RevenueCard'
import AlertCard from '../components/cards/AlertCard'
import CapacityCard from '../components/cards/CapacityCard'
import AILeadCard from '../components/cards/AILeadCard'
import PredictiveAnalyticsCard from '../components/cards/PredictiveAnalyticsCard'
import WorkflowPreview2D from '../components/cards/WorkflowPreview2D'
import './Overview.css'

export default function Overview() {
    return (
        <div className="overview-layout">
            <div className="overview-main-col">
                <RevenueCard />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    <PredictiveAnalyticsCard />
                    <WorkflowPreview2D />
                </div>
            </div>

            <div className="overview-side-col">
                <AlertCard />
                <CapacityCard />
                <AILeadCard />
            </div>
        </div>
    )
}
