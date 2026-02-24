import { useState, useEffect } from 'react'
import { Calendar, User, AlertCircle, Clock, Download } from 'lucide-react'
import './Tasks.css'

const COLUMNS = [
    { id: 'todo', title: 'To Do', statuses: ['To Do', 'Not Started'] },
    { id: 'in_progress', title: 'In Progress', statuses: ['In Progress'] },
    { id: 'review', title: 'Review', statuses: ['For Review', 'Revision Needed'] },
    { id: 'blocked', title: 'Blocked', statuses: ['Blocked'] },
    { id: 'completed', title: 'Completed', statuses: ['Completed'] }
]

const PRIORITY_COLORS = {
    'Low': 'var(--purple-light)',
    'Medium': 'var(--amber)',
    'High': 'var(--coral)',
    'Critical': 'var(--red)'
}

export default function Tasks() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        fetch(`${apiUrl}/api/airtable/tasks`)
            .then(res => res.json())
            .then(data => {
                if (data.tasks) {
                    setTasks(data.tasks)
                }
            })
            .catch(err => console.error('Failed to fetch tasks:', err))
            .finally(() => setLoading(false))
    }, [])

    const getTasksByColumn = (columnStatuses) => {
        return tasks.filter(t => columnStatuses.includes(t.status))
    }

    if (loading) {
        return (
            <div className="tasks-layout flex items-center justify-center h-full">
                <div className="text-muted">Loading Airtable tasks...</div>
            </div>
        )
    }

    return (
        <div className="tasks-layout animate-fade-in">
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
                <div>
                    <h1 className="font-black text-2xl" style={{ color: '#fff' }}>Projects & Tasks</h1>
                    <p className="text-sm text-secondary">Live sync with Scalgent Ops Tracker (Airtable)</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-ghost" title="Export Tasks (CSV)">
                        <Download size={15} style={{ marginRight: 6 }} /> Export
                    </button>
                    <button className="btn btn-purple">
                        <span style={{ marginRight: 6 }}>+</span> New Task
                    </button>
                </div>
            </div>

            <div className="kanban-board">
                {COLUMNS.map(col => {
                    const columnTasks = getTasksByColumn(col.statuses)
                    return (
                        <div key={col.id} className="kanban-col">
                            <div className="kanban-col-header">
                                <h3 className="font-bold text-sm" style={{ color: '#fff' }}>{col.title}</h3>
                                <span className="kanban-col-count">{columnTasks.length}</span>
                            </div>

                            <div className="kanban-cards">
                                {columnTasks.map(task => (
                                    <div key={task.id} className="card card-dark kanban-task-card">
                                        <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: PRIORITY_COLORS[task.priority] + '20',
                                                    color: PRIORITY_COLORS[task.priority] || '#fff',
                                                    border: `1px solid ${PRIORITY_COLORS[task.priority]}40`
                                                }}
                                            >
                                                {task.priority || 'Normal'}
                                            </span>
                                        </div>

                                        <h4 className="font-semibold text-sm" style={{ color: '#fff', marginBottom: 16 }}>
                                            {task.name}
                                        </h4>

                                        <div className="task-meta-row">
                                            {task.dueDate && (
                                                <div className="task-meta-item">
                                                    <Calendar size={12} className="text-secondary" />
                                                    <span className="text-xs text-secondary">{new Date(task.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            <div className="task-meta-item">
                                                <User size={12} className="text-secondary" />
                                                <span className="text-xs text-secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80 }}>
                                                    {task.assignee}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {columnTasks.length === 0 && (
                                    <div className="kanban-empty">No tasks</div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}
