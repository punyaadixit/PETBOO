import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, PawPrint, MessageCircle, ShoppingBag,
  Salad, Shield, ChevronLeft, ChevronRight, Sparkles,
  Stethoscope, CalendarCheck, Scissors
} from 'lucide-react';
import './Sidebar.css';

/* Navigation items dynamically mapped from backend modules */
const NAV_MODULES = [
  { path: '/',          label: 'Dashboard',   icon: LayoutDashboard, accent: 'teal'   },
  { path: '/pets',      label: 'My Pets',     icon: PawPrint,        accent: 'purple' },
  { path: '/chat',      label: 'Cuddles AI',  icon: MessageCircle,   accent: 'pink'   },
  { path: '/shop',      label: 'Pet Shop',    icon: ShoppingBag,     accent: 'amber'  },
  { path: '/fresh-food',label: 'Fresh Food',  icon: Salad,           accent: 'teal'   },
  { path: '/vets',      label: 'Veterinarians', icon: Stethoscope,   accent: 'blue'   },
  { path: '/grooming',  label: 'Pet Grooming',  icon: Scissors,      accent: 'pink'   },
  { path: '/appointments', label: 'Appointments', icon: CalendarCheck, accent: 'green'  },
  { path: '/admin',     label: 'Admin',       icon: Shield,          accent: 'purple' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <NavLink to="/" className="sidebar__logo" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <div className="sidebar__logo-icon">
          <PawPrint size={24} />
        </div>
        {!collapsed && (
          <div className="sidebar__logo-text">
            <span className="gradient-text">PetSphere</span>
            <small>Pet Health OS</small>
          </div>
        )}
      </NavLink>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV_MODULES.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <div className="sidebar__link-icon">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {!collapsed && <span className="sidebar__link-label">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="sidebar__user">
          <img src="https://ui-avatars.com/api/?name=Sarthak&background=random" alt="Sarthak" className="sidebar__user-avatar" />
          <div className="sidebar__user-info">
            <strong>Sarthak</strong>
            <span>Pet Parent</span>
          </div>
          <ChevronRight size={16} />
        </div>
      )}
    </aside>
  );
}
