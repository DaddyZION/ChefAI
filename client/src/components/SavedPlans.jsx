import { Calendar, Trash2, BookOpen } from 'lucide-react';

export default function SavedPlans({ plans, onLoad, onDelete }) {
  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">No Saved Plans Yet</h3>
        <p className="text-gray-500 text-lg">Create your first meal plan and save it here for easy access!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-gray-800 mb-8">
        Saved Meal Plans
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{plan.name}</h3>
                  <p className="text-gray-500">
                    {new Date(plan.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onDelete(plan.id)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => onLoad(plan.id)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
            >
              View Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
