import { mockAlert } from '../../lib/mockData'
import { useState, useEffect } from 'react'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import './AlertCard.css'

function useCountdown(initial) {
    const [seconds, setSeconds] = useState(() => {
        const [h, m, s] = initial.split(':').map(Number)
        return h * 3600 + m * 60 + s
    })

    useEffect(() => {
        const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
        return () => clearInterval(t)
    }, [])

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function AlertCard() {
    const { title, body, countdown } = mockAlert
    const timer = useCountdown(countdown)

    return (
        <div className="card card-dark alert-card animate-fade-in">
            <div className="alert-inner">
                <div className="alert-icon-wrap">
                    <AlertTriangle size={22} className="alert-icon" />
                </div>
                <div className="alert-body">
                    <div className="font-bold text-sm" style={{ color: '#fff', letterSpacing: '0.02em' }}>
                        {title}
                    </div>
                    <div className="text-xs text-secondary" style={{ marginTop: 4, lineHeight: 1.5 }}>
                        {body}{' '}
                        <span className="alert-timer animate-pulse-glow">{timer}</span>
                        {' '}hours.
                    </div>
                </div>
                <button className="btn btn-ghost btn-icon alert-expand">
                    <ArrowUpRight size={14} />
                </button>
            </div>
        </div>
    )
}
