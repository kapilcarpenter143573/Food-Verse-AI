/**
 * Food Verse AI – API Service Layer
 * All backend calls go through this module.
 * The base URL is read from the VITE_API_BASE_URL env variable
 * so no secrets are ever hard-coded.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// ── Generic fetch wrapper ────────────────────────────────────
async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    })

    const contentType = res.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await res.json() : await res.text()

    if (!res.ok) {
      const message = data?.detail || data?.message || `HTTP ${res.status}`
      const error = new Error(message)
      error.status = res.status
      error.data = data
      throw error
    }

    return data
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot connect to the backend server. Make sure it is running on ' + API_BASE)
    }
    throw err
  }
}

// ── Helper to build multipart form data ─────────────────────
function buildFormData(fields) {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v)
  })
  return fd
}

// ── Health ───────────────────────────────────────────────────
export const healthCheck = () => apiFetch('/api/health')

// ── Food Recognition & Nutrition ─────────────────────────────
export const analyzeFood = ({ imageFile, servingSize = 1 }) =>
  apiFetch('/api/food/analyze', {
    method: 'POST',
    body: buildFormData({ image: imageFile, serving_size: servingSize }),
  })

// ── Freshness Detection ───────────────────────────────────────
export const analyzeFreshness = ({ imageFile, foodType = '' }) =>
  apiFetch('/api/food/freshness', {
    method: 'POST',
    body: buildFormData({ image: imageFile, food_type: foodType }),
  })

// ── Meal Planner ──────────────────────────────────────────────
export const generateMealPlan = (preferences) =>
  apiFetch('/api/meals/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  })

export default { healthCheck, analyzeFood, analyzeFreshness, generateMealPlan }
