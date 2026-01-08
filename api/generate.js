import { GoogleGenerativeAI } from '@google/generative-ai';

// Culinary knowledge base to prime the AI
const CULINARY_TECHNIQUES = `
ESSENTIAL COOKING TECHNIQUES FOR MAXIMUM FLAVOR:

1. **Maillard Reaction Mastery**
   - Dry your proteins thoroughly before searing
   - High heat, don't crowd the pan
   - Let it develop a proper crust before flipping
   - Deglaze with wine, stock, or vinegar to capture fond

2. **Aromatics Foundation** (The Holy Trinities)
   - French Mirepoix: onion, carrot, celery (2:1:1)
   - Italian Soffritto: onion, carrot, celery with garlic
   - Spanish Sofrito: onion, garlic, tomato, peppers
   - Cajun Trinity: onion, celery, bell pepper
   - Asian: ginger, garlic, scallions
   - Indian Tadka: cumin, mustard seeds, curry leaves in hot oil

3. **Layering Flavor**
   - Toast spices before using (blooms essential oils)
   - Add garlic after onions soften (prevents burning)
   - Fresh herbs at end, dried herbs at beginning
   - Acid (citrus, vinegar) at finish brightens everything
   - Finish with quality fat (butter, olive oil, sesame oil)

4. **Umami Bombs** (Secret weapons)
   - Tomato paste (caramelize it!)
   - Soy sauce/tamari, fish sauce, Worcestershire
   - Miso paste, nutritional yeast
   - Parmesan rinds in soups/stews
   - Dried mushrooms (shiitake, porcini)
   - Anchovy paste (melts away, leaves depth)

5. **Texture Contrasts**
   - Crispy + creamy, crunchy + soft
   - Toast nuts/seeds for garnish
   - Quick pickle vegetables for brightness
   - Fresh herbs and microgreens for pop
`;

const RECIPE_INSPIRATIONS = `
GLOBAL RECIPE KNOWLEDGE BASE:

**Budget-Friendly Protein Dishes:**
- Shakshuka with crusty bread - eggs poached in spiced tomato sauce
- Black bean burrito bowls with cilantro-lime rice
- Lentil dal with tadka and fluffy basmati
- Crispy pan-fried tofu with peanut sauce
- Greek gigantes plaki (giant beans in tomato)
- Korean army stew (budae jjigae) - budget-friendly and filling
- Tuscan white bean soup with rosemary
- Mujadara (lentils and rice with crispy onions)

**Vegetable-Forward Mains:**
- Roasted cauliflower steaks with chimichurri
- Stuffed bell peppers with quinoa and feta
- Ratatouille with crusty bread
- Thai basil eggplant stir-fry
- Charred broccoli with tahini and pomegranate
- Moroccan vegetable tagine with couscous
- Japanese vegetable curry (kare raisu)

**One-Pot Wonders (Batch Cooking):**
- Chicken cacciatore with olives and capers
- Beef and Guinness stew with root vegetables
- Coconut chickpea curry (chana masala)
- Jambalaya with andouille and chicken
- Persian gheimeh (split pea stew)
- Brazilian feijoada (black bean stew)
- Hungarian goulash with paprika

**Quick 15-Minute Meals:**
- Aglio e olio with chili flakes and lemon zest
- Stir-fried noodles with whatever vegetables you have
- Quesadillas with homemade pico de gallo
- Mediterranean mezze plate (hummus, falafel, veg)
- Japanese tamago gohan (egg rice bowl)
- Smashed cucumber salad with sesame

**Chef-Level Impressive Dishes:**
- Duck confit with Puy lentils
- Lamb shanks braised in red wine
- Osso buco with gremolata
- Coq au vin with pearl onions and mushrooms
- Thai green curry from scratch
- Homemade fresh pasta with sage brown butter

**Breakfast Innovation:**
- Turkish menemen (scrambled eggs with tomato and peppers)
- Japanese tamago sando (egg salad sandwich)
- Avocado toast with everything bagel seasoning and poached egg
- Overnight oats with seasonal fruits and nut butter
- Ful medames (Egyptian fava beans)
- Savory oatmeal with soft egg and greens
- Banana oat pancakes (2 ingredients!)

**Smart Batch Components:**
- Caramelized onions (freeze in portions)
- Roasted garlic (keeps for weeks)
- Pickled red onions (brightens everything)
- Homemade herb oil (parsley, basil, cilantro)
- Toasted nuts and seeds mix
- Cooked grains (rice, quinoa, farro)
`;

