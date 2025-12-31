# ChefAI 🍳

**High Nutrient Density Meal Planning on a Budget**

ChefAI is a beautiful fullstack application that creates personalized weekly meal plans using Google's Gemini AI. It focuses on maximizing nutrition while respecting your budget and preferences.

![ChefAI Screenshot](./screenshot.png)

## Features

- 🥗 **Personalized Meal Plans** - Tailored to your biometrics, goals, and preferences
- 💰 **Budget-Conscious** - Stays within your weekly/monthly food budget
- ♻️ **Zero Food Waste** - Smart cross-utilization of ingredients
- 📅 **Weekly Schedules** - Complete Mon-Sun breakfast, lunch, dinner, snacks
- 📖 **Detailed Recipes** - Step-by-step instructions with nutrients info
- 🛒 **Shopping Lists** - Organized by store aisle
- 💾 **Save & Manage Plans** - Store multiple plans for easy access

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js
- **Database**: SQLite (better-sqlite3)
- **AI**: Google Gemini API

## Quick Start

### 1. Get a Gemini API Key

Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Install Dependencies

```bash
cd ChefAI
npm run install-all
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 4. Run the Application

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173).

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Create New Plan** - Answer 5 quick questions about your biometrics, budget, food preferences, cooking style, and cuisine
2. **View Your Plan** - See your personalized weekly schedule, recipes, shopping list, and budget breakdown
3. **Save Plans** - Save plans with custom names for future reference
4. **Manage Saved Plans** - View, load, or delete previously saved plans

## Project Structure

```
ChefAI/
├── server/
│   └── index.js          # Express API + Gemini integration
├── client/
│   ├── src/
│   │   ├── App.jsx       # Main app component
│   │   ├── components/
│   │   │   ├── InterviewForm.jsx    # Multi-step form
│   │   │   ├── MealPlanDisplay.jsx  # Plan visualization
│   │   │   ├── LoadingScreen.jsx    # Loading animation
│   │   │   └── SavedPlans.jsx       # Saved plans list
│   │   └── index.css     # Tailwind + custom styles
│   └── ...
├── package.json
└── README.md
```

## License

MIT
