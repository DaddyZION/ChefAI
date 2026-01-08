import { Calendar, Trash2, BookOpen } from 'lucide-react';

export default function SavedPlans({ plans, onLoad, onDelete }) {
  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">No Saved Plans Yet</h3>
        <p className="text-gray-500 text-base sm:text-lg">Create your first meal plan and save it here for easy access!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
        Saved Meal Plans
      </h2>
      
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">
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
                className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <button
              onClick={() => onLoad(plan.id)}
              className="w-full py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 min-h-[44px]"
            >
              View Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
