import React, { useState, useCallback } from 'react'
import { Card, Alert, ScoreRing } from '../components/UI.jsx'

// ── Checklist Data ────────────────────────────────────────────
const CHECKLIST_SECTIONS = [
  {
    id: 'cleanliness',
    title: 'Kitchen Cleanliness',
    emoji: '🧹',
    color: '#22c55e',
    items: [
      'Floors, walls, and ceilings are clean and free of grease or grime',
      'Work surfaces and cutting boards are sanitised before and after use',
      'Sinks are clean and free of residue',
      'Rubbish bins are covered and emptied regularly',
      'No pest evidence (droppings, nesting) is present',
      'Lighting is adequate throughout the kitchen',
    ],
  },
  {
    id: 'storage',
    title: 'Food Storage & Temperature',
    emoji: '🌡️',
    color: '#3b82f6',
    items: [
      'Refrigerators are set to ≤ 5 °C (41 °F)',
      'Freezers are set to ≤ −18 °C (0 °F)',
      'Raw meats are stored below cooked and ready-to-eat foods',
      'All food is covered or in sealed containers',
      'Food is labelled with preparation and expiry dates',
      'No food is stored directly on the floor',
      'FIFO (First In, First Out) rotation is practised',
    ],
  },
  {
    id: 'handwashing',
    title: 'Handwashing & Staff Hygiene',
    emoji: '🧼',
    color: '#f97316',
    items: [
      'Dedicated handwashing sink is available and accessible',
      'Soap and paper towels are stocked at all times',
      'Staff wash hands before handling food and after touching raw items',
      'Staff wear clean uniforms or aprons',
      'Hair nets or caps are worn when required',
      'No eating, drinking, or smoking in the food preparation area',
      'Sick staff members are not permitted to handle food',
    ],
  },
  {
    id: 'contamination',
    title: 'Cross-Contamination Prevention',
    emoji: '🔄',
    color: '#8b5cf6',
    items: [
      'Separate cutting boards are used for raw meat, vegetables, and cooked food',
      'Colour-coded utensils or equipment are used appropriately',
      'Raw and ready-to-eat foods are never stored together',
      'Equipment is cleaned and sanitised between different food tasks',
      'Allergen-containing foods are handled and stored separately',
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment Sanitation',
    emoji: '🔧',
    color: '#ec4899',
    items: [
      'All cooking equipment is cleaned after each use',
      'Dishwasher or sanitiser reaches appropriate temperature (≥ 82 °C)',
      'Small equipment (thermometers, utensils) is sanitised regularly',
      'Ventilation and extraction fans are clean and operational',
      'Refrigerator coils and seals are inspected regularly',
      'Food thermometers are calibrated and available',
    ],
  },
]

const TOTAL_ITEMS = CHECKLIST_SECTIONS.reduce((acc, s) => acc + s.items.length, 0)

function getScoreColor(score) {
  if (score >= 90) return '#16a34a'
  if (score >= 75) return '#22c55e'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function getScoreLabel(score) {
  if (score >= 90) return { label: 'Excellent', emoji: '🏆' }
  if (score >= 75) return { label: 'Good',      emoji: '✅' }
  if (score >= 60) return { label: 'Acceptable',emoji: '⚠️' }
  if (score >= 40) return { label: 'Poor',      emoji: '🔴' }
  return { label: 'Critical', emoji: '🚨' }
}

export default function RestaurantHygiene() {
  const [checked, setChecked] = useState({})   // { "sectionId-itemIndex": bool }
  const [showReport, setShowReport] = useState(false)

  const toggle = useCallback((key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const totalChecked = Object.values(checked).filter(Boolean).length
  const score = Math.round((totalChecked / TOTAL_ITEMS) * 100)
  const scoreColor = getScoreColor(score)
  const { label: scoreLabel, emoji: scoreEmoji } = getScoreLabel(score)

  function handleReset() {
    if (window.confirm('Reset all checklist items?')) {
      setChecked({})
      setShowReport(false)
    }
  }

  function handlePrint() {
    setShowReport(true)
    setTimeout(() => window.print(), 300)
  }

  // Build recommendation list from unchecked items
  const recommendations = []
  CHECKLIST_SECTIONS.forEach((section) => {
    section.items.forEach((item, i) => {
      const key = `${section.id}-${i}`
      if (!checked[key]) {
        recommendations.push({ section: section.title, item, emoji: section.emoji })
      }
    })
  })

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title page-title-icon">
          <span>🏪</span> Restaurant Hygiene &amp; Smart Kitchen
        </h1>
        <p className="page-subtitle">
          Self-assessment checklist with scoring and improvement recommendations.
        </p>
      </div>

      <Alert type="info">
        <strong>Self-Assessment Only:</strong> This checklist is a self-assessment tool for internal
        improvement. It is not an official food safety certification, inspection, or regulatory audit.
        Always consult your local food safety authority for compliance requirements.
      </Alert>

      {/* Score banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${scoreColor}18, ${scoreColor}08)`,
          border: `1.5px solid ${scoreColor}40`,
          borderRadius: 'var(--radius-xl)',
          padding: '24px 32px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <ScoreRing score={score} label="Score" color={scoreColor} />
        <div style={{ flex:1,minWidth:200 }}>
          <div style={{ fontFamily:'var(--font-display)',fontSize:22,fontWeight:800,color:scoreColor }}>
            {scoreEmoji} {scoreLabel}
          </div>
          <div style={{ fontSize:14,color:'var(--text-secondary)',marginTop:4 }}>
            {totalChecked} of {TOTAL_ITEMS} items completed
          </div>
        </div>
        <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
          <button id="print-hygiene-btn" className="btn btn-secondary btn-sm no-print" onClick={handlePrint}>
            🖨️ Print Report
          </button>
          <button id="reset-hygiene-btn" className="btn btn-danger btn-sm no-print" onClick={handleReset}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="two-col-grid" style={{ alignItems:'start' }}>
        {/* Checklist sections */}
        <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
          {CHECKLIST_SECTIONS.map((section) => {
            const sectionChecked = section.items.filter((_, i) => checked[`${section.id}-${i}`]).length
            const sectionPct = Math.round((sectionChecked / section.items.length) * 100)
            return (
              <Card
                key={section.id}
                title={`${section.emoji} ${section.title}`}
                headerAction={
                  <span className="badge" style={{ background:`${section.color}20`,color:section.color }}>
                    {sectionChecked}/{section.items.length}
                  </span>
                }
              >
                <div style={{ marginBottom:12 }}>
                  <div
                    style={{
                      height:4,
                      borderRadius:'var(--radius-full)',
                      background:'var(--neutral-200)',
                      overflow:'hidden',
                    }}
                  >
                    <div
                      style={{
                        height:'100%',
                        width:`${sectionPct}%`,
                        background:section.color,
                        borderRadius:'var(--radius-full)',
                        transition:'width .4s ease',
                      }}
                    />
                  </div>
                </div>
                {section.items.map((item, i) => {
                  const key = `${section.id}-${i}`
                  const isChecked = !!checked[key]
                  return (
                    <div
                      key={key}
                      className="checklist-item"
                      onClick={() => toggle(key)}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      id={`check-${key}`}
                      onKeyDown={(e) => e.key === ' ' && toggle(key)}
                    >
                      <div className={`checkbox-custom${isChecked ? ' checked' : ''}`}>
                        {isChecked && <span className="checkbox-checkmark">✓</span>}
                      </div>
                      <span className={`checklist-label${isChecked ? ' checked' : ''}`}>{item}</span>
                    </div>
                  )
                })}
              </Card>
            )
          })}
        </div>

        {/* Recommendations panel */}
        <div style={{ position:'sticky',top:24 }}>
          <Card title="📋 Recommendations" icon="">
            {recommendations.length === 0 ? (
              <div style={{ textAlign:'center',padding:'32px 0' }}>
                <div style={{ fontSize:48 }}>🏆</div>
                <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,color:'var(--green-700)',marginTop:12 }}>
                  All items completed!
                </div>
                <div style={{ fontSize:13,color:'var(--text-secondary)',marginTop:8 }}>
                  Excellent hygiene standards. Keep it up!
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize:13,color:'var(--text-secondary)',marginBottom:12 }}>
                  {recommendations.length} item{recommendations.length !== 1 ? 's' : ''} to improve:
                </div>
                <div style={{ maxHeight:460,overflowY:'auto' }}>
                  {recommendations.map((rec, i) => (
                    <div key={i} className="recommendation-item">
                      <span className="recommendation-icon">{rec.emoji}</span>
                      <div>
                        <div style={{ fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.04em' }}>
                          {rec.section}
                        </div>
                        <div style={{ fontSize:13,color:'var(--text-primary)',lineHeight:1.5 }}>{rec.item}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Section summary */}
          <Card title="📈 Section Summary" style={{ marginTop:16 }}>
            {CHECKLIST_SECTIONS.map((section) => {
              const sectionChecked = section.items.filter((_, i) => checked[`${section.id}-${i}`]).length
              const pct = Math.round((sectionChecked / section.items.length) * 100)
              return (
                <div key={section.id} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4 }}>
                    <span>{section.emoji} {section.title}</span>
                    <span style={{ fontWeight:600,color:section.color }}>{pct}%</span>
                  </div>
                  <div style={{ height:6,background:'var(--neutral-200)',borderRadius:'var(--radius-full)',overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${pct}%`,background:section.color,borderRadius:'var(--radius-full)',transition:'width .4s ease' }} />
                  </div>
                </div>
              )
            })}
          </Card>
        </div>
      </div>
    </div>
  )
}
