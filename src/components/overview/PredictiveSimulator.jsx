import { useState } from 'react'
import { Wand2, TrendingUp, Users, Zap } from 'lucide-react'

export default function PredictiveSimulator({ kpis }) {
    const [leadIncrease, setLeadIncrease] = useState(25)
    const [automationBoost, setAutomationBoost] = useState(15)

    const currentLeads = kpis?.totalContacts || 3
    const currentTasks = kpis?.totalTasks || 26
    const currentCompletionRate = kpis?.completionRate || 35

    // Projections
    const projectedLeads = Math.round(currentLeads * (1 + leadIncrease / 100))
    const projectedTaskLoad = Math.round(currentTasks * (1 + leadIncrease / 200))
    const projectedCompletion = Math.min(100, currentCompletionRate + automationBoost)
    const timeSaved = Math.round(automationBoost * 0.4) // ~0.4 hrs per % automation

    return (
        <div className="card card-dark pred-sim animate-fade-in">
            <div className="pred-sim-header">
                <Wand2 size={16} color="#a855f7" />
                <h3>Predictive Simulator</h3>
            </div>

            <div className="pred-sim-controls">
                <div className="pred-slider-group">
                    <div className="pred-slider-label">
                        <Users size={13} />
                        <span>Lead volume increase</span>
                        <strong>+{leadIncrease}%</strong>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={leadIncrease}
                        onChange={e => setLeadIncrease(Number(e.target.value))}
                        className="pred-slider"
                    />
                </div>

                <div className="pred-slider-group">
                    <div className="pred-slider-label">
                        <Zap size={13} />
                        <span>Automation efficiency</span>
                        <strong>+{automationBoost}%</strong>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={50}
                        value={automationBoost}
                        onChange={e => setAutomationBoost(Number(e.target.value))}
                        className="pred-slider"
                    />
                </div>
            </div>

            <div className="pred-sim-results">
                <div className="pred-result">
                    <span className="pred-result-label">Projected Leads</span>
                    <span className="pred-result-value" style={{ color: '#6366f1' }}>
                        {currentLeads} → {projectedLeads}
                    </span>
                </div>
                <div className="pred-result">
                    <span className="pred-result-label">Task Load</span>
                    <span className="pred-result-value" style={{ color: '#f59e0b' }}>
                        {currentTasks} → {projectedTaskLoad}
                    </span>
                </div>
                <div className="pred-result">
                    <span className="pred-result-label">Completion Rate</span>
                    <span className="pred-result-value" style={{ color: '#10b981' }}>
                        {currentCompletionRate}% → {projectedCompletion}%
                    </span>
                </div>
                <div className="pred-result highlight">
                    <span className="pred-result-label">Est. Time Saved</span>
                    <span className="pred-result-value" style={{ color: '#a855f7' }}>
                        ~{timeSaved} hrs/week
                    </span>
                </div>
            </div>
        </div>
    )
}
