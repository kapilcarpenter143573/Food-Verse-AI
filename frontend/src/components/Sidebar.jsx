import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Utensils,
  Leaf,
  Building2,
  CalendarDays,
  Info,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',            label: 'Dashboard',             icon: LayoutDashboard },
  { path: '/recognize',   label: 'Food Recognition',      icon: Utensils },
  { path: '/freshness',   label: 'Freshness Detection',   icon: Leaf },
  { path: '/hygiene',     label: 'Restaurant Hygiene',    icon: Building2 },
  { path: '/meal-planner',label: 'Meal Planner',          icon: CalendarDays },
  { path: '/about',       label: 'About',                 icon: Info },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">🥗</div>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-name">Food Verse AI</span>
              <span className="sidebar-logo-sub">Multimodal Intelligence</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Page navigation">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive =
              path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(path)
            return (
              <NavLink
                key={path}
                to={path}
                className={`nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="nav-item-icon" size={18} />
                {label}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div>SmartBridge Generative AI</div>
          <div>Capstone Project · 2025</div>
        </div>
      </aside>
    </>
  )
}
