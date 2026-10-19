import React, { useState } from 'react'
import { Card, DemoBanner, Alert, LoadingOverlay, EmptyState, NutritionGrid } from '../components/UI.jsx'
import { generateMealPlan } from '../services/api.js'

const DIET_OPTIONS = [
  { value: 'vegetarian',    label: '🥦 Vegetarian' },
  { value: 'vegan',         label: '🌱 Vegan' },
  { value: 'eggetarian',    label: '🥚 Eggetarian' },
  { value: 'non-vegetarian',label: '🍗 Non-Vegetarian' },
]

const MEAL_COUNTS = [2, 3, 4, 5, 6]

const COMMON_ALLERGENS = ['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish', 'Sesame']

const MEAL_EMOJIS = {
  breakfast: '🌅',
  morning_snack: '🍎',
  lunch: '🌞',
  afternoon_snack: '☕',
  dinner: '🌙',
  evening_snack: '🌛',
}

export default function MealPlanner() {
  // Preferences
  const [diet, setDiet] = useState('vegetarian')
  const [calorieGoal, setCalorieGoal] = useState(2000)
  const [budget, setBudget] = useState(500)
  const [mealCount, setMealCount] = useState(3)
  const [selectedAllergens, setSelectedAllergens] = useState([])
  const [avoidIngredients, setAvoidIngredients] = useState('')
  const [customAllergen, setCustomAllergen] = useState('')

  // State
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState(null)
  const [shoppingList, setShoppingList] = useState([])
  const [shoppingChecked, setShoppingChecked] = useState({})
  const [activeTab, setActiveTab] = useState('meals')

  function toggleAllergen(a) {
    setSelectedAllergens((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    )
  }

  function addCustomAllergen() {
    const val = customAllergen.trim()
    if (val && !selectedAllergens.includes(val)) {
      setSelectedAllergens((prev) => [...prev, val])
    }
    setCustomAllergen('')
  }

  async function handleGenerate() {
    setLoading(true)
    setPlan(null)
    setError(null)
    setShoppingList([])
    setShoppingChecked({})
    try {
      const data = await generateMealPlan({
        diet,
        calorie_goal: calorieGoal,
        budget_inr: budget,
        meal_count: mealCount,
        allergens: selectedAllergens,
        avoid_ingredients: avoidIngredients
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      })
      setPlan(data)
      setShoppingList(data.shopping_list || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meal_plan.json'
    a.click()
  }

  function handleReset() {
    setPlan(null)
    setError(null)
    setShoppingList([])
    setShoppingChecked({})
  }

  const macros = plan?.nutrition_totals
    ? [
        { label: 'Calories', value: plan.nutrition_totals.calories ?? '–', unit: 'kcal' },
        { label: 'Protein',  value: plan.nutrition_totals.protein_g  ?? '–', unit: 'g' },
        { label: 'Carbs',    value: plan.nutrition_totals.carbs_g    ?? '–', unit: 'g' },
        { label: 'Fat',      value: plan.nutrition_totals.fat_g      ?? '–', unit: 'g' },
      ]
    : []

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title page-title-icon">
          <span>📅</span> Personalised Meal Planner
        </h1>
        <p className="page-subtitle">
          Set your dietary preferences and generate a full day's meal plan with a shopping list.
        </p>
      </div>

      <Alert type="info">
        Meal suggestions are estimates based on general nutritional data. This is not medical or
        dietary advice. Consult a registered dietitian for personalised recommendations.
      </Alert>

      <div className="two-col-grid" style={{ alignItems:'start' }}>
        {/* Preferences Panel */}
        <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
          <Card title="Your Preferences" icon="⚙️">
            {/* Diet */}
            <div className="form-group">
              <label className="form-label">Diet Preference</label>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
                {DIET_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    id={`diet-${d.value}`}
                    className={`btn ${diet === d.value ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent:'flex-start',fontSize:13 }}
                    onClick={() => setDiet(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calorie goal */}
            <div className="form-group">
              <label className="form-label" htmlFor="calorie-goal">
                Daily Calorie Goal: <strong>{calorieGoal} kcal</strong>
              </label>
              <input
                id="calorie-goal"
                type="range"
                min={1000}
                max={4000}
                step={50}
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                style={{ width:'100%',accentColor:'var(--green-600)' }}
              />
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-muted)',marginTop:2 }}>
                <span>1000</span><span>2000</span><span>3000</span><span>4000 kcal</span>
              </div>
            </div>

            {/* Budget */}
            <div className="form-group">
              <label className="form-label" htmlFor="budget-input">
                Daily Budget (₹)
              </label>
              <input
                id="budget-input"
                type="number"
                className="form-input"
                min={100}
                max={5000}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </div>

            {/* Meal count */}
            <div className="form-group">
              <label className="form-label">Meals per Day</label>
              <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                {MEAL_COUNTS.map((n) => (
                  <button
                    key={n}
                    id={`meals-per-day-${n}`}
                    className={`btn btn-sm ${mealCount === n ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setMealCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="form-group">
              <label className="form-label">Allergies / Intolerances</label>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:10 }}>
                {COMMON_ALLERGENS.map((a) => (
                  <button
                    key={a}
                    id={`allergen-${a.toLowerCase()}`}
                    className={`btn btn-sm ${selectedAllergens.includes(a) ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => toggleAllergen(a)}
                  >
                    {selectedAllergens.includes(a) ? '✕ ' : '+ '}{a}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex',gap:8 }}>
                <input
                  className="form-input"
                  placeholder="Add custom allergen…"
                  value={customAllergen}
                  onChange={(e) => setCustomAllergen(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomAllergen()}
                />
                <button className="btn btn-secondary" onClick={addCustomAllergen}>Add</button>
              </div>
              {selectedAllergens.length > 0 && (
                <div style={{ display:'flex',flexWrap:'wrap',gap:4,marginTop:8 }}>
                  {selectedAllergens.map((a) => (
                    <span key={a} className="tag">
                      {a}
                      <button className="tag-remove" onClick={() => toggleAllergen(a)}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Avoid ingredients */}
            <div className="form-group">
              <label className="form-label" htmlFor="avoid-ingredients">
                Ingredients to Avoid (comma-separated)
              </label>
              <input
                id="avoid-ingredients"
                className="form-input"
                placeholder="e.g. mushrooms, eggplant, olives"
                value={avoidIngredients}
                onChange={(e) => setAvoidIngredients(e.target.value)}
              />
            </div>

            <button
              id="generate-meal-plan-btn"
              className="btn btn-primary w-full btn-lg"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? '⏳ Generating…' : '✨ Generate Meal Plan'}
            </button>
          </Card>
        </div>

        {/* Results */}
        <div>
          <Card title="Your Meal Plan" icon="📋">
            {loading && <LoadingOverlay text="Crafting your personalised meal plan…" />}
            {error && !loading && <Alert type="error">{error}</Alert>}

            {!loading && !plan && !error && (
              <EmptyState
                icon="📅"
                title="No plan yet"
                description="Set your preferences on the left and click 'Generate Meal Plan'."
              />
            )}

            {!loading && plan && (
              <div className="result-section">
                {plan.is_demo && <DemoBanner message="No AI credentials configured. Meal suggestions are from a sample dataset and are NOT personalised AI recommendations." />}

                {/* Tabs */}
                <div className="tab-bar">
                  <button className={`tab-btn${activeTab==='meals'?' active':''}`} id="tab-meals" onClick={()=>setActiveTab('meals')}>🍽️ Meals</button>
                  <button className={`tab-btn${activeTab==='nutrition'?' active':''}`} id="tab-nutrition" onClick={()=>setActiveTab('nutrition')}>📊 Nutrition</button>
                  <button className={`tab-btn${activeTab==='shopping'?' active':''}`} id="tab-shopping" onClick={()=>setActiveTab('shopping')}>🛒 Shopping</button>
                </div>

                {/* Meals Tab */}
                {activeTab === 'meals' && (
                  <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                    {plan.meals?.map((meal) => (
                      <div key={meal.slot} className="meal-card">
                        <div
                          className="meal-card-header"
                          style={{ background:'var(--green-50)',borderBottom:'1px solid var(--green-100)' }}
                        >
                          <span style={{ fontSize:20 }}>{MEAL_EMOJIS[meal.slot] || '🍽️'}</span>
                          <span style={{ textTransform:'capitalize',color:'var(--green-800)' }}>
                            {meal.slot.replace('_', ' ')}
                          </span>
                          <span className="badge badge-green" style={{ marginLeft:'auto' }}>
                            ~{meal.calories} kcal
                          </span>
                        </div>
                        <div className="meal-card-body">
                          <div style={{ fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,marginBottom:6 }}>
                            {meal.name}
                          </div>
                          <div style={{ fontSize:13,color:'var(--text-secondary)',lineHeight:1.6,marginBottom:8 }}>
                            {meal.description}
                          </div>
                          {meal.ingredients?.length > 0 && (
                            <div style={{ display:'flex',flexWrap:'wrap',gap:4 }}>
                              {meal.ingredients.map((ing) => (
                                <span key={ing} className="badge badge-gray" style={{ fontSize:11 }}>{ing}</span>
                              ))}
                            </div>
                          )}
                          {meal.prep_time && (
                            <div style={{ fontSize:12,color:'var(--text-muted)',marginTop:8 }}>
                              ⏱️ {meal.prep_time} · 💰 ₹{meal.cost ?? '–'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nutrition Tab */}
                {activeTab === 'nutrition' && macros.length > 0 && (
                  <div>
                    <div style={{ fontSize:13,color:'var(--text-secondary)',marginBottom:16 }}>
                      Estimated daily totals · values are approximate
                    </div>
                    <NutritionGrid items={macros} />
                    {plan.nutrition_notes && (
                      <Alert type="info" style={{ marginTop:16 }}>{plan.nutrition_notes}</Alert>
                    )}
                  </div>
                )}

                {/* Shopping Tab */}
                {activeTab === 'shopping' && (
                  <div>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                      <div style={{ fontSize:14,fontWeight:600 }}>Shopping List</div>
                      <button
                        id="edit-shopping-list-btn"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const item = prompt('Add item to shopping list:')
                          if (item?.trim()) setShoppingList((p) => [...p, { name: item.trim(), quantity: '1', checked: false }])
                        }}
                      >
                        + Add Item
                      </button>
                    </div>
                    {shoppingList.length === 0 ? (
                      <EmptyState icon="🛒" title="No items" description="Generate a meal plan to populate the shopping list." />
                    ) : (
                      <div>
                        {shoppingList.map((item, i) => (
                          <div key={i} className="shopping-item">
                            <input
                              type="checkbox"
                              id={`shop-item-${i}`}
                              checked={!!shoppingChecked[i]}
                              onChange={() => setShoppingChecked((p) => ({ ...p, [i]: !p[i] }))}
                              style={{ accentColor:'var(--green-600)',width:16,height:16,flexShrink:0 }}
                            />
                            <span style={{ flex:1,fontSize:14,textDecoration:shoppingChecked[i]?'line-through':'',color:shoppingChecked[i]?'var(--text-muted)':'var(--text-primary)' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize:13,color:'var(--text-muted)' }}>{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display:'flex',gap:10,marginTop:20,flexWrap:'wrap' }}>
                  <button id="save-meal-plan-btn" className="btn btn-primary btn-sm" onClick={handleSave}>
                    💾 Save Plan
                  </button>
                  <button id="reset-meal-plan-btn" className="btn btn-secondary btn-sm" onClick={handleReset}>
                    🔄 Reset
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
