import { useLocation } from 'react-router-dom'
import { Search, RefreshCw, ChevronDown, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import './TopBar.css'

const pageTitles = {
    '/overview': 'Dashboard / Overview',
    '/visualizer': 'Dashboard / 3D Visualizer',
    '/builder': 'Dashboard / Workflow Builder',
    '/analytics': 'Dashboard / Analytics',
    '/contacts': 'Dashboard / Contacts',
}

export default function TopBar() {
    const { pathname } = useLocation()
    const title = pageTitles[pathname] || 'Dashboard'
    const { logout } = useAuth()

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
                <div className="topbar-live-dot" title="Live sync active" />
                <button className="btn btn-ghost btn-icon" title="Notifications">
                    <Bell size={15} />
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
