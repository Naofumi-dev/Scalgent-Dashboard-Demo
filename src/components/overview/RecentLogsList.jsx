import { GitCommit, Activity, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RecentLogsList({ tasks, loading }) {
    if (loading) return <div className="cashmate-card" style={{ opacity: 0.5 }}>Loading...</div>

    // Format tasks to look like transactions, or use mock data if none
    const logs = (tasks || []).slice(0, 8).map(task => {
        const isError = task.Status === 'Blocked' || task.Status === 'Overdue'
        const isSuccess = task.Status === 'Completed' || task.Status === 'In Progress'

        return {
            id: task.id,
            name: task.Name,
            date: new Date(task['Created Time'] || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            status: task.Status,
            isError,
            isSuccess,
            impact: isError ? '-$25.00' : '+$150.00' // Fake financial impact for the "CASHMATE" feel
        }
    })

    if (logs.length === 0) {
        // Fallback mock logs
        logs.push(
            { id: 1, name: 'Lead Enrichment Sync', date: 'Oct 24, 10:30 AM', status: 'Success', isSuccess: true, impact: '+$150.00' },
            { id: 2, name: 'GHL Pipeline Trigger', date: 'Oct 24, 09:15 AM', status: 'Failed', isError: true, impact: '-$45.00' },
            { id: 3, name: 'Campaign Welcome Email', date: 'Oct 23, 14:20 PM', status: 'Success', isSuccess: true, impact: '+$12.50' },
            { id: 4, name: 'Airtable Master Sync', date: 'Oct 23, 11:00 AM', status: 'Success', isSuccess: true, impact: '+$300.00' },
            { id: 5, name: 'Stripe Payment Webhook', date: 'Oct 22, 16:45 PM', status: 'Success', isSuccess: true, impact: '+$99.00' },
            { id: 6, name: 'AI Optimization Run', date: 'Oct 22, 02:30 AM', status: 'Warning', impact: '$0.00' },
        )
    }

    return (
        <div className="cashmate-card" style={{ height: '100%' }}>
            <div className="cashmate-card-header">
                <span className="cashmate-card-title">RECENT WORKFLOW LOGS</span>
                <span className="cashmate-card-subtitle" style={{ color: '#2ecc71' }}>
                    View All
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
                {logs.map(log => (
                    <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>

                        {/* Icon */}
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: log.isError ? 'rgba(231, 76, 60, 0.1)' : log.isSuccess ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            {log.isError ? <AlertCircle size={18} color="#e74c3c" /> :
                                log.isSuccess ? <CheckCircle2 size={18} color="#2ecc71" /> :
                                    <Activity size={18} color="#aaa" />}
                        </div>

                        {/* Name & Date */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {log.name}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                                {log.date}
                            </span>
                        </div>

                        {/* Impact / Amount */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{
                                fontSize: '14px', fontWeight: 600, fontFamily: 'monospace',
                                color: log.isError ? '#fff' : '#2ecc71'
                            }}>
                                {log.impact}
                            </span>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px', textTransform: 'uppercase' }}>
                                {log.status}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}
