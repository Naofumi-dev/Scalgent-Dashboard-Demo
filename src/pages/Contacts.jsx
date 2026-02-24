import { useState, useEffect } from 'react'
import { mockContacts } from '../lib/mockData'
import { Search, Filter, Mail, Phone, Tag, Download, Sparkles, CheckCircle2 } from 'lucide-react'
import './Contacts.css'

const STAGE_COLORS = {
    'Qualified Lead': 'purple',
    'Proposal Sent': 'amber',
    'Closed Won': 'green',
    'New Lead': 'coral',
    'Nurturing': 'purple',
}

function ScoreRing({ score }) {
    const r = 18, circ = 2 * Math.PI * r
    const dash = (score / 100) * circ
    const color = score > 80 ? 'var(--green)' : score > 60 ? 'var(--amber)' : 'var(--coral)'
    return (
        <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <circle
                cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
            />
            <text x="22" y="22" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#fff">
                {score}
            </text>
        </svg>
    )
}

export default function Contacts() {
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)
    const [contacts, setContacts] = useState(mockContacts)

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        fetch(`${apiUrl}/api/ghl/contacts`)
            .then(res => res.json())
            .then(data => {
                if (data.contacts && data.contacts.length > 0) {
                    setContacts(data.contacts)
                }
            })
            .catch(err => console.error('Failed to fetch contacts:', err))
    }, [])

    const [enriching, setEnriching] = useState(false)
    const [enrichedData, setEnrichedData] = useState({})
    const [toast, setToast] = useState(null)

    const handleEnrich = (contactId) => {
        if (enriching || enrichedData[contactId]) return
        setEnriching(true)
        setTimeout(() => {
            setEnrichedData(prev => ({
                ...prev,
                [contactId]: {
                    linkedin: 'linkedin.com/in/' + contactId,
                    companySize: '50-200',
                    industry: 'SaaS / B2B'
                }
            }))
            setEnriching(false)
            setToast('Enriched lead synced to Airtable Operations board.')
            setTimeout(() => setToast(null), 4000)
        }, 1500)
    }

    const filtered = contacts.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    )

    const contact = selected || filtered[0]

    return (
        <div className="contacts-layout animate-fade-in">
            {/* List pane */}
            <div className="contacts-list-pane">
                {/* Search */}
                <div className="contacts-search">
                    <Search size={14} className="text-muted" />
                    <input
                        placeholder="Search contacts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="contacts-search-input"
                    />
                    <button className="btn btn-ghost btn-icon" title="Export CSV"><Download size={13} /></button>
                    <button className="btn btn-ghost btn-icon"><Filter size={13} /></button>
                </div>

                {/* List */}
                <div className="contacts-list">
                    {filtered.map(c => (
                        <button
                            key={c.id}
                            className={`contact-row${contact?.id === c.id ? ' active' : ''}`}
                            onClick={() => setSelected(c)}
                        >
                            <div className="contact-avatar">
                                {c.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: 0 }}>
                                <div className="font-semibold text-sm" style={{ color: '#fff' }}>{c.name}</div>
                                <div className="text-xs text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`badge badge-${STAGE_COLORS[c.stage] || 'purple'}`} style={{ fontSize: 10 }}>{c.stage}</span>
                                <span className="text-xs text-muted">{c.lastActivity}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 360 Detail pane */}
            {contact && (
                <div className="contacts-detail animate-fade-in">
                    {/* Header */}
                    <div className="contact-detail-header card card-dark">
                        <div className="contact-detail-avatar">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="font-black text-xl" style={{ color: '#fff' }}>{contact.name}</div>
                            <div className="text-sm text-secondary">{contact.stage}</div>
                            <div className="flex gap-2" style={{ marginTop: 8 }}>
                                {contact.tags.map(t => (
                                    <span key={t} className="badge badge-purple">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="contact-score-ring">
                            <ScoreRing score={contact.score} />
                            <div className="text-xs text-muted" style={{ textAlign: 'center', marginTop: 4 }}>AI Score</div>
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="contact-info-grid">
                        <div className="card card-dark contact-info-card">
                            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                                <Mail size={14} className="text-coral" />
                                <span className="font-bold text-xs text-muted" style={{ letterSpacing: '0.08em' }}>EMAIL</span>
                            </div>
                            <div className="text-sm" style={{ color: '#fff' }}>{contact.email}</div>
                        </div>
                        <div className="card card-dark contact-info-card">
                            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                                <Phone size={14} className="text-coral" />
                                <span className="font-bold text-xs text-muted" style={{ letterSpacing: '0.08em' }}>PHONE</span>
                            </div>
                            <div className="text-sm" style={{ color: '#fff' }}>{contact.phone}</div>
                        </div>
                        <div className="card card-dark contact-info-card">
                            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                                <Tag size={14} className="text-coral" />
                                <span className="font-bold text-xs text-muted" style={{ letterSpacing: '0.08em' }}>LAST ACTIVITY</span>
                            </div>
                            <div className="text-sm" style={{ color: '#fff' }}>{contact.lastActivity}</div>
                        </div>
                        {enrichedData[contact.id] && (
                            <div className="card card-dark contact-info-card" style={{ gridColumn: '1 / -1', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                                    <Sparkles size={14} color="#a855f7" />
                                    <span className="font-bold text-xs" style={{ letterSpacing: '0.08em', color: '#f3e8ff' }}>AI ENRICHED EXTERNAL DATA</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col"><span className="text-xs text-muted">Industry</span><span className="text-sm" style={{ color: '#fff' }}>{enrichedData[contact.id].industry}</span></div>
                                    <div className="flex flex-col"><span className="text-xs text-muted">Company Size</span><span className="text-sm" style={{ color: '#fff' }}>{enrichedData[contact.id].companySize}</span></div>
                                    <div className="flex flex-col"><span className="text-xs text-muted">LinkedIn</span><a href={`https://${enrichedData[contact.id].linkedin}`} target="_blank" className="text-sm" style={{ color: '#60a5fa' }}>{enrichedData[contact.id].linkedin}</a></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="card card-dark">
                        <div className="font-bold text-sm" style={{ color: '#fff', marginBottom: 14 }}>Activity Timeline</div>
                        <div className="contact-timeline">
                            {[
                                { icon: '📧', text: 'Email opened: "VIP Offer Inside"', time: '2h ago', color: 'var(--purple-light)' },
                                { icon: '📞', text: 'Call attempted — no answer', time: '1d ago', color: 'var(--amber)' },
                                { icon: '✅', text: 'Moved to ' + contact.stage, time: '3d ago', color: 'var(--green)' },
                                { icon: '🎯', text: 'Lead created in GHL pipeline', time: '1w ago', color: 'var(--coral)' },
                            ].map((ev, i) => (
                                <div key={i} className="timeline-item">
                                    <div className="timeline-dot" style={{ borderColor: ev.color }}>{ev.icon}</div>
                                    <div className="timeline-body">
                                        <div className="text-sm" style={{ color: '#fff' }}>{ev.text}</div>
                                        <div className="text-xs text-muted">{ev.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 relative">
                        <button className="btn btn-coral" style={{ flex: 1 }}>📧 Send Email</button>
                        <button className="btn btn-purple" style={{ flex: 1 }}>🤖 Add to Workflow</button>
                        <button
                            className="btn btn-ghost"
                            style={{ flex: 1, color: enrichedData[contact.id] ? '#10b981' : '#a855f7', borderColor: enrichedData[contact.id] ? '#10b981' : 'rgba(168,85,247,0.3)' }}
                            onClick={() => handleEnrich(contact.id)}
                            disabled={enriching || enrichedData[contact.id]}
                        >
                            {enriching ? 'Enriching...' : enrichedData[contact.id] ? <><CheckCircle2 size={14} style={{ marginRight: 6 }} /> Enriched & Synced</> : <><Sparkles size={14} style={{ marginRight: 6 }} /> Enrich & Airtable Sync</>}
                        </button>
                    </div>

                    {toast && (
                        <div style={{
                            position: 'absolute', bottom: 30, right: 30,
                            background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                            padding: '12px 24px', borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.3)',
                            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600,
                            zIndex: 50, backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            animation: 'fadeIn 0.3s ease-out'
                        }}>
                            <CheckCircle2 size={16} /> {toast}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
