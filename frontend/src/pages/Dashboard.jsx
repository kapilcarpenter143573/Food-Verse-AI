import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { StatCard, Card, Alert } from '../components/UI.jsx'
import { healthCheck } from '../services/api.js'

const FEATURES = [
  {
    emoji: '🔍',
    title: 'Food Recognition',
    description: 'Upload a food photo for AI-powered identification and detailed nutritional breakdown.',
    to: '/recognize',
    color: '#dcfce7',
    accent: '#16a34a',
    id: 'feature-recognize',
  },
  {
    emoji: '🌿',
    title: 'Freshness Detection',
    description: 'Assess the visual freshness of produce, meat, or packaged food from an image.',
    to: '/freshness',
    color: '#fff7ed',
    accent: '#ea580c',
    id: 'feature-freshness',
  },
  {
    emoji: '🏪',
    title: 'Restaurant Hygiene',
    description: 'Interactive self-assessment checklist with scoring and recommendations.',
    to: '/hygiene',
    color: '#eff6ff',
    accent: '#2563eb',
    id: 'feature-hygiene',
  },
  {
    emoji: '📅',
    title: 'Meal Planner',
    description: 'Personalised weekly meal plan with calorie targets, shopping list, and diet preferences.',
    to: '/meal-planner',
    color: '#fdf4ff',
    accent: '#9333ea',
    id: 'feature-planner',
  },
]

const STATS = [
  {
    value: '200+',
    label: 'Food Categories',
    icon: '🍽️',
    colorStart: '#22c55e',
    colorEnd: '#16a34a',
    bgColor: '#dcfce7',
  },
  {
    value: '5',
    label: 'AI-Powered Modules',
    icon: '🤖',
    colorStart: '#f97316',
    colorEnd: '#ea580c',
    bgColor: '#ffedd5',
  },
  {
    value: '100%',
    label: 'Privacy Focused',
    icon: '🔒',
    colorStart: '#3b82f6',
    colorEnd: '#2563eb',
    bgColor: '#dbeafe',
  },
  {
    value: 'Real-time',
    label: 'Analysis Speed',
    icon: '⚡',
    colorStart: '#eab308',
    colorEnd: '#ca8a04',
    bgColor: '#fef9c3',
  },
]

export default function Dashboard() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [healthData, setHealthData] = useState(null)

  useEffect(() => {
    healthCheck()
      .then((data) => {
        setHealthData(data)
        setBackendStatus('online')
      })
      .catch(() => setBackendStatus('offline'))
  }, [])

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{ marginBottom: 36 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0f2e1a 0%, #166534 50%, #15803d 100%)',
            borderRadius: 24,
            padding: '48px 40px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative circles */}
          <div style={{ position:'absolute',top:-40,right:-40,width:200,height:200,background:'rgba(34,197,94,.1)',borderRadius:'50%' }} />
          <div style={{ position:'absolute',bottom:-60,right:80,width:150,height:150,background:'rgba(249,115,22,.08)',borderRadius:'50%' }} />

          <div style={{ position:'relative' }}>
            <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:16 }}>
              <span style={{ fontSize:52 }}>🥗</span>
              <div>
                <h1
                  style={{
                    fontFamily:'var(--font-display)',
                    fontSize:'clamp(24px,4vw,38px)',
                    fontWeight:800,
                    marginBottom:4,
                  }}
                >
                  Food Verse AI
                </h1>
                <p style={{ opacity:.75,fontSize:14,letterSpacing:'.06em',textTransform:'uppercase',fontWeight:500 }}>
                  Multimodal Food Intelligence Agent
                </p>
              </div>
            </div>

            <p style={{ fontSize:16,opacity:.85,maxWidth:560,lineHeight:1.7,marginBottom:28 }}>
              Powered by Google Gemini AI — identify foods, analyse nutrition, detect freshness,
              assess kitchen hygiene, and plan personalised meals. All in one intelligent dashboard.
            </p>

            <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
              <Link to="/recognize" className="btn btn-primary" id="hero-cta-recognize">
                🔍 Analyse Food Now
              </Link>
              <Link to="/meal-planner" className="btn" id="hero-cta-planner"
                style={{ background:'rgba(255,255,255,.12)',color:'white',border:'1.5px solid rgba(255,255,255,.25)' }}>
                📅 Plan My Meals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Backend status */}
      {backendStatus === 'offline' && (
        <Alert type="error">
          <strong>Backend Offline:</strong> Cannot reach the FastAPI server at{' '}
          <code>{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}</code>.
          Start the backend with <code>uvicorn app.main:app --reload</code>.
        </Alert>
      )}

      {backendStatus === 'online' && healthData?.demo_mode && (
        <Alert type="warning">
          <strong>Demo Mode Active:</strong> The backend is running but no AI credentials are
          configured. Results will be clearly labelled sample data.
        </Alert>
      )}

      {backendStatus === 'online' && !healthData?.demo_mode && (
        <Alert type="success">
          <strong>AI Online:</strong> Backend is connected and Google Gemini AI is configured.
        </Alert>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom:28 }}>
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Features Grid */}
      <h2
        style={{
          fontFamily:'var(--font-display)',
          fontSize:20,
          fontWeight:700,
          marginBottom:16,
          color:'var(--text-primary)',
        }}
      >
        Explore Features
      </h2>
      <div
        style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))',
          gap:16,
          marginBottom:28,
        }}
      >
        {FEATURES.map((f) => (
          <Link key={f.to} to={f.to} id={f.id} style={{ textDecoration:'none' }}>
            <div
              className="card"
              style={{
                padding:24,
                height:'100%',
                transition:'all .2s',
                cursor:'pointer',
                borderTop:`3px solid ${f.accent}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ width:52,height:52,borderRadius:12,background:f.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,marginBottom:14 }}>
                {f.emoji}
              </div>
              <h3 style={{ fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,marginBottom:8,color:'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p style={{ fontSize:13,color:'var(--text-secondary)',lineHeight:1.6 }}>
                {f.description}
              </p>
              <div style={{ marginTop:14,color:f.accent,fontSize:13,fontWeight:600 }}>
                Open →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <Card title="📋 Important Disclaimers" className="mb-6">
        <div style={{ display:'grid',gap:12,fontSize:14,color:'var(--text-secondary)',lineHeight:1.7 }}>
          <p>🔬 <strong>Nutrition estimates</strong> are approximate and should not replace advice from a registered dietitian or nutritionist.</p>
          <p>🌿 <strong>Freshness assessments</strong> are based on visual appearance only. Never rely solely on an AI image analysis to determine if food is safe to eat.</p>
          <p>🏥 <strong>Hygiene checklists</strong> are self-assessments for improvement guidance, not official food-safety certifications or inspections.</p>
          <p>🤖 <strong>Demo mode</strong> is clearly labelled whenever sample data is shown instead of real AI predictions.</p>
        </div>
      </Card>
    </div>
  )
}
