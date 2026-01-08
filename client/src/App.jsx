import { useState, useEffect } from 'react';
import { ChefHat, Sparkles, BookOpen, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import InterviewForm from './components/InterviewForm';
import MealPlanDisplay from './components/MealPlanDisplay';
import LoadingScreen from './components/LoadingScreen';
import SavedPlans from './components/SavedPlans';

// LocalStorage helper functions for Vercel deployment
const STORAGE_KEY = 'chefai_saved_plans';

const getLocalPlans = () => {
  try {
    const plans = localStorage.getItem(STORAGE_KEY);
    return plans ? JSON.parse(plans) : [];
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return [];
  }
};

const saveLocalPlans = (plans) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
};

function App() {
  const [view, setView] = useState('home'); // home, form, loading, result, saved
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load plans from localStorage
    setSavedPlans(getLocalPlans());
  }, []);

  const handleFormSubmit = async (profile) => {
    setCurrentProfile(profile);
    setView('loading');
    setError(null);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setCurrentPlan(data.plan);
        setView('result');
      } else {
        setError(data.error || 'Failed to generate plan');
        setView('form');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
      setView('form');
    }
  };

  const handleSavePlan = async (name) => {
    try {
      const newPlan = {
        id: Date.now(),
        name,
        user_profile: currentProfile,
        plan_data: currentPlan,
        created_at: new Date().toISOString()
      };
      
      const plans = getLocalPlans();
      plans.unshift(newPlan); // Add to beginning
      
      if (saveLocalPlans(plans)) {
        setSavedPlans(plans);
        return true;
      }
    } catch (e) {
      console.error('Failed to save:', e);
    }
    return false;
  };

  const handleLoadPlan = (id) => {
    const plans = getLocalPlans();
    const plan = plans.find(p => p.id === id);
    
    if (plan) {
      setCurrentPlan(plan.plan_data);
      setCurrentProfile(plan.user_profile);
      setView('result');
    }
  };

  const handleDeletePlan = (id) => {
    const plans = getLocalPlans();
    const filteredPlans = plans.filter(p => p.id !== id);
    
    if (saveLocalPlans(filteredPlans)) {
      setSavedPlans(filteredPlans);
    }
  };

  return (
    <div className="min-h-screen">
      {view === 'home' && (
        <div className="min-h-screen flex flex-col">
          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center px-6 py-16">
            <div className="max-w-4xl text-center">
              {/* Logo */}
              <div className="flex justify-center mb-8 sm:mb-10">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center float-animation shadow-2xl shadow-emerald-500/40">
                  <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-800 mb-4 tracking-tight">
                Chef<span className="text-emerald-500">AI</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-500 mb-3 font-light">
                High Nutrient Density on a Budget
              </p>
              <p className="text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg">
                Get personalized weekly meal plans crafted by AI, focused on maximizing nutrition while respecting your budget and taste preferences.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <button 
                  onClick={() => setView('form')}
                  className="btn-primary flex items-center justify-center gap-3 text-base sm:text-lg min-h-[56px]"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  Create New Plan
                </button>
                <button 
                  onClick={() => setView('saved')}
                  className="btn-secondary flex items-center justify-center gap-3 text-base sm:text-lg min-h-[56px]"
                >
                  <BookOpen className="w-5 h-5" />
                  Saved Plans ({savedPlans.length})
                </button>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20">
                {[
                  { icon: '🥗', title: 'Nutrient Dense', desc: 'Maximized vitamins & minerals per calorie' },
                  { icon: '💰', title: 'Budget Friendly', desc: 'Stays within your weekly spending limit' },
                  { icon: '♻️', title: 'Zero Waste', desc: 'Smart cross-utilization of ingredients' },
                ].map((f, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{f.icon}</div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2">{f.title}</h3>
                    <p className="text-sm sm:text-base text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'form' && (
        <div className="min-h-screen py-6 sm:py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 sm:mb-8 transition-colors font-medium min-h-[44px] -ml-2 pl-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold">Something went wrong</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
            
            <InterviewForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}

      {view === 'loading' && <LoadingScreen />}

      {view === 'result' && currentPlan && (
        <div className="min-h-screen py-6 sm:py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors min-h-[44px] -ml-2 pl-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <button
                onClick={() => { setCurrentPlan(null); setView('form'); }}
                className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                New Plan
              </button>
            </div>
            
            <MealPlanDisplay 
              plan={currentPlan} 
              profile={currentProfile}
              onSave={handleSavePlan}
            />
          </div>
        </div>
      )}

      {view === 'saved' && (
        <div className="min-h-screen py-6 sm:py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-sage-600 hover:text-sage-800 mb-4 sm:mb-6 transition-colors min-h-[44px] -ml-2 pl-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            
            <SavedPlans 
              plans={savedPlans}
              onLoad={handleLoadPlan}
              onDelete={handleDeletePlan}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
