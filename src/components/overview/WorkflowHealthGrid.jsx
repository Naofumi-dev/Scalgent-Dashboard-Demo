import { CheckCircle2, Clock, AlertCircle, Pause, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const STATUS_CONFIG = {
    'Completed': { color: '#10b981', icon: <CheckCircle2 size={13} />, bg: 'rgba(16,185,129,0.1)' },
    'In Progress': { color: '#6366f1', icon: <Clock size={13} />, bg: 'rgba(99,102,241,0.1)' },
    'Not Started': { color: '#64748b', icon: <Pause size={13} />, bg: 'rgba(100,116,139,0.1)' },
    'Blocked': { color: '#ef4444', icon: <AlertCircle size={13} />, bg: 'rgba(239,68,68,0.1)' },
}

const PRIORITY_COLORS = {
    'Critical': '#ef4444',
    'High': '#f59e0b',
    'Medium': '#6366f1',
    'Low': '#64748b',
}

export default function WorkflowHealthGrid({ tasks, loading }) {
    if (loading) {
        return (
            <div className="card card-dark wf-health animate-fade-in">
                <div className="wf-health-header"><h3>Workflow Health</h3></div>
                <div className="funnel-skeleton">Loading tasks...</div>
            </div>
        )
    }

    // Status breakdown for pie chart
    const statusCounts = {}
        ; (tasks || []).forEach(t => {
            statusCounts[t.status] = (statusCounts[t.status] || 0) + 1
        })
    const pieData = Object.entries(statusCounts).map(([name, value]) => ({
        name, value, fill: STATUS_CONFIG[name]?.color || '#64748b',
    }))

    // Show top 5 tasks sorted by priority
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    const topTasks = [...(tasks || [])].sort((a, b) =>
        (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5)
    ).slice(0, 6)

    return (
        <div className="card card-dark wf-health animate-fade-in">
            <div className="wf-health-header">
                <h3>Workflow Health</h3>
                <div className="wf-status-pills">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <span key={status} className="wf-status-pill" style={{
                            background: STATUS_CONFIG[status]?.bg || 'rgba(100,116,139,0.1)',
                            color: STATUS_CONFIG[status]?.color || '#64748b',
                        }}>
                            {STATUS_CONFIG[status]?.icon} {count}
                        </span>
                    ))}
                </div>
            </div>

            <div className="wf-health-body">
                <div className="wf-health-chart">
                    <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1e1c26', border: 'none', borderRadius: 8, fontSize: 12, color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="wf-chart-center">
                        <span className="wf-chart-total">{tasks?.length || 0}</span>
                        <span className="wf-chart-label">Total</span>
                    </div>
                </div>

                <div className="wf-task-list">
                    {topTasks.map(task => {
                        const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG['Not Started']
                        return (
                            <div key={task.id} className="wf-task-row">
                                <div className="wf-task-status" style={{ color: cfg.color }}>{cfg.icon}</div>
                                <div className="wf-task-info">
                                    <span className="wf-task-name">{task.name}</span>
                                    <span className="wf-task-assignee">{task.assignee}</span>
                                </div>
                                <span className="wf-task-priority" style={{ color: PRIORITY_COLORS[task.priority] || '#64748b' }}>
                                    {task.priority}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
