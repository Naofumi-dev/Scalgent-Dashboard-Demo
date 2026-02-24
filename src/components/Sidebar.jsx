import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, GitBranch, Box, BarChart2,
    Users, Settings, Plus, Map, CheckSquare
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import './Sidebar.css'

const navItems = [
    { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/builder', icon: GitBranch, label: 'Builder' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/contacts', icon: Users, label: 'Contacts' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
    const navigate = useNavigate()
    const { user } = useAuth()
    return (
        <nav className="sidebar">
            {/* Logo */}
            <div className="sidebar-header" style={{ width: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, marginTop: 8 }}>
                <div className="sidebar-logo">
                    <span className="sidebar-logo-text">Fs</span>
                </div>
                <span className="font-black text-lg" style={{ color: '#fff', letterSpacing: '-0.5px' }}>FlowSight</span>
            </div>

            {/* Nav */}
            <div className="sidebar-nav">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar-item${isActive ? ' active' : ''}`
                        }
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', width: '100%' }}>
                            <Icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
                            <span className="sidebar-label">{label}</span>
                        </div>
                    </NavLink>
                ))}
            </div>

            {/* Bottom */}
            <div className="sidebar-bottom" style={{ width: '100%', padding: '0 20px', marginTop: 'auto', marginBottom: 20 }}>
                <div onClick={() => navigate('/settings')} className="sidebar-user-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                    <div className="sidebar-avatar" title="Your Account" style={{ width: 32, height: 32, flexShrink: 0 }}>
                        <span>{user?.email?.[0]?.toUpperCase() || 'JD'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span className="font-semibold text-sm" style={{ color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email || 'Jane Doe'}</span>
                        <span className="text-xs text-muted">{user?.role || 'Admin'}</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}
