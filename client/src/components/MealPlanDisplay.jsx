import { useState } from 'react';
import { 
  Target, Calendar, BookOpen, ShoppingCart, PiggyBank, 
  Save, Check, ChevronDown, ChevronUp, Clock, Flame
} from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORY_ICONS = {
  produce: '🥬',
  dairy: '🥛',
  meat: '🥩',
  protein: '🍗',
  pantry: '🥫',
  frozen: '🧊',
  bakery: '🍞',
  beverages: '🥤',
  eggs: '🥚',
  grains: '🌾',
  spices: '🌶️',
  other: '📦'
};

function ShoppingCategory({ category, items }) {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h4 className="font-bold text-gray-800 capitalize mb-4 flex items-center gap-3 text-lg">
        <span className="text-2xl">{CATEGORY_ICONS[category] || '📦'}</span>
        {category}
      </h4>
      <ul className="space-y-3">
        {items.map((item, i) => {
          const itemName = typeof item === 'object' ? item.item : item;
          const itemPrice = typeof item === 'object' ? item.price : null;
          return (
            <li key={i} className="flex items-center gap-3 text-gray-600">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
              <span className="flex-1">{itemName}</span>
              {itemPrice !== null && (
                <span className="text-emerald-600 font-medium">£{typeof itemPrice === 'number' ? itemPrice.toFixed(2) : itemPrice}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MealPlanDisplay({ plan, profile, onSave }) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    const success = await onSave(saveName);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaveModalOpen(false), 1500);
    }
  };

  const tabs = [
    { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
    { id: 'recipes', label: 'Recipes', icon: BookOpen },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
    { id: 'budget', label: 'Budget', icon: PiggyBank },
  ];

  return (
    <div className="space-y-8">
      {/* Strategy Card */}
      <div className="rounded-3xl p-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/25">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Target className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">
              {plan.strategy?.title || "Your Weekly Strategy"}
            </h2>
            <p className="text-emerald-100 text-lg mb-4">
              {plan.strategy?.description}
            </p>
            {plan.strategy?.flavorProfile && (
              <p className="text-white/90 mb-4 italic">
                🍴 {plan.strategy.flavorProfile}
              </p>
            )}
            {plan.strategy?.keyNutrients && (
              <div className="flex flex-wrap gap-2 mb-4">
                {plan.strategy.keyNutrients.map((n, i) => (
                  <span key={i} className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                    {n}
                  </span>
                ))}
              </div>
            )}
            {plan.strategy?.chefTips && plan.strategy.chefTips.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4 mt-4">
                <h4 className="font-semibold mb-2">👨‍🍳 Chef Tips</h4>
                <ul className="space-y-1 text-sm text-emerald-100">
                  {plan.strategy.chefTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {plan.encouragement && (
          <div className="mt-6 pt-6 border-t border-white/20 text-emerald-100 italic text-lg">
            "{plan.encouragement}"
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setSaveModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 font-medium transition-all"
        >
          <Save className="w-5 h-5" />
          Save This Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {/* Weekly Schedule */}
          {activeTab === 'schedule' && plan.weeklySchedule && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-3 text-gray-400 font-semibold text-sm uppercase tracking-wide">Meal</th>
                    {DAY_LABELS.map((d, i) => (
                      <th key={i} className="text-center py-4 px-3 text-gray-700 font-bold">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
                    <tr key={meal} className="border-t border-gray-100">
                      <td className="py-5 px-3 font-semibold text-gray-700 capitalize">{meal}</td>
                      {DAYS.map((day, i) => (
                        <td key={i} className="py-5 px-3 text-center text-sm text-gray-600">
                          {plan.weeklySchedule[day]?.[meal] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recipes */}
          {activeTab === 'recipes' && plan.recipes && (
            <div className="space-y-4">
              {plan.recipes.map((recipe, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-all">
                  <button
                    onClick={() => setExpandedRecipe(expandedRecipe === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-800 text-lg">{recipe.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          {recipe.prepTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {recipe.prepTime}
                            </span>
                          )}
                          {recipe.calories && (
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4" /> {recipe.calories}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {expandedRecipe === i ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedRecipe === i && (
                    <div className="p-6 pt-0 space-y-5">
                      {/* Cuisine and flavor notes */}
                      <div className="flex flex-wrap gap-3">
                        {recipe.cuisine && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            🌍 {recipe.cuisine}
                          </span>
                        )}
                        {recipe.protein && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            💪 {recipe.protein} protein
                          </span>
                        )}
                        {recipe.cookTime && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                            🍳 {recipe.cookTime} cook time
                          </span>
                        )}
                      </div>
                      
                      {recipe.flavorNotes && (
                        <p className="text-sm text-amber-700 bg-amber-50 px-4 py-3 rounded-xl italic">
                          ✨ {recipe.flavorNotes}
                        </p>
                      )}
                      
                      {recipe.nutrients && (
                        <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl">
                          <strong>Key Nutrients:</strong> {recipe.nutrients}
                        </p>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-bold text-gray-700 mb-3">Ingredients</h5>
                          <ul className="space-y-2">
                            {recipe.ingredients?.map((ing, j) => (
                              <li key={j} className="text-gray-600 flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                {ing}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-700 mb-3">Instructions</h5>
                          <ol className="space-y-3">
                            {recipe.instructions?.map((step, j) => (
                              <li key={j} className="text-gray-600 flex items-start gap-3">
                                <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{j + 1}</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                      
                      {recipe.chefSecrets && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mt-4">
                          <p className="text-amber-800 font-medium">
                            👨‍🍳 <strong>Chef's Secret:</strong> {recipe.chefSecrets}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Shopping List */}
          {activeTab === 'shopping' && plan.shoppingList && (
            <div className="space-y-8">
              {/* Check if new format (weekly/monthlyBulk/monthlyRegular) or old format */}
              {plan.shoppingList.weekly || plan.shoppingList.monthlyBulk || plan.shoppingList.monthlyRegular ? (
                <>
                  {/* Weekly Items */}
                  {plan.shoppingList.weekly && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm">🛒 Weekly</span>
                        Fresh items to buy each week
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(plan.shoppingList.weekly).map(([category, items]) => (
                          <ShoppingCategory key={category} category={category} items={items} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monthly Bulk Items */}
                  {plan.shoppingList.monthlyBulk && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">📦 Monthly Bulk</span>
                        Buy in bulk once a month for savings
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(plan.shoppingList.monthlyBulk).map(([category, items]) => (
                          <ShoppingCategory key={category} category={category} items={items} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monthly Regular Items */}
                  {plan.shoppingList.monthlyRegular && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm">📅 Monthly</span>
                        Items that last the whole month
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(plan.shoppingList.monthlyRegular).map(([category, items]) => (
                          <ShoppingCategory key={category} category={category} items={items} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Old format fallback */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(plan.shoppingList).map(([category, items]) => (
                    <ShoppingCategory key={category} category={category} items={items} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Budget */}
          {activeTab === 'budget' && plan.financialBreakdown && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-4 gap-5">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 text-center shadow-lg shadow-emerald-500/25">
                  <p className="text-emerald-100 text-sm mb-2 font-medium">Weekly Total</p>
                  <p className="text-4xl font-bold">{plan.financialBreakdown.weeklyTotal || plan.financialBreakdown.estimatedTotal}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center shadow-lg shadow-blue-500/25">
                  <p className="text-blue-100 text-sm mb-2 font-medium">Monthly Total</p>
                  <p className="text-4xl font-bold">{plan.financialBreakdown.monthlyTotal || '—'}</p>
                </div>
                <div className="bg-gray-100 rounded-2xl p-6 text-center">
                  <p className="text-gray-500 text-sm mb-2 font-medium">Per Meal</p>
                  <p className="text-4xl font-bold text-gray-800">{plan.financialBreakdown.perMeal}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-6 text-center border-2 border-amber-200">
                  <p className="text-amber-600 text-sm mb-2 font-medium">Budget Status</p>
                  <p className="text-xl font-bold text-amber-700">{plan.financialBreakdown.budgetStatus}</p>
                </div>
              </div>

              {plan.financialBreakdown.breakdown && (
                <div>
                  <h4 className="font-bold text-gray-700 mb-4 text-lg">Cost Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(plan.financialBreakdown.breakdown).map(([cat, cost]) => (
                      <div key={cat} className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-gray-500 text-sm capitalize mb-1">{cat}</p>
                        <p className="font-bold text-gray-700 text-lg">{cost}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(plan.financialBreakdown.savingsTips || plan.financialBreakdown.moneySavingHacks) && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2 text-lg">
                    <span className="text-2xl">💡</span> Money-Saving Tips
                  </h4>
                  <ul className="space-y-3">
                    {(plan.financialBreakdown.savingsTips || plan.financialBreakdown.moneySavingHacks).map((tip, i) => (
                      <li key={i} className="text-amber-700 flex items-start gap-3">
                        <span className="text-amber-500 font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Meal Prep Guide */}
              {plan.mealPrepGuide && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-lg">
                    <span className="text-2xl">📋</span> Meal Prep Guide
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {plan.mealPrepGuide.sunday && (
                      <div>
                        <h5 className="font-semibold text-blue-700 mb-2">🗓️ Sunday Prep</h5>
                        <ul className="space-y-2">
                          {plan.mealPrepGuide.sunday.map((item, i) => (
                            <li key={i} className="text-blue-600 flex items-start gap-2">
                              <span className="text-blue-400">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {plan.mealPrepGuide.weeknight && (
                      <div>
                        <h5 className="font-semibold text-blue-700 mb-2">⚡ Weeknight Tips</h5>
                        <ul className="space-y-2">
                          {plan.mealPrepGuide.weeknight.map((item, i) => (
                            <li key={i} className="text-blue-600 flex items-start gap-2">
                              <span className="text-blue-400">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {saved ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Saved!</h3>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Save Meal Plan</h3>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g., January Week 1"
                  className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all mb-6"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                      saveName.trim() 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