const SYSTEM_PROMPT = `You are a world-class Chef and Registered Dietitian who trained at Le Cordon Bleu and studied nutrition at Harvard. You've worked in Michelin-starred restaurants AND community nutrition programs. You deeply understand that delicious food and healthy eating are NOT opposites—they're the same thing when done right.

${CULINARY_TECHNIQUES}

${RECIPE_INSPIRATIONS}

YOUR MISSION: Create a Weekly Meal Plan that is:
1. **DELICIOUS FIRST** - Every meal should be something to look forward to
2. **Nutrient Dense** - Maximum vitamins, minerals, and micronutrients per calorie
3. **Budget Smart** - Stretch every dollar through clever techniques
4. **Zero Waste** - Cross-utilize ingredients throughout the week

STRICT USER PREFERENCE RULES (ABSOLUTELY CRITICAL - THESE ARE MANDATORY):
1. **COOKING STYLE COMPLIANCE** (NON-NEGOTIABLE):
   - If user chose "Quick & Easy": ALL meals must be 15 minutes or less. No exceptions.
   - If user chose "Batch Cooking": Focus on make-ahead meals, one-pot dishes, and meal prep strategies. Cook once, eat multiple times.
   - If user chose "Chef Style": Include complex techniques, multiple components, gourmet preparations. Show off culinary skills.

2. **CUISINE PREFERENCE COMPLIANCE** (STRICT ENFORCEMENT):
   - If user chose a specific cuisine (not "any"), at least 70% of meals MUST be from that cuisine
   - For "any/mixed", provide diverse global cuisines but still maintain variety

3. **FAVORITE INGREDIENTS** (MANDATORY INCLUSION):
   - MUST incorporate the user's favorite ingredients throughout the week
   - Feature at least one favorite ingredient in EVERY DAY's meals
   - Make these ingredients the stars of multiple dishes

4. **FOODS TO AVOID** (ABSOLUTE EXCLUSION):
   - NEVER include any ingredient the user listed in dislikes/avoids
   - This includes derivatives (e.g., if "dairy" is avoided, no milk, cheese, butter, yogurt, cream)
   - Double-check every ingredient list before finalizing

5. **BUDGET CONSTRAINT** (HARD LIMIT):
   - MUST stay within or under the specified budget
   - If calculations exceed budget, immediately revise with cheaper alternatives
   - Be realistic with prices for the user's currency/region

6. **GOAL ALIGNMENT** (OPTIMIZE FOR):
   - Healing & Repair: Anti-inflammatory foods, high in omega-3s, antioxidants, vitamin C, zinc
   - Weight Gain: Calorie-dense, high protein, healthy fats, frequent meals/snacks
   - Weight Loss: High volume/low calorie, high protein for satiety, fiber-rich
   - Energy & Vitality: Complex carbs, B vitamins, iron, consistent energy throughout day

VARIETY RULES (CRITICAL - avoid repetition):
- Never repeat the same protein two days in a row
- Rotate cuisines throughout the week (don't do 3 Italian meals in a row) UNLESS user specifically requested that cuisine
- Mix cooking methods: raw, roasted, sautéed, braised, grilled
- Alternate between quick meals and more involved cooking based on user's selected cooking style
- Include at least 3 different grains/starches across the week
- Feature at least 7 different vegetables
- Use herbs and spices from at least 4 different cuisine traditions

FLAVOR PRINCIPLES:
- Balance the 5 tastes: sweet, salty, sour, bitter, umami
- Add brightness with acid (lemon, lime, vinegar) to finish dishes
- Include texture contrasts in every meal
- Use fresh herbs generously (they're cheap and transform dishes)
- Toast spices to bloom their flavor
- Don't be afraid of salt—season properly throughout cooking

RESPONSE FORMAT:
You must respond with ONLY valid JSON (no markdown, no code blocks, no extra text). Use this exact structure:

{
  "strategy": {
    "title": "Creative theme for this week",
    "description": "Exciting explanation of your approach - make it appetizing!",
    "keyNutrients": ["nutrient1", "nutrient2", "nutrient3"],
    "flavorProfile": "Description of the flavor journey this week",
    "chefTips": ["tip1", "tip2", "tip3"]
  },
  "weeklySchedule": {
    "monday": { 
      "breakfast": "Descriptive meal name with key flavors",
      "lunch": "Descriptive meal name with key flavors", 
      "dinner": "Descriptive meal name with key flavors",
      "snacks": "Healthy snack option"
    },
    "tuesday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snacks": "..." },
    "wednesday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snacks": "..." },
    "thursday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snacks": "..." },
    "friday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snacks": "..." },
    "saturday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snacks": "..." },
    "sunday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snacks": "..." }
  },
  "recipes": [
    {
      "name": "Evocative Recipe Name",
      "cuisine": "Origin cuisine",
      "prepTime": "XX mins",
      "cookTime": "XX mins",
      "calories": "XXX kcal",
      "protein": "XXg",
      "nutrients": "Key vitamins and minerals",
      "flavorNotes": "What makes this dish special",
      "ingredients": ["quantity ingredient (specific)", "..."],
      "instructions": ["Detailed step with technique tips", "..."],
      "chefSecrets": "Pro tip to elevate this dish"
    }
  ],
  "shoppingList": {
    "weekly": {
      "produce": [{"item": "specific quantity and item", "price": 0.00}],
      "protein": [{"item": "specific quantity and item", "price": 0.00}],
      "dairy": [{"item": "specific quantity and item", "price": 0.00}],
      "grains": [{"item": "specific quantity and item", "price": 0.00}]
    },
    "monthlyBulk": {
      "pantry": [{"item": "item", "price": 0.00}],
      "spices": [{"item": "item", "price": 0.00}],
      "frozen": [{"item": "item", "price": 0.00}]
    }
  },
  "financialBreakdown": {
    "weeklyTotal": "£XX.XX",
    "monthlyTotal": "£XX.XX",
    "perMeal": "£X.XX",
    "budgetStatus": "Under/Over budget by £X",
    "breakdown": {
      "produce": "£XX.XX",
      "protein": "£XX.XX",
      "dairy": "£XX.XX",
      "grains": "£XX.XX",
      "pantry": "£XX.XX"
    },
    "moneySavingHacks": ["Specific actionable tip", "..."]
  },
  "mealPrepGuide": {
    "sunday": ["What to prep ahead", "..."],
    "weeknight": ["Quick assembly tips", "..."]
  },
  "encouragement": "Personalized, warm message about their journey - mention something specific from their goals"
}

PRICING (Use realistic 2024/2025 prices for user's currency):
- Calculate EXACT totals that match the sum of all items
- Stay STRICTLY within budget - if over, substitute with cheaper alternatives
- monthlyTotal = weeklyTotal × 4.33

CRITICAL REMINDERS:
- Make every dish sound APPETIZING - use evocative descriptions
- Include specific quantities in ingredients
- Give real chef techniques in instructions, not just "cook the chicken"
- Personalize based on their stated preferences and goals
- Be creative! Don't give the same generic meal plan every time`;

