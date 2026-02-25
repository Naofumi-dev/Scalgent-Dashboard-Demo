import { ArrowDown, AlertTriangle } from 'lucide-react'

const STAGE_COLORS = {
    'New Lead': '#6366f1',
    'Qualified': '#8b5cf6',
    'Proposal': '#ec4899',
    'Negotiation': '#f59e0b',
    'Closed Won': '#10b981',
}

export default function ProcessFunnel({ funnel, totalContacts, bottleneck, loading }) {
    if (loading) {
        return (
            <div className="card card-dark process-funnel animate-fade-in">
                <div className="funnel-header">
                    <h3>Lead Acquisition Funnel</h3>
                </div>
                <div className="funnel-skeleton">Loading pipeline...</div>
            </div>
        )
    }

    const maxCount = Math.max(...(funnel || []).map(f => f.count), 1)

    return (
        <div className="card card-dark process-funnel animate-fade-in">
            <div className="funnel-header">
                <div className="funnel-title-row">
                    <h3>Lead Acquisition Funnel</h3>
                    <span className="funnel-total">{totalContacts} contacts</span>
                </div>
            </div>

            <div className="funnel-stages">
                {(funnel || []).map((stage, i) => {
                    const width = Math.max((stage.count / maxCount) * 100, 8)
                    const color = STAGE_COLORS[stage.stage] || '#6366f1'
                    return (
                        <div key={stage.stage} className="funnel-stage-row">
                            <div className="funnel-stage-label">
                                <span className="funnel-dot" style={{ background: color }} />
                                <span className="funnel-stage-name">{stage.stage}</span>
                            </div>
                            <div className="funnel-bar-wrap">
                                <div
                                    className="funnel-bar"
                                    style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                                >
                                    <span className="funnel-count">{stage.count}</span>
                                </div>
                            </div>
                            <span className="funnel-pct">{stage.percentage}%</span>
                            {i > 0 && stage.dropOff > 0 && (
                                <div className="funnel-dropoff">
                                    <ArrowDown size={10} />
                                    <span>{stage.dropOff}%</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {bottleneck && bottleneck.dropOff > 0 && (
                <div className="funnel-bottleneck">
                    <AlertTriangle size={14} />
                    <span>
                        Biggest drop-off: <strong>{bottleneck.stage}</strong> ({bottleneck.dropOff}% loss)
                        — Consider adding automated nurture sequence
                    </span>
                </div>
            )}
        </div>
    )
}
