import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, UserCog,
  ClipboardList, Bell, AlertTriangle
} from 'lucide-react'

const navItems = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Students', to: '/students', icon: Users },
  { label: 'Subjects', to: '/subjects', icon: BookOpen },
  { label: 'Admins', to: '/admins', icon: UserCog },
  { label: 'Results', to: '/results', icon: ClipboardList },
  { label: 'Failing Students', to: '/failing', icon: AlertTriangle },
  { label: 'Notifications', to: '/notifications', icon: Bell },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Student Result System</h1>
        <p>DBMS Project</p>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
