import React, { useState } from 'react'
import {
  Card,
  DemoBanner,
  Alert,
  LoadingOverlay,
  EmptyState,
  NutritionGrid,
  UploadZone,
  ImagePreview,
} from '../components/UI.jsx'
import { analyzeFood } from '../services/api.js'

const SERVING_OPTIONS = [
  { value: 0.5, label: '½ serving' },
  { value: 1,   label: '1 serving' },
  { value: 1.5, label: '1½ servings' },
  { value: 2,   label: '2 servings' },
  { value: 3,   label: '3 servings' },
]

export default function FoodRecognition() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [servingSize, setServingSize] = useState(1)
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
      const data = await analyzeFood({ imageFile, servingSize })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nutrition = result?.nutrition
    ? [
        { label: 'Calories', value: Math.round((result.nutrition.calories || 0) * servingSize), unit: 'kcal' },
        { label: 'Protein',  value: `${((result.nutrition.protein_g  || 0) * servingSize).toFixed(1)}`, unit: 'g' },
        { label: 'Carbs',    value: `${((result.nutrition.carbs_g    || 0) * servingSize).toFixed(1)}`, unit: 'g' },
        { label: 'Fat',      value: `${((result.nutrition.fat_g      || 0) * servingSize).toFixed(1)}`, unit: 'g' },
        { label: 'Fiber',    value: `${((result.nutrition.fiber_g    || 0) * servingSize).toFixed(1)}`, unit: 'g' },
      ]
    : []

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title page-title-icon">
          <span>🔍</span> Food Recognition &amp; Nutrition
        </h1>
        <p className="page-subtitle">
          Upload a food image to receive AI-powered identification and nutritional estimates.
        </p>
      </div>

      <div className="two-col-grid" style={{ alignItems:'start' }}>
        {/* Left: Upload */}
        <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
          <Card title="Upload Food Image" icon="📷">
            {imagePreview ? (
              <ImagePreview src={imagePreview} alt="Selected food" onRemove={handleRemove} />
            ) : (
              <UploadZone onFile={handleFile} />
            )}
          </Card>

          {imagePreview && (
            <Card title="Options" icon="⚙️">
              <div className="form-group">
                <label className="form-label" htmlFor="serving-select">Serving Size</label>
                <select
                  id="serving-select"
                  className="form-select"
                  value={servingSize}
                  onChange={(e) => setServingSize(parseFloat(e.target.value))}
                >
                  {SERVING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <button
                id="analyze-food-btn"
                className="btn btn-primary w-full"
                onClick={handleAnalyze}
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? '⏳ Analysing…' : '🔍 Analyse Food'}
              </button>
            </Card>
          )}

          <Alert type="warning">
            <strong>Disclaimer:</strong> Nutrition values are estimates based on visual recognition
            and standard serving sizes. They may be inaccurate. Always consult a nutritionist for
            dietary advice.
          </Alert>
        </div>

        {/* Right: Results */}
        <div>
          <Card title="Analysis Results" icon="📊">
            {loading && <LoadingOverlay text="Analysing your food image with AI…" />}

            {error && !loading && (
              <Alert type="error">{error}</Alert>
            )}

            {!loading && !result && !error && (
              <EmptyState
                icon="🍽️"
                title="No analysis yet"
                description="Upload a food photo and click 'Analyse Food' to get started."
              />
            )}

            {!loading && result && (
              <div className="result-section">
                {result.is_demo && <DemoBanner />}

                {/* Food name & confidence */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
                    <h3 style={{ fontFamily:'var(--font-display)',fontSize:22,fontWeight:800,color:'var(--text-primary)' }}>
                      {result.food_name}
                    </h3>
                    {result.confidence != null && (
                      <span className="badge badge-green">
                        {Math.round(result.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                  {result.description && (
                    <p style={{ marginTop:8,fontSize:14,color:'var(--text-secondary)',lineHeight:1.6 }}>
                      {result.description}
                    </p>
                  )}
                </div>

                {/* Alternatives */}
                {result.alternatives?.length > 0 && (
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:8 }}>
                      Other possibilities:
                    </div>
                    <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                      {result.alternatives.map((alt) => (
                        <span key={alt} className="badge badge-gray">{alt}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="divider" />

                {/* Nutrition */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:14,fontWeight:600,color:'var(--text-secondary)',marginBottom:12 }}>
                    Estimated Nutrition · {servingSize === 1 ? '1 serving' : `${servingSize} servings`}
                  </div>
                  <NutritionGrid items={nutrition} />
                </div>

                {/* Tags */}
                {result.tags?.length > 0 && (
                  <div style={{ marginTop:16 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:8 }}>Tags</div>
                    <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                      {result.tags.map((t) => <span key={t} className="badge badge-orange">{t}</span>)}
                    </div>
                  </div>
                )}

                {/* Raw AI text */}
                {result.raw_analysis && (
                  <details style={{ marginTop:16 }}>
                    <summary style={{ cursor:'pointer',fontSize:13,color:'var(--text-secondary)',fontWeight:600 }}>
                      View full AI response
                    </summary>
                    <pre
                      style={{
                        marginTop:8,
                        background:'var(--neutral-50)',
                        border:'1px solid var(--border)',
                        borderRadius:'var(--radius-md)',
                        padding:12,
                        fontSize:12,
                        lineHeight:1.6,
                        whiteSpace:'pre-wrap',
                        color:'var(--text-secondary)',
                      }}
                    >
                      {result.raw_analysis}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
