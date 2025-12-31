import { ChefHat } from 'lucide-react';

const tips = [
  "Analyzing your nutrient requirements...",
  "Finding budget-friendly ingredients...",
  "Crafting delicious recipes...",
  "Optimizing for zero food waste...",
  "Balancing your macros...",
  "Adding the finishing touches...",
];

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="text-center max-w-md">
        <div className="relative mb-10">
          <div className="w-36 h-36 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center pulse-glow">
            <ChefHat className="w-20 h-20 text-white animate-pulse" />
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-5 h-5 bg-emerald-400 rounded-full shadow-lg" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-4 h-4 bg-amber-400 rounded-full shadow-lg" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Crafting Your Meal Plan
        </h2>
        
        <p className="text-gray-500 mb-10 text-lg">
          Our AI chef is preparing a personalized, nutrient-dense meal plan just for you.
        </p>

        {/* Animated tips */}
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="shimmer h-4 rounded-full mx-auto"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                width: `${60 + Math.random() * 35}%`,
              }}
            />
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-10">
          This usually takes 10-20 seconds...
        </p>
      </div>
    </div>
  );
}
