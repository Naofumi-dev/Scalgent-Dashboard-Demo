import { useState, useEffect } from 'react'
import { Sparkles, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react'

const CATEGORY_ICONS = {
    pipeline: '🎯',
    automation: '⚡',
    engagement: '💬',
    operations: '🔧',
}

const SEVERITY_COLORS = {
    high: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#fca5a5' },
    medium: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#fcd34d' },
    low: { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', text: '#94a3b8' },
}

export default function AIOptimizerPanel() {
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState('loading')

    const fetchSuggestions = () => {
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || ''
        fetch(`${apiUrl}/api/dashboard/ai-optimizer`)
            .then(r => r.json())
            .then(data => {
                setSuggestions(data.suggestions || [])
                setSource(data.source || 'mock')
            })
            .catch(() => setSource('error'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchSuggestions() }, [])

    return (
        <div className="card card-dark ai-optimizer animate-fade-in">
            <div className="ai-opt-header">
                <div className="ai-opt-title">
                    <Sparkles size={16} color="#a855f7" />
                    <h3>AI Workflow Optimizer</h3>
                    {source === 'gemini' && <span className="ai-opt-badge">Gemini</span>}
                </div>
                <button className="btn btn-ghost btn-icon" onClick={fetchSuggestions} disabled={loading} title="Refresh">
                    <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
                </button>
            </div>

            <div className="ai-opt-list">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="ai-opt-item skeleton" />
                    ))
                ) : (
                    suggestions.map((s, i) => {
                        const sev = SEVERITY_COLORS[s.severity] || SEVERITY_COLORS.medium
                        return (
                            <div key={i} className="ai-opt-item" style={{ background: sev.bg, borderColor: sev.border }}>
                                <div className="ai-opt-item-header">
                                    <span className="ai-opt-category">{CATEGORY_ICONS[s.category] || '💡'}</span>
                                    <span className="ai-opt-item-title">{s.title}</span>
                                    <span className="ai-opt-impact" style={{ color: '#10b981' }}>{s.impact}</span>
                                </div>
                                <p className="ai-opt-desc">{s.description}</p>
                                <button className="ai-opt-apply">
                                    Apply <ArrowRight size={12} />
                                </button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
