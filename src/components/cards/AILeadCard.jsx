import { useState, useRef, useEffect } from 'react'
import { mockAIMessages } from '../../lib/mockData'
import { Send, Plus, ArrowUpRight, Mic } from 'lucide-react'
import './AILeadCard.css'

const SUGGESTIONS = [
    'Show labor cost',
    'Initiate strategy planning',
    'Churn risk analysis',
    'Top performing workflow',
]

const BOT_RESPONSES = {
    'show labor cost': 'Labor cost is currently at 28% of gross revenue — 4% above target. The main driver is overtime in the nurture sequence. I recommend capping batch sends to business hours.',
    'initiate strategy planning': 'I\'ve queued a strategy session. Key focus areas: (1) AOV recovery via upsell flows, (2) labor cost reduction via automation, (3) churn prevention for at-risk accounts.',
    'churn risk analysis': '14 contacts show >70% churn probability. Top signals: 21+ days inactive, no email opens in 3 weeks, pipeline stall. Recommended: trigger re-engagement workflow now.',
    'top performing workflow': '"Lead Nurture Sequence" leads with 94% success rate and 8 active nodes. It generates an estimated $34K/mo pipeline value. Consider cloning it for your enterprise segment.',
}

export default function AILeadCard() {
    const [messages, setMessages] = useState(mockAIMessages)
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, typing])

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        // Fetch AI insights directly on load
        fetch(`${apiUrl}/api/insights`)
            .then(res => res.json())
            .then(data => {
                if (data.insights && data.insights.length > 0) {
                    const text = data.insights.map(i =>
                        `${i.type === 'warning' ? '⚠️' : i.type === 'success' ? '✅' : '💡'} ${i.message}`
                    ).join('\n\n')
                    setMessages(m => [...m, { id: 'insights-load', role: 'assistant', text: `Here are your latest insights:\n\n${text}` }])
                }
            })
            .catch(err => console.error('Failed to fetch insights:', err))
    }, [])

    const sendMessage = async (text) => {
        const userMsg = text || input.trim()
        if (!userMsg) return
        setInput('')
        setMessages(m => [...m, { id: Date.now(), role: 'user', text: userMsg }])
        setTyping(true)

        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const res = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            })
            if (res.ok) {
                const data = await res.json()
                setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', text: data.reply }])
            } else {
                throw new Error('server error')
            }
        } catch {
            // Local fallback when backend is not running
            const key = userMsg.toLowerCase()
            const response = Object.entries(BOT_RESPONSES).find(([k]) => key.includes(k))
            const reply = response?.[1] || `Analyzing GHL data for "${userMsg}"... Pipeline health is stable. Want a detailed breakdown?`
            setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', text: reply }])
        } finally {
            setTyping(false)
        }
    }

    return (
        <div className="card card-dark ai-card animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <h2 className="font-black text-sm" style={{ letterSpacing: '0.05em', color: '#fff' }}>
                    AI OPERATIONS LEAD
                </h2>
                <button className="btn btn-ghost btn-icon"><ArrowUpRight size={14} /></button>
            </div>

            {/* Messages */}
            <div className="ai-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`ai-msg ${msg.role}`}>
                        {msg.role === 'assistant' && (
                            <div className="ai-avatar">
                                <img
                                    src="https://i.pravatar.cc/32?img=12"
                                    alt="AI"
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <div className="ai-bubble">
                            {msg.text}
                            {msg.actions && (
                                <div className="ai-actions">
                                    {msg.actions.map(a => (
                                        <button
                                            key={a}
                                            className="btn btn-ghost"
                                            style={{ fontSize: 12, padding: '5px 10px' }}
                                            onClick={() => sendMessage(a)}
                                        >
                                            {a === 'Show labor cost' ? '👋' : '📋'} {a}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className="ai-msg assistant">
                        <div className="ai-avatar">
                            <img src="https://i.pravatar.cc/32?img=12" alt="AI" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                        <div className="ai-bubble ai-typing">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="ai-suggestions">
                {SUGGESTIONS.slice(0, 2).map(s => (
                    <button key={s} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => sendMessage(s)}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="ai-input-row">
                <button className="btn btn-ghost btn-icon"><Plus size={15} /></button>
                <input
                    className="ai-input"
                    placeholder="Ask something or choose to start"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn btn-ghost btn-icon" onClick={() => sendMessage()}>
                    <Mic size={15} />
                </button>
            </div>
        </div>
    )
}
