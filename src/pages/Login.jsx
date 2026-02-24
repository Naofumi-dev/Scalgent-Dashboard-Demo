import { useAuth } from '../lib/AuthContext'
import { Navigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import '../components/Sidebar.css'

export default function Login() {
    const { loginWithGoogle, user } = useAuth()

    if (user) {
        return <Navigate to="/overview" />
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-document)',
            color: '#fff'
        }}>
            <div className="card card-dark" style={{ width: 400, padding: 40, textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <div className="sidebar-logo" style={{ width: 48, height: 48, marginLeft: 0 }}>
                        <span className="sidebar-logo-text" style={{ fontSize: 24 }}>Fs</span>
                    </div>
                </div>

                <h1 className="font-black text-2xl" style={{ marginBottom: 8 }}>Welcome to FlowSight</h1>
                <p className="text-secondary text-sm" style={{ marginBottom: 32 }}>
                    Sign in to access your CRM and automation dashboard.
                </p>

                <button
                    onClick={loginWithGoogle}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" style={{ width: 18 }} />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
