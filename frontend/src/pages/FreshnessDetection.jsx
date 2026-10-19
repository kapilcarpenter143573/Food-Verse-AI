import React, { useState } from 'react'
import {
  Card,
  DemoBanner,
  Alert,
  LoadingOverlay,
  EmptyState,
  ProgressBar,
  UploadZone,
  ImagePreview,
} from '../components/UI.jsx'
import { analyzeFreshness } from '../services/api.js'

const FRESHNESS_LEVELS = [
  { min: 0,  max: 25, label: 'Spoiled',        color: '#ef4444', emoji: '🔴' },
  { min: 25, max: 50, label: 'Use Immediately', color: '#f97316', emoji: '🟠' },
  { min: 50, max: 75, label: 'Acceptable',      color: '#eab308', emoji: '🟡' },
  { min: 75, max: 90, label: 'Good',            color: '#22c55e', emoji: '🟢' },
  { min: 90, max:101, label: 'Very Fresh',      color: '#16a34a', emoji: '✅' },
]

function getFreshnessLevel(score) {
  return FRESHNESS_LEVELS.find((l) => score >= l.min && score < l.max) || FRESHNESS_LEVELS[0]
}

export default function FreshnessDetection() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [foodType, setFoodType] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function handleFile(file) {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  function handleRemove() {
    setImageFile(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }

  async function handleAnalyze() {
    if (!imageFile) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await analyzeFreshness({ imageFile, foodType })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const level = result ? getFreshnessLevel(result.freshness_score ?? 50) : null

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title page-title-icon">
          <span>🌿</span> Freshness &amp; Spoilage Detection
        </h1>
        <p className="page-subtitle">
          Upload a food image for a visual freshness assessment. Results are for guidance only —
          always use your judgement and follow local food safety guidelines.
        </p>
      </div>

      <Alert type="warning">
        <strong>Safety Disclaimer:</strong> Image-based freshness analysis cannot reliably determine
        whether food is safe to eat. Never rely solely on this tool. When in doubt, discard the food.
      </Alert>

      <div className="two-col-grid" style={{ alignItems:'start' }}>
        {/* Upload column */}
        <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
          <Card title="Upload Food Image" icon="📷">
            {imagePreview ? (
              <ImagePreview src={imagePreview} alt="Food to assess" onRemove={handleRemove} />
            ) : (
              <UploadZone onFile={handleFile} />
            )}
          </Card>

          {imagePreview && (
            <Card title="Options" icon="⚙️">
              <div className="form-group">
                <label className="form-label" htmlFor="food-type-input">
                  Food Type (optional hint)
                </label>
                <input
                  id="food-type-input"
                  className="form-input"
                  placeholder="e.g. tomatoes, chicken, bread…"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                />
              </div>
              <button
                id="analyze-freshness-btn"
                className="btn btn-primary w-full"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? '⏳ Analysing…' : '🌿 Check Freshness'}
              </button>
            </Card>
          )}
        </div>

        {/* Results column */}
        <div>
          <Card title="Freshness Assessment" icon="📊">
            {loading && <LoadingOverlay text="Evaluating freshness from your image…" />}
            {error && !loading && <Alert type="error">{error}</Alert>}

            {!loading && !result && !error && (
              <EmptyState
                icon="🌿"
                title="No assessment yet"
                description="Upload a food image and click 'Check Freshness' to get a visual assessment."
              />
            )}

            {!loading && result && (
              <div className="result-section">
                {result.is_demo && <DemoBanner />}

                {/* Score */}
                <div
                  style={{
                    textAlign:'center',
                    padding:'24px 0',
                    background: `linear-gradient(135deg, ${level.color}18, ${level.color}08)`,
                    borderRadius:'var(--radius-lg)',
                    marginBottom:20,
                  }}
                >
                  <div style={{ fontSize:56 }}>{level.emoji}</div>
                  <div style={{ fontFamily:'var(--font-display)',fontSize:28,fontWeight:800,color:level.color,margin:'8px 0 4px' }}>
                    {level.label}
                  </div>
                  <div style={{ fontSize:14,color:'var(--text-secondary)' }}>
                    Freshness score: <strong>{result.freshness_score ?? '–'}/100</strong>
                  </div>
                  <div style={{ maxWidth:260,margin:'12px auto 0',padding:'0 16px' }}>
                    <ProgressBar
                      value={result.freshness_score ?? 0}
                      colorStart="#ef4444"
                      colorEnd={level.color}
                    />
                  </div>
                </div>

                {/* Assessment text */}
                {result.assessment && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontWeight:600,fontSize:14,color:'var(--text-secondary)',marginBottom:6 }}>Assessment</div>
                    <p style={{ fontSize:14,lineHeight:1.7,color:'var(--text-primary)' }}>{result.assessment}</p>
                  </div>
                )}

                {/* Visual indicators */}
                {result.indicators?.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontWeight:600,fontSize:14,color:'var(--text-secondary)',marginBottom:8 }}>Visual Indicators</div>
                    {result.indicators.map((ind) => (
                      <div key={ind.label} style={{ marginBottom:10 }}>
                        <div style={{ display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4 }}>
                          <span>{ind.label}</span>
                          <span style={{ fontWeight:600,color:ind.score >= 70 ? 'var(--green-600)' : '#ef4444' }}>{ind.score}/100</span>
                        </div>
                        <ProgressBar value={ind.score} colorStart="#ef4444" colorEnd="var(--green-500)" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Reasons */}
                {result.reasons?.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontWeight:600,fontSize:14,color:'var(--text-secondary)',marginBottom:8 }}>Key Observations</div>
                    <ul style={{ paddingLeft:0,listStyle:'none',display:'flex',flexDirection:'column',gap:6 }}>
                      {result.reasons.map((r, i) => (
                        <li key={i} style={{ fontSize:13,color:'var(--text-primary)',display:'flex',alignItems:'flex-start',gap:8,lineHeight:1.5 }}>
                          <span style={{ marginTop:1 }}>• </span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Uncertainty notice */}
                {result.uncertainty && (
                  <Alert type="info">
                    <strong>Uncertainty:</strong> {result.uncertainty}
                  </Alert>
                )}

                <Alert type="warning">
                  This is a visual assessment only and does not guarantee food safety. Always
                  use your senses (smell, texture) and follow official food safety guidelines.
                </Alert>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
