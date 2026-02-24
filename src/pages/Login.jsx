import { useAuth } from '../lib/AuthContext'
import { Navigate } from 'react-router-dom'
import { Bot, Zap, BarChart3, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function Login() {
    const { loginWithGoogle, loginAsGuest, user } = useAuth()
    const [isHovered, setIsHovered] = useState(false)

    if (user) {
        return <Navigate to="/overview" />
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#0f101a',
            backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1b2e 0%, #0f101a 100%)',
            color: '#fff',
            fontFamily: '"Inter", sans-serif',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background decorative blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)', filter: 'blur(60px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 60%)', filter: 'blur(60px)', borderRadius: '50%' }} />

            {/* Content wrapper */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 1 }}>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2.5rem' }}>
                    <Sparkles size={14} color="#a78bfa" />
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>FlowSight v2.0 is Live</span>
                </div>

                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, textAlign: 'center', lineHeight: 1.15, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', maxWidth: '850px', letterSpacing: '-0.02em' }}>
                    The Ultimate GHL & n8n OS <br /> for AI Automation
                </h1>

                <p style={{ fontSize: '1.125rem', color: '#94a3b8', textAlign: 'center', maxWidth: '650px', lineHeight: 1.6, marginBottom: '3.5rem' }}>
                    Stop jumping between tabs. Combine your GoHighLevel CRM data, n8n workflow execution, and generative AI predictive analytics into one beautifully unified dashboard.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={loginAsGuest}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            padding: '16px 32px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a146e8 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHovered ? 'translateY(-2px)' : 'none',
                            boxShadow: isHovered ? '0 12px 25px -5px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.2) inset' : '0 0 0 1px rgba(255,255,255,0.1) inset'
                        }}
                    >
                        View Live Demo <ArrowRight size={18} />
                    </button>

                    <button
                        onClick={loginWithGoogle}
                        style={{
                            padding: '16px 32px',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                        }}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: 20 }} />
                        Admin Sign In
                    </button>
                </div>

                {/* Feature Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '6rem', maxWidth: '1000px', width: '100%' }}>
                    <FeatureCard
                        icon={<Bot size={24} color="#60a5fa" />}
                        title="AI Predictive Insights"
                        desc="Identify churn risks and forecast revenue natively using Gemini 2.0 applied directly to your CRM data."
                    />
                    <FeatureCard
                        icon={<Zap size={24} color="#f472b6" />}
                        title="n8n Integration"
                        desc="Visually map and trigger complex AI automation workflows from right inside the executive dashboard."
                    />
                    <FeatureCard
                        icon={<BarChart3 size={24} color="#34d399" />}
                        title="Seamless GHL Sync"
                        desc="A gorgeous, fast glassmorphic UI layer built explicitly over your existing GoHighLevel sub-accounts."
                    />
                </div>

                <p style={{ marginTop: '5rem', fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> Enterprise-grade security. Demo data is isolated for public viewing.
                </p>
            </div>
        </div>
    )
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div style={{
            background: 'rgba(20, 21, 33, 0.4)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'all 0.3s ease',
            cursor: 'default'
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
                e.currentTarget.style.background = 'rgba(30, 31, 45, 0.6)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'
                e.currentTarget.style.background = 'rgba(20, 21, 33, 0.4)'
            }}
        >
            <div style={{ width: 56, height: 56, borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                {icon}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', letterSpacing: '-0.01em' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>{desc}</p>
        </div>
    )
}
