import { AlertTriangle, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

const SEVERITY_CONFIG = {
    critical: { icon: <AlertCircle size={14} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    warning: { icon: <AlertTriangle size={14} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    info: { icon: <Clock size={14} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    resolved: { icon: <CheckCircle2 size={14} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
}

export default function AnomalyFeed({ tasks, contacts }) {
    // Generate anomalies from real data
    const anomalies = []

    // Check overdue tasks
    const overdue = (tasks || []).filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed')
    if (overdue.length > 0) {
        anomalies.push({
            severity: 'critical',
            title: `${overdue.length} overdue task${overdue.length > 1 ? 's' : ''} detected`,
            detail: `"${overdue[0]?.name}" assigned to ${overdue[0]?.assignee} — was due ${overdue[0]?.dueDate}`,
            action: 'Reassign or escalate now',
        })
    }

    // Check blocked tasks
    const blocked = (tasks || []).filter(t => t.status === 'Blocked')
    if (blocked.length > 0) {
        anomalies.push({
            severity: 'warning',
            title: `${blocked.length} workflow${blocked.length > 1 ? 's' : ''} blocked`,
            detail: `"${blocked[0]?.name}" is stuck — check dependencies and unblock`,
            action: 'Review blockers',
        })
    }

    // Check lead pipeline
    const allNewLeads = (contacts || []).every(c => c.stage === 'New Lead')
    if ((contacts || []).length > 0 && allNewLeads) {
        anomalies.push({
            severity: 'warning',
            title: 'Pipeline stagnation detected',
            detail: 'All contacts are in "New Lead" stage — no stage progression detected',
            action: 'Add qualification workflow',
        })
    }

    // Check task load
    const inProgress = (tasks || []).filter(t => t.status === 'In Progress')
    if (inProgress.length >= 8) {
        anomalies.push({
            severity: 'info',
            title: 'High task concurrency',
            detail: `${inProgress.length} tasks running simultaneously — risk of team burnout`,
            action: 'Consider prioritization',
        })
    }

    // Always show at least a resolved status
    if (anomalies.length === 0) {
        anomalies.push({
            severity: 'resolved',
            title: 'All systems operational',
            detail: 'No anomalies detected — all workflows running smoothly',
            action: null,
        })
    }

    return (
        <div className="card card-dark anomaly-feed animate-fade-in">
            <div className="anomaly-header">
                <AlertTriangle size={16} color="#f59e0b" />
                <h3>Anomaly Detection</h3>
                <span className="anomaly-count">{anomalies.filter(a => a.severity !== 'resolved').length} alerts</span>
            </div>

            <div className="anomaly-list">
                {anomalies.map((a, i) => {
                    const cfg = SEVERITY_CONFIG[a.severity] || SEVERITY_CONFIG.info
                    return (
                        <div key={i} className="anomaly-item" style={{ background: cfg.bg }}>
                            <div className="anomaly-icon" style={{ color: cfg.color }}>{cfg.icon}</div>
                            <div className="anomaly-body">
                                <div className="anomaly-title" style={{ color: cfg.color }}>{a.title}</div>
                                <div className="anomaly-detail">{a.detail}</div>
                                {a.action && (
                                    <button className="anomaly-action" style={{ color: cfg.color }}>
                                        {a.action} →
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
