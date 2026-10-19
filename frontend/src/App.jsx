import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import MobileHeader from './components/MobileHeader.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FoodRecognition from './pages/FoodRecognition.jsx'
import FreshnessDetection from './pages/FreshnessDetection.jsx'
import RestaurantHygiene from './pages/RestaurantHygiene.jsx'
import MealPlanner from './pages/MealPlanner.jsx'
import About from './pages/About.jsx'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <MobileHeader onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <Routes>
          <Route path="/"              element={<Dashboard />} />
          <Route path="/recognize"     element={<FoodRecognition />} />
          <Route path="/freshness"     element={<FreshnessDetection />} />
          <Route path="/hygiene"       element={<RestaurantHygiene />} />
          <Route path="/meal-planner"  element={<MealPlanner />} />
          <Route path="/about"         element={<About />} />
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="page-wrapper" style={{ textAlign:'center',paddingTop:80 }}>
                <div style={{ fontSize:72 }}>🍽️</div>
                <h1 style={{ fontFamily:'var(--font-display)',fontSize:28,fontWeight:800,marginTop:16,color:'var(--text-primary)' }}>
                  Page Not Found
                </h1>
                <p style={{ color:'var(--text-secondary)',marginTop:8,marginBottom:24 }}>
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" className="btn btn-primary">← Go Home</a>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  )
}
