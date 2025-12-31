import { useState, useEffect } from 'react';
import { User, DollarSign, Heart, Flame, UtensilsCrossed, Sparkles, ArrowRight, ArrowLeft, Save, Check } from 'lucide-react';

const GOALS = [
  { value: 'healing', label: 'Healing & Repair', emoji: '🩹', desc: 'Focus on recovery and tissue repair' },
  { value: 'weight-gain', label: 'Weight Gain', emoji: '💪', desc: 'Build muscle and healthy mass' },
  { value: 'weight-loss', label: 'Weight Loss', emoji: '⚖️', desc: 'Sustainable fat loss' },
  { value: 'energy', label: 'Energy & Vitality', emoji: '⚡', desc: 'Stable energy all day' },
];

const COOKING_STYLES = [
  { value: 'batch', label: 'Batch Cooking', emoji: '🍲', desc: 'Cook once, eat for days. Perfect for busy schedules.' },
  { value: 'quick', label: 'Quick & Easy', emoji: '⏱️', desc: '15 minutes or less. Fast and simple meals.' },
  { value: 'chef', label: 'Chef Style', emoji: '👨‍🍳', desc: 'Complex, gourmet cooking. Enjoy the process.' },
];

const CUISINES = [
  { value: 'any', label: 'Any / Mixed', emoji: '🌍' },
  { value: 'italian', label: 'Italian', emoji: '🇮🇹' },
  { value: 'asian', label: 'Asian', emoji: '🥢' },
  { value: 'mexican', label: 'Mexican', emoji: '🇲🇽' },
  { value: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { value: 'american', label: 'American', emoji: '🇺🇸' },
  { value: 'indian', label: 'Indian', emoji: '🇮🇳' },
];

export default function InterviewForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [profileSaved, setProfileSaved] = useState(false);
  const [form, setForm] = useState({
    weight: '',
    weightUnit: 'kg',
    height: '',
    heightUnit: 'cm',
    goal: '',
    budget: '',
    currency: 'USD',
    budgetPeriod: 'week',
    favorites: '',
    dislikes: '',
    cookingStyle: '',
    cuisine: 'any',
  });

  // Load saved profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('chefai-profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setForm(parsed);
      } catch (e) {
        console.error('Failed to load saved profile');
      }
    }
  }, []);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const saveProfile = () => {
    localStorage.setItem('chefai-profile', JSON.stringify(form));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const steps = [
    {
      title: 'Your Body & Goals',
      subtitle: 'Help us understand your physical stats and what you want to achieve',
      icon: User,
      content: (
        <div className="space-y-8">
          {/* Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Weight</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => updateForm('weight', e.target.value)}
                  placeholder="70"
                  className="flex-1 px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white"
                />
                <select 
                  value={form.weightUnit}
                  onChange={(e) => updateForm('weightUnit', e.target.value)}
                  className="px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 outline-none bg-white cursor-pointer"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Height</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={form.height}
                  onChange={(e) => updateForm('height', e.target.value)}
                  placeholder="175"
                  className="flex-1 px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white"
                />
                <select 
                  value={form.heightUnit}
                  onChange={(e) => updateForm('heightUnit', e.target.value)}
                  className="px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 outline-none bg-white cursor-pointer"
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">What's Your Primary Goal?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => updateForm('goal', g.value)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    form.goal === g.value 
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{g.emoji}</span>
                    <span className="font-semibold text-gray-800">{g.label}</span>
                  </div>
                  <p className="text-sm text-gray-500 pl-9">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: () => form.weight && form.height && form.goal,
    },
    {
      title: 'Your Budget',
      subtitle: 'How much can you spend on food? We\'ll maximize nutrition within your means.',
      icon: DollarSign,
      content: (
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Weekly Food Budget</label>
            <div className="flex gap-3 flex-wrap">
              <select 
                value={form.currency}
                onChange={(e) => updateForm('currency', e.target.value)}
                className="px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 outline-none bg-white cursor-pointer font-medium"
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="AUD">$ AUD</option>
                <option value="CAD">$ CAD</option>
              </select>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => updateForm('budget', e.target.value)}
                placeholder="100"
                className="flex-1 min-w-[150px] px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white"
              />
              <select 
                value={form.budgetPeriod}
                onChange={(e) => updateForm('budgetPeriod', e.target.value)}
                className="px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 outline-none bg-white cursor-pointer"
              >
                <option value="week">per week</option>
                <option value="month">per month</option>
              </select>
            </div>
          </div>
          
          {/* Budget insight */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex gap-4">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Smart Budgeting</h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  We'll use batch cooking and cross-utilization to stretch every dollar. 
                  Seasonal produce and smart substitutions help maximize nutrition without breaking the bank.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      valid: () => form.budget,
    },
    {
      title: 'Food Preferences',
      subtitle: 'Tell us what you love to eat and what to avoid',
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Favorite Ingredients & Foods
              <span className="font-normal text-gray-400 ml-2">What do you enjoy eating?</span>
            </label>
            <textarea
              value={form.favorites}
              onChange={(e) => updateForm('favorites', e.target.value)}
              placeholder="e.g., chicken, spinach, rice, eggs, berries, avocado, salmon..."
              className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white resize-none h-32"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Foods to Avoid
              <span className="font-normal text-gray-400 ml-2">Dislikes or allergies</span>
            </label>
            <textarea
              value={form.dislikes}
              onChange={(e) => updateForm('dislikes', e.target.value)}
              placeholder="e.g., mushrooms, seafood, dairy (lactose intolerant), cilantro..."
              className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white resize-none h-32"
            />
          </div>
        </div>
      ),
      valid: () => form.favorites,
    },
    {
      title: 'Cooking Style',
      subtitle: 'How much time and effort do you want to spend in the kitchen?',
      icon: Flame,
      content: (
        <div className="space-y-4">
          {COOKING_STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => updateForm('cookingStyle', s.value)}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                form.cookingStyle === s.value 
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{s.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{s.label}</h3>
                  <p className="text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ),
      valid: () => form.cookingStyle,
    },
    {
      title: 'Cuisine Preference',
      subtitle: 'What flavors and cuisines do you enjoy most?',
      icon: UtensilsCrossed,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CUISINES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => updateForm('cuisine', c.value)}
              className={`p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
                form.cuisine === c.value 
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
              }`}
            >
              <span className="text-3xl block mb-2">{c.emoji}</span>
              <span className="font-medium text-gray-800">{c.label}</span>
            </button>
          ))}
        </div>
      ),
      valid: () => form.cuisine,
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const isLast = step === steps.length - 1;
  const canProceed = currentStep.valid();

  const handleNext = () => {
    if (isLast) {
      onSubmit(form);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Step {step + 1} of {steps.length}</span>
          <span className="text-sm text-emerald-600 font-medium">{Math.round(((step + 1) / steps.length) * 100)}% complete</span>
        </div>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i < step ? 'bg-emerald-500' : i === step ? 'bg-emerald-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start gap-5 mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentStep.title}</h2>
            <p className="text-gray-500 mt-1">{currentStep.subtitle}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-10">
          {currentStep.content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-medium ${
              step === 0 ? 'invisible' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            {/* Save Profile Button */}
            <button
              type="button"
              onClick={saveProfile}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                profileSaved 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {profileSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                canProceed 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLast ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Plan
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
