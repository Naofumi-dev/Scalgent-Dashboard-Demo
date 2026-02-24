import { Zap, Mail, Bot, CheckCircle2, ArrowRight } from 'lucide-react'

export default function WorkflowPreview2D() {
    return (
        <div className="card card-dark animate-fade-in" style={{ display: 'flex', flexDirection: 'column', padding: 24, background: 'rgba(20, 21, 33, 0.4)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div className="flex items-center gap-2">
                    <Zap size={16} color="#60a5fa" />
                    <h2 className="font-bold text-sm" style={{ letterSpacing: '0.05em', color: '#fff' }}>
                        ACTIVE AUTOMATIONS (LIVE)
                    </h2>
                </div>
                <button className="pill-select" style={{ borderColor: 'rgba(96,165,250,0.3)', color: '#60a5fa' }}>Lead Nurture Sequence <span>▾</span></button>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                <Node step="1" icon={<Mail size={16} />} title="Form Submit" color="#6366f1" />
                <Connector val="100%" />
                <Node step="2" icon={<Bot size={16} />} title="AI Score" color="#a855f7" />
                <Connector val="92%" />
                <Node step="3" icon={<Mail size={16} />} title="Sequence" color="#ec4899" />
                <Connector val="41%" alert />
                <Node step="4" icon={<CheckCircle2 size={16} />} title="Closed" color="#10b981" />
            </div>

            <div style={{ marginTop: 20, padding: 16, background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: 12 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                    <ShieldAlertIcon />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#ec4899' }}>Optimization Opportunity</span>
                </div>
                <p style={{ fontSize: 12, color: '#fbcfe8', lineHeight: 1.5, margin: 0 }}>
                    59% of leads drop off between sequence and closing. AI suggests inserting an SMS reminder node.
                </p>
            </div>
        </div>
    )
}

function Node({ step, icon, title, color }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
            <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                border: `1px solid ${color}60`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color,
                boxShadow: `0 0 15px ${color}20`
            }}>
                {icon}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', textAlign: 'center' }}>{title}</span>
        </div>
    )
}

function Connector({ val, alert }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative', top: '-10px' }}>
            <div style={{ width: '100%', height: 2, background: alert ? '#ec4899' : 'rgba(255,255,255,0.1)', position: 'relative' }}>
                <ArrowRight size={12} color={alert ? '#ec4899' : 'rgba(255,255,255,0.3)'} style={{ position: 'absolute', top: -5, right: -5 }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: alert ? '#ec4899' : '#94a3b8' }}>{val}</span>
        </div>
    )
}

function ShieldAlertIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
    )
}
