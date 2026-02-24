import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard, GitBranch, Box, BarChart2,
    Users, Settings, Plus, Map, CheckSquare
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
    { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/visualizer', icon: Box, label: '3D View' },
    { to: '/builder', icon: GitBranch, label: 'Builder' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/contacts', icon: Users, label: 'Contacts' },
    { to: '#map', icon: Map, label: 'Map' },
    { to: '#settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
    return (
        <nav className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <span className="sidebar-logo-text">Fs</span>
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
                        title={label}
                    >
                        <Icon size={20} strokeWidth={1.8} />
                    </NavLink>
                ))}
            </div>

            {/* Bottom */}
            <div className="sidebar-bottom">
                <button className="sidebar-item" title="Add">
                    <Plus size={20} strokeWidth={2} />
                </button>
                <div className="sidebar-avatar" title="Your Account">
                    <span>JD</span>
                </div>
            </div>
        </nav>
    )
}
