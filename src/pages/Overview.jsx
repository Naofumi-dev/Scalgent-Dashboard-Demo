import RevenueCard from '../components/cards/RevenueCard'
import AlertCard from '../components/cards/AlertCard'
import CapacityCard from '../components/cards/CapacityCard'
import AILeadCard from '../components/cards/AILeadCard'
import MapCard from '../components/cards/MapCard'
import TimingCard from '../components/cards/TimingCard'
import './Overview.css'

export default function Overview() {
    return (
        <div className="overview-layout">
            {/* Row 1 */}
            <div className="overview-main-col">
                <RevenueCard />
                <div className="overview-bottom-row">
                    <MapCard />
                    <TimingCard />
                </div>
            </div>

            {/* Row 1 right */}
            <div className="overview-side-col">
                <AlertCard />
                <CapacityCard />
                <AILeadCard />
            </div>
        </div>
    )
}
