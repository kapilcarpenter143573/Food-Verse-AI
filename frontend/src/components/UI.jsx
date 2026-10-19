import React from 'react'

/**
 * Reusable card wrapper.
 * Props: title, icon (emoji or component), headerAction, className, children
 */
export function Card({ title, icon, headerAction, className = '', children }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h2 className="card-title">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          {headerAction}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )
}

/**
 * Stat card for dashboard metrics.
 */
export function StatCard({ value, label, icon, colorStart, colorEnd, bgColor }) {
  return (
    <div
      className="stat-card"
      style={{
        '--stat-color-start': colorStart || '#22c55e',
        '--stat-color-end': colorEnd || '#16a34a',
      }}
    >
      <div className="stat-icon" style={{ background: bgColor || '#dcfce7' }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

/**
 * Demo mode notice banner – displayed when AI credentials are not configured.
 * MUST be shown whenever returning demo/sample data so the user is never misled.
 */
export function DemoBanner({ message }) {
  return (
    <div className="demo-banner" role="status" aria-live="polite">
      <span className="demo-banner-icon">⚠️</span>
      <div className="demo-banner-text">
        <div className="demo-banner-title">Demo Mode – Sample Data</div>
        <div>
          {message ||
            'No AI credentials are configured. The results below are pre-defined sample data ' +
            'and do NOT represent actual AI analysis of your image.'}
        </div>
      </div>
    </div>
  )
}

/**
 * Alert banner: type = 'warning' | 'info' | 'success' | 'error'
 */
export function Alert({ type = 'info', icon, children }) {
  const icons = { warning: '⚠️', info: 'ℹ️', success: '✅', error: '❌' }
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon">{icon || icons[type]}</span>
      <div>{children}</div>
    </div>
  )
}

/**
 * Loading overlay with spinner.
 */
export function LoadingOverlay({ text = 'Analysing…' }) {
  return (
    <div className="loading-overlay" aria-live="polite" aria-busy="true">
      <div className="spinner spinner-lg" aria-hidden="true" />
      <div className="loading-overlay-text">{text}</div>
    </div>
  )
}

/**
 * Empty / initial state placeholder.
 */
export function EmptyState({ icon = '🍽️', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      {title && <div className="empty-state-title">{title}</div>}
      {description && <div className="empty-state-desc">{description}</div>}
      {action}
    </div>
  )
}

/**
 * Nutrition grid displaying macro values.
 */
export function NutritionGrid({ items }) {
  return (
    <div className="nutrition-grid">
      {items.map(({ label, value, unit }) => (
        <div key={label} className="nutrition-item">
          <div className="nutrition-value">{value}</div>
          <div className="nutrition-unit">{unit}</div>
          <div className="nutrition-label">{label}</div>
        </div>
      ))}
    </div>
  )
}

/**
 * Progress bar.
 * colorStart / colorEnd are CSS color strings.
 */
export function ProgressBar({ value, max = 100, colorStart = '#22c55e', colorEnd = '#16a34a' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="progress-bar-wrap" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div
        className="progress-bar-fill"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
        }}
      />
    </div>
  )
}

/**
 * Score ring SVG indicator.
 */
export function ScoreRing({ score, max = 100, label = 'Score', color = '#22c55e' }) {
  const r = 50
  const circ = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, (score / max) * 100))
  const offset = circ - (pct / 100) * circ

  return (
    <div className="score-ring-wrap">
      <div className="score-ring">
        <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="score-ring-bg" cx="60" cy="60" r={r} />
          <circle
            className="score-ring-fill"
            cx="60"
            cy="60"
            r={r}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-ring-text">
          <span className="score-ring-value">{score}</span>
          <span className="score-ring-label">{label}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Image upload zone with drag-and-drop support.
 */
export function UploadZone({ onFile, accept = 'image/jpeg,image/png,image/webp', maxMB = 10 }) {
  const [dragging, setDragging] = React.useState(false)

  function handleFile(file) {
    if (!file) return
    const validTypes = accept.split(',').map((s) => s.trim())
    if (!validTypes.includes(file.type)) {
      alert(`Unsupported file type. Allowed: ${accept}`)
      return
    }
    if (file.size > maxMB * 1024 * 1024) {
      alert(`File too large. Maximum size is ${maxMB} MB.`)
      return
    }
    onFile(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div
      className={`upload-zone${dragging ? ' drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      role="button"
      aria-label="Upload food image"
      tabIndex={0}
    >
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files[0])}
        id="image-upload-input"
        aria-label="Select food image file"
      />
      <div className="upload-zone-icon">📷</div>
      <div className="upload-zone-title">Drop your food image here</div>
      <div className="upload-zone-sub">
        or click to browse · JPEG, PNG, WebP · max {maxMB} MB
      </div>
    </div>
  )
}

/**
 * Image preview with remove button.
 */
export function ImagePreview({ src, alt = 'Uploaded image', onRemove }) {
  return (
    <div className="image-preview-container">
      <img src={src} alt={alt} className="image-preview-img" />
      <button
        className="image-preview-remove"
        onClick={onRemove}
        aria-label="Remove image"
        type="button"
      >
        ✕
      </button>
    </div>
  )
}
