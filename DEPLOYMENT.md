# 🚀 GitHub Pages Deployment Guide

## Quick Start (5 minutes)

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/) (LTS version)

### 2. Clone and Setup
```bash
git clone https://github.com/yourusername/ManVsGod.git
cd ManVsGod
npm install
```

### 3. Test Locally
```bash
npm run dev
```
Visit: http://localhost:3000

### 4. Deploy to GitHub Pages
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### 5. Enable GitHub Pages
- Go to your repository on GitHub
- Settings → Pages
- Source: "GitHub Actions"
- Save

Your game will be live at: `https://yourusername.github.io/ManVsGod`

## 🎮 Game Features

### ✅ Ready to Play
- **3 Scenarios**: Trolley Problem, Lifeboat Dilemma, Chess Perspective
- **Dynamic Probabilities**: Changes based on collective decisions
- **Beautiful UI**: Dark theme with glowing effects
- **Responsive Design**: Works on all devices
- **Local Storage**: Works without Google Sheets

### 🔧 Optional: Google Sheets Integration
For full collective data storage:

1. **Create Google Sheet**:
   - Headers: `Timestamp | ScenarioId | Choice | ProbA | ProbB`
   - Share: "Anyone with link can view"

2. **Get API Key**:
   - [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Sheets API
   - Create API Key

3. **Add to GitHub Secrets**:
   - Repository → Settings → Secrets → Actions
   - Add: `NEXT_PUBLIC_GOOGLE_SHEET_ID`
   - Add: `NEXT_PUBLIC_GOOGLE_API_KEY`

## 📁 Project Structure

```
ManVsGod/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── globals.css         # Styling
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main game page
├── lib/                    # Utilities
│   └── googleSheetsClient.ts # Google Sheets integration
├── .github/workflows/      # GitHub Actions
├── package.json            # Dependencies
└── next.config.js          # Next.js config
```

## 🛠️ Customization

### Add New Scenarios
Edit `app/page.tsx`:
```javascript
{
  id: 4,
  title: "Your Scenario",
  description: "Description...",
  choiceA: "Option A",
  choiceB: "Option B",
  category: "category"
}
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'god-gold': '#FFD700',
  'human-blue': '#4A90E2',
  'collective-purple': '#9B59B6',
}
```

### Add Animations
Edit `app/globals.css`:
```css
@keyframes yourAnimation {
  /* Your animation */
}
```

## 🔍 Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Run `npm install` again
- Check GitHub Actions logs

### 404 on GitHub Pages
- Verify repository name matches package.json homepage
- Check GitHub Pages settings
- Ensure .nojekyll file exists

### Google Sheets Not Working
- Check API key permissions
- Verify sheet sharing settings
- Game works without Google Sheets (local storage)

## 📊 Analytics

### With Google Sheets
- Real-time collective data
- Cross-device persistence
- Live analytics dashboard

### Without Google Sheets
- Local storage fallback
- Simulated probabilities
- Demo analytics

## 🎯 Next Steps

1. **Customize Scenarios**: Add your own moral dilemmas
2. **Add Google Sheets**: For real collective data
3. **Share the Game**: Let others play and contribute
4. **Analyze Results**: See how collective decisions evolve

## 🌟 Features Highlight

- **Individual vs Collective**: Battle against collective memory
- **Dynamic Probabilities**: Real-time probability shifts
- **Perspective Shifts**: Experience different viewpoints
- **Social Experiment**: See how humanity thinks collectively
- **Chess Integration**: Original concept preserved

Your "Man vs God" game is ready to challenge players with moral dilemmas while battling against the collective wisdom of all previous players! 🎮✨ 