import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, GitBranch, Megaphone, Blocks, BarChart2,
    Users, Bell, FileText, Settings, LogOut
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import './Sidebar.css'

const generalItems = [
    { to: '/overview', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/workflows', icon: GitBranch, label: 'Workflows' },
    { to: '/campaigns', icon: Megaphone, label: 'Campaigns' },
    { to: '/integrations', icon: Blocks, label: 'Integrations' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
]

const businessItems = [
    { to: '/leads', icon: Users, label: 'Leads' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    return (
        <nav className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-text">Fs</span>
                </div>
                <span className="sidebar-title">FlowSight <span>v2.0</span></span>
            </div>

            <div className="sidebar-scroll">
                {/* General Section */}
                <div className="sidebar-section">
                    <span className="sidebar-section-title">GENERAL</span>
                    <div className="sidebar-nav">
                        {generalItems.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
                            >
                                <Icon size={18} strokeWidth={2} className="sidebar-icon" />
                                <span className="sidebar-label">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Business Section */}
                <div className="sidebar-section">
                    <span className="sidebar-section-title">BUSINESS</span>
                    <div className="sidebar-nav">
                        {businessItems.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
                            >
                                <Icon size={18} strokeWidth={2} className="sidebar-icon" />
                                <span className="sidebar-label">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="sidebar-bottom">
                <div className="monthly-savings-card">
                    <span className="savings-label">MONTHLY AI SAVINGS</span>
                    <span className="savings-value">$215.50</span>
                </div>

                <button onClick={() => navigate('/login')} className="logout-button">
                    <LogOut size={16} strokeWidth={2} />
                    <span>Log out</span>
                </button>
            </div>
        </nav>
    )
}
