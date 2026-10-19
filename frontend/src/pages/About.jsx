import React from 'react'
import { Card, Alert } from '../components/UI.jsx'

const TECH_STACK = [
  { name: 'React 18 + Vite',       role: 'Frontend SPA',                  emoji: '⚛️' },
  { name: 'React Router v6',        role: 'Client-side routing',           emoji: '🔀' },
  { name: 'Lucide React',           role: 'Icon library',                  emoji: '✨' },
  { name: 'Recharts',               role: 'Data visualisation',            emoji: '📊' },
  { name: 'FastAPI',                role: 'Python REST API backend',       emoji: '🐍' },
  { name: 'Google Gemini AI',       role: 'Multimodal vision model',       emoji: '🤖' },
  { name: 'Pillow',                 role: 'Image pre-processing',          emoji: '🖼️' },
  { name: 'Pydantic v2',            role: 'Schema validation',             emoji: '🛡️' },
  { name: 'python-dotenv',          role: 'Environment variable loading',  emoji: '🔐' },
]

const TEAM_FEATURES = [
  { emoji: '🔍', title: 'Food Recognition',       desc: 'Gemini vision identifies food items from photos and returns structured nutritional data.' },
  { emoji: '🌿', title: 'Freshness Detection',    desc: 'Visual inspection of produce and food items to assess apparent freshness.' },
  { emoji: '🏪', title: 'Hygiene Assessment',     desc: 'Interactive self-assessment checklist with scoring for restaurant kitchen hygiene.' },
  { emoji: '📅', title: 'Meal Planner',           desc: 'Diet-aware, budget-conscious meal plans with shopping list generation.' },
  { emoji: '🔒', title: 'Privacy First',          desc: 'Images are processed server-side and never persisted beyond the request.' },
  { emoji: '🎨', title: 'Responsive Design',      desc: 'Premium CSS design system with responsive layouts for any screen size.' },
]

export default function About() {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{ marginBottom:32 }}>
        <div
          style={{
            background:'linear-gradient(135deg,#0f2e1a,#166534)',
            borderRadius:24,
            padding:'48px 40px',
            color:'white',
            textAlign:'center',
            position:'relative',
            overflow:'hidden',
          }}
        >
          <div style={{ position:'absolute',top:-50,left:-50,width:200,height:200,background:'rgba(34,197,94,.08)',borderRadius:'50%' }} />
          <div style={{ position:'absolute',bottom:-40,right:-40,width:180,height:180,background:'rgba(249,115,22,.06)',borderRadius:'50%' }} />
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:64,marginBottom:16 }}>🥗</div>
            <h1 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(28px,5vw,44px)',fontWeight:800,marginBottom:10 }}>
              Food Verse AI
            </h1>
            <p style={{ fontSize:16,opacity:.8,fontStyle:'italic',marginBottom:8 }}>
              Multimodal Food Intelligence Agent
            </p>
            <p style={{ fontSize:14,opacity:.65,maxWidth:480,margin:'0 auto' }}>
              SmartBridge Generative AI with Google Cloud — Capstone Project
            </p>
          </div>
        </div>
      </section>

      {/* Project Description */}
      <Card title="📖 Project Overview" className="mb-4">
        <p style={{ fontSize:15,lineHeight:1.8,color:'var(--text-secondary)',marginBottom:12 }}>
          <strong style={{ color:'var(--text-primary)' }}>Food Verse AI</strong> is a full-stack,
          multimodal food intelligence application built as a capstone project for the SmartBridge
          Generative AI with Google Cloud programme.
        </p>
        <p style={{ fontSize:15,lineHeight:1.8,color:'var(--text-secondary)',marginBottom:12 }}>
          The application integrates <strong>Google Gemini AI</strong> (a state-of-the-art multimodal
          language model) with a responsive React frontend and a FastAPI Python backend to deliver
          intelligent food analysis capabilities directly in the browser.
        </p>
        <p style={{ fontSize:15,lineHeight:1.8,color:'var(--text-secondary)' }}>
          Key design goals include transparency (demo mode is clearly labelled), safety (no medical
          or food-safety guarantees are made), and privacy (images are processed in memory and never
          persisted beyond the request).
        </p>
      </Card>

      {/* Features */}
      <h2 style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,marginBottom:16,color:'var(--text-primary)' }}>
        Core Modules
      </h2>
      <div
        style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16,marginBottom:28 }}
      >
        {TEAM_FEATURES.map((f) => (
          <div key={f.title} className="card" style={{ padding:20 }}>
            <div style={{ fontSize:28,marginBottom:10 }}>{f.emoji}</div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:15,fontWeight:700,marginBottom:6 }}>{f.title}</div>
            <div style={{ fontSize:13,color:'var(--text-secondary)',lineHeight:1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <Card title="🛠️ Technology Stack" className="mb-4">
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Technology</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {TECH_STACK.map((t) => (
                <tr key={t.name}>
                  <td>
                    <span style={{ marginRight:8 }}>{t.emoji}</span>
                    <strong>{t.name}</strong>
                  </td>
                  <td style={{ color:'var(--text-secondary)' }}>{t.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI credentials notice */}
      <Card title="🤖 AI Provider Setup" className="mb-4">
        <p style={{ fontSize:14,color:'var(--text-secondary)',lineHeight:1.7,marginBottom:12 }}>
          This application is architected to use <strong>Google Gemini AI</strong> via the
          official <code>google-generativeai</code> Python SDK. To enable real AI analysis:
        </p>
        <ol style={{ paddingLeft:20,fontSize:14,color:'var(--text-secondary)',lineHeight:2 }}>
          <li>Obtain a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color:'var(--green-600)',fontWeight:600 }}>Google AI Studio</a>.</li>
          <li>Copy <code>backend/.env.example</code> to <code>backend/.env</code>.</li>
          <li>Set <code>GOOGLE_API_KEY=your_key_here</code>.</li>
          <li>Set <code>DEMO_MODE=false</code>.</li>
          <li>Restart the backend server.</li>
        </ol>
        <Alert type="warning" style={{ marginTop:12 }}>
          Never commit your <code>.env</code> file or include API keys in the frontend build.
          The <code>.gitignore</code> file excludes <code>.env</code> files automatically.
        </Alert>
      </Card>

      {/* Disclaimers */}
      <Card title="⚖️ Disclaimers">
        <div style={{ display:'grid',gap:10,fontSize:14,color:'var(--text-secondary)',lineHeight:1.7 }}>
          <p>🔬 Nutrition estimates are approximate and should not replace advice from a registered dietitian or nutritionist.</p>
          <p>🌿 Freshness assessments are based on visual appearance only. Image-based analysis cannot determine whether food is safe to eat. Always use your judgement.</p>
          <p>🏥 Hygiene checklists are self-assessments for internal improvement guidance only, not official food-safety certifications or regulatory inspections.</p>
          <p>🤖 Demo mode results are pre-defined sample data and do NOT represent real AI analysis.</p>
          <p>🔐 This project is for educational purposes as part of a capstone programme.</p>
        </div>
      </Card>
    </div>
  )
}