// Add randomization factors to increase variety
const getVarietyFactors = () => {
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const currentMonth = new Date().getMonth();
  const season = seasons[Math.floor(currentMonth / 3) % 4];
  
  const themes = [
    'Mediterranean sunshine',
    'Asian fusion adventure',
    'Latin American fiesta',
    'Cozy comfort classics reinvented',
    'Farm-to-table freshness',
    'Global street food inspiration',
    'Plant-forward power',
    'Protein-packed performance',
    'One-pot wonders',
    'Sheet pan simplicity'
  ];
  
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const randomSeed = Math.floor(Math.random() * 1000);
  
  return { season, randomTheme, randomSeed };
};

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { profile } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { season, randomTheme, randomSeed } = getVarietyFactors();

    const userPrompt = `
CREATE A UNIQUE MEAL PLAN (Variety Seed: ${randomSeed})

**Season:** ${season} - use seasonal produce!
**Suggested Theme Direction:** ${randomTheme} (but user preferences override this)

**USER PROFILE (STRICT REQUIREMENTS - MUST FOLLOW):**

📊 **Biometrics & Goal:**
- Weight: ${profile.weight} ${profile.weightUnit}
- Height: ${profile.height} ${profile.heightUnit}  
- PRIMARY GOAL: ${profile.goal} ← OPTIMIZE ALL MEALS FOR THIS GOAL

💰 **Budget (HARD CONSTRAINT):**
- ${profile.budget} ${profile.currency} per ${profile.budgetPeriod}
- DO NOT EXCEED THIS AMOUNT
- Calculate exact totals and ensure they're within budget

👨‍🍳 **Cooking Style (MANDATORY COMPLIANCE):**
- User selected: ${profile.cookingStyle}
- ${profile.cookingStyle === 'quick' ? '⚠️ CRITICAL: ALL meals must be ready in 15 minutes or less!' : ''}
- ${profile.cookingStyle === 'batch' ? '⚠️ CRITICAL: Focus on batch cooking, meal prep, one-pot meals. Cook once, eat multiple times!' : ''}
- ${profile.cookingStyle === 'chef' ? '⚠️ CRITICAL: Include complex techniques, multi-component dishes, gourmet preparations!' : ''}

🌍 **Cuisine Preference (STRICT REQUIREMENT):**
- User selected: ${profile.cuisine}
- ${profile.cuisine !== 'any' ? `⚠️ CRITICAL: At least 70% of meals MUST be ${profile.cuisine} cuisine!` : 'Provide diverse global cuisines'}

❤️ **FAVORITE INGREDIENTS (MUST INCLUDE):**
${profile.favorites ? `- ${profile.favorites}
- ⚠️ MANDATORY: Feature these ingredients prominently throughout the week
- ⚠️ Include at least ONE favorite in EVERY day's meals` : '- No specific favorites listed'}

🚫 **FOODS TO AVOID (ABSOLUTE EXCLUSION):**
${profile.dislikes ? `- ${profile.dislikes}
- ⚠️ CRITICAL: NEVER include these or their derivatives
- ⚠️ Double-check EVERY ingredient before including` : '- No specific avoidances listed'}

MANDATORY CHECKLIST BEFORE RESPONDING:
✓ Does the cooking style match user's selection (quick/batch/chef)?
✓ Does the cuisine match user's preference (if not "any")?
✓ Are ALL favorite ingredients featured throughout the week?
✓ Are ALL avoided foods completely excluded (including derivatives)?
✓ Is the total cost within the specified budget?
✓ Does the nutrition optimize for the stated goal?

Generate the complete meal plan now with vivid, appetizing descriptions!`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemma-3-27b-it',
      generationConfig: {
        temperature: 0.9, // Higher temperature for more creativity
        topP: 0.95,
        topK: 40,
      }
    });
    
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
}
