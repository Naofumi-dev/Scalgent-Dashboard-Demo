import { useLocation } from 'react-router-dom'
import { Search, RefreshCw, ChevronDown, Bell, LogOut, Download, Shield } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import './TopBar.css'

const pageTitles = {
    '/overview': 'Dashboard / Overview',
    '/builder': 'Dashboard / Workflow Builder',
    '/analytics': 'Dashboard / Analytics',
    '/contacts': 'Dashboard / Contacts',
}

export default function TopBar() {
    const { pathname } = useLocation()
    const title = pageTitles[pathname] || 'Dashboard'
    const { user, logout } = useAuth()

    return (
        <header className="topbar">
            <div className="topbar-left">
                <span className="topbar-breadcrumb">{title}</span>
            </div>

            <div className="topbar-center">
                <div className="topbar-search">
                    <Search size={14} className="search-icon" />
                    <input
                        type="text"
                        placeholder="FlowSight — GHL + n8n"
                        className="search-input"
                        readOnly
                    />
                    <div className="search-badge">
                        <span>The Daily Grind, NY</span>
                        <ChevronDown size={12} />
                    </div>
                </div>
            </div>

            <div className="topbar-right">
                {user?.role && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: user.role === 'Admin' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(148, 163, 184, 0.1)', borderRadius: 20, border: `1px solid ${user.role === 'Admin' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`, marginRight: 12 }}>
                        <Shield size={12} color={user.role === 'Admin' ? '#a855f7' : '#94a3b8'} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: user.role === 'Admin' ? '#e9d5ff' : '#cbd5e1' }}>{user.role}</span>
                    </div>
                )}
                <div className="topbar-live-dot" title="Live sync active" />
                <button className="btn btn-ghost btn-icon" title="Notifications">
                    <Bell size={15} />
                </button>
                <button className="btn btn-ghost btn-icon" title="Export Dashboard (PDF)">
                    <Download size={15} />
                </button>
                <button className="btn btn-ghost btn-icon" title="Refresh">
                    <RefreshCw size={15} />
                </button>
                <div className="divider-vr" style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />
                <button className="btn btn-ghost btn-icon text-coral" title="Logout" onClick={logout}>
                    <LogOut size={15} />
                </button>
            </div>
        </header>
    )
}
