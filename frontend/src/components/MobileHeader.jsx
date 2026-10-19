import React from 'react'
import { Menu } from 'lucide-react'

export default function MobileHeader({ onMenuToggle }) {
  return (
    <header className="mobile-header" aria-label="Mobile navigation header">
      <div className="mobile-header-logo">
        <span style={{ fontSize: 24 }}>🥗</span>
        <span>Food Verse AI</span>
      </div>
      <button
        className="hamburger-btn"
        onClick={onMenuToggle}
        aria-label="Open navigation menu"
        id="mobile-menu-btn"
      >
        <Menu size={22} />
      </button>
    </header>
  )
}
