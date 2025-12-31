import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '../.env') });

// Debug: Check if API key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env file');
  console.error('   Make sure .env file exists in ChefAI folder with GEMINI_API_KEY=your_key');
} else {
  console.log('✅ Gemini API key loaded (length:', process.env.GEMINI_API_KEY.length, ')');
}

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(join(__dirname, '../data.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS meal_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_profile TEXT NOT NULL,
    plan_data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert Nutritionist and Professional Chef who specializes in "High Nutrient Density on a Budget."

Based on the user's profile provided, generate a complete Weekly Meal Plan.

IMPORTANT: You must respond with ONLY valid JSON (no markdown, no code blocks, no extra text). Use this exact structure:

{
  "strategy": {
    "title": "This Week's Focus",
    "description": "Brief explanation of nutrient density focus",
    "keyNutrients": ["nutrient1", "nutrient2", "nutrient3"]
  },
  "weeklySchedule": {
    "monday": { "breakfast": "meal", "lunch": "meal", "dinner": "meal", "snacks": "snack" },
    "tuesday": { "breakfast": "meal", "lunch": "meal", "dinner": "meal", "snacks": "snack" },
    "wednesday": { "breakfast": "meal", "lunch": "meal", "dinner": "meal", "snacks": "snack" },
    "thursday": { "breakfast": "meal", "lunch": "meal", "dinner": "meal", "snacks": "snack" },
    "friday": { "breakfast": "meal", "lunch": "meal", "dinner": "meal", "snacks": "snack" },
    "saturday": { "breakfast": "meal", "lunch": "meal", "dinner": "meal", "snacks": "snack" },
    "sunday": { "breakfast": "meal", "lunch": "meal", "dinner": "meal", "snacks": "snack" }
  },
  "recipes": [
    {
      "name": "Recipe Name",
      "prepTime": "15 mins",
      "calories": "500 kcal",
      "nutrients": "Key nutrients",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"]
    }
  ],
  "shoppingList": {
    "weekly": {
      "produce": [{"item": "2 onions", "price": 0.50}, {"item": "500g carrots", "price": 0.65}],
      "dairy": [{"item": "1L milk", "price": 1.15}],
      "meat": [{"item": "500g chicken breast", "price": 3.50}]
    },
    "monthlyBulk": {
      "pantry": [{"item": "2kg rice", "price": 3.50}, {"item": "1kg pasta", "price": 1.80}],
      "frozen": [{"item": "2kg frozen veg", "price": 3.00}]
    },
    "monthlyRegular": {
      "pantry": [{"item": "cooking oil 1L", "price": 2.50}, {"item": "spices", "price": 1.50}]
    }
  },
  "financialBreakdown": {
    "weeklyTotal": "£XX.XX",
    "monthlyTotal": "£XX.XX",
    "perMeal": "£X.XX",
    "budgetStatus": "Under budget by £X" or "Over budget by £X" or "On target",
    "breakdown": {
      "produce": "£XX.XX",
      "dairy": "£XX.XX",
      "meat": "£XX.XX",
      "pantry": "£XX.XX",
      "frozen": "£XX.XX"
    },
    "savingsTips": ["tip 1", "tip 2"]
  },
  "encouragement": "A brief encouraging message about their plan"
}

Constraints:
- Focus on whole foods and high nutrient density
- Use "Cross-Utilization" to ensure zero food waste
- Keep tone encouraging, factual, and practical
- Match the cooking style preference exactly
- CRITICAL: Stay STRICTLY within the user's budget - calculate realistic UK supermarket prices
- Include specific quantities AND accurate UK supermarket prices for EVERY shopping list item
- Use realistic 2024/2025 UK prices (e.g., chicken breast £6-8/kg, onions £0.80-1/kg, rice £1.50-2/kg, milk £1.15-1.50/L)
- The weeklyTotal MUST be the exact sum of all item prices in the shopping list
- monthlyTotal = weeklyTotal × 4.33 (rounded to 2 decimal places)
- If the calculated total exceeds budget, adjust the meal plan to use cheaper alternatives`;

// Generate meal plan
app.post('/api/generate', async (req, res) => {
  try {
    const { profile } = req.body;
    
    const userPrompt = `
Create a personalized weekly meal plan for this user:

**Biometrics & Goals:**
- Weight: ${profile.weight} ${profile.weightUnit}
- Height: ${profile.height} ${profile.heightUnit}
- Goal: ${profile.goal}

**Budget:** ${profile.budget} ${profile.currency} per ${profile.budgetPeriod}

**Food Preferences:**
- Favorite ingredients: ${profile.favorites}
- Dislikes: ${profile.dislikes}

**Cooking Style:** ${profile.cookingStyle}

**Cuisine Preference:** ${profile.cuisine}

Generate the complete meal plan now.`;

    const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });
    const result = await model.generateContent([SYSTEM_PROMPT, userPrompt]);
    const text = result.response.text();
    
    // Parse JSON from response (handle potential markdown code blocks)
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0];
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0];
    }
    
    const planData = JSON.parse(jsonText.trim());
    
    res.json({ success: true, plan: planData });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save meal plan
app.post('/api/plans', (req, res) => {
  try {
    const { name, userProfile, planData } = req.body;
    const stmt = db.prepare('INSERT INTO meal_plans (name, user_profile, plan_data) VALUES (?, ?, ?)');
    const result = stmt.run(name, JSON.stringify(userProfile), JSON.stringify(planData));
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all saved plans
app.get('/api/plans', (req, res) => {
  try {
    const plans = db.prepare('SELECT id, name, created_at FROM meal_plans ORDER BY created_at DESC').all();
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single plan
app.get('/api/plans/:id', (req, res) => {
  try {
    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ?').get(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }
    res.json({
      success: true,
      plan: {
        ...plan,
        user_profile: JSON.parse(plan.user_profile),
        plan_data: JSON.parse(plan.plan_data)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete plan
app.delete('/api/plans/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM meal_plans WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🍳 ChefAI Server running on http://localhost:${PORT}`);
});
