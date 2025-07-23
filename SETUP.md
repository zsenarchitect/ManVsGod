# Man vs God - Setup Guide for GitHub Pages

## Prerequisites
- Node.js 18+ installed
- GitHub account
- Google Cloud Console account (optional, for Google Sheets integration)
- Google Sheets API enabled (optional)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google Sheets API (Optional):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Sheets API
   - Create credentials (API Key)
   - Copy the API key

3. **Create Google Sheet (Optional):**
   - Create a new Google Sheet
   - Add headers in the first row: `Timestamp | ScenarioId | Choice | ProbA | ProbB`
   - Share the sheet with "Anyone with the link can view"
   - Copy the Sheet ID from the URL

4. **Configure environment (Optional):**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` and add your API credentials:
   ```
   NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here
   NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open the game:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Set up GitHub Pages:**
   - Go to your repository on GitHub
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

3. **Add Repository Secrets (Optional):**
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `NEXT_PUBLIC_GOOGLE_SHEET_ID`: Your Google Sheet ID
     - `NEXT_PUBLIC_GOOGLE_API_KEY`: Your Google API Key

4. **Deploy:**
   - The GitHub Action will automatically build and deploy on every push to main
   - Your game will be available at: `https://yourusername.github.io/ManVsGod`

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select "gh-pages" branch
   - Save

## Google Sheets Structure

The game expects a Google Sheet with the following structure:

| Timestamp | ScenarioId | Choice | ProbA | ProbB |
|-----------|------------|--------|-------|-------|
| 2024-01-01T10:00:00Z | 1 | 0 | 50.0 | 50.0 |
| 2024-01-01T10:05:00Z | 1 | 1 | 45.0 | 55.0 |

- **Timestamp**: When the decision was made
- **ScenarioId**: Which scenario the player faced (1, 2, 3, etc.)
- **Choice**: Player's choice (0 for Choice A, 1 for Choice B)
- **ProbA**: Probability of Choice A when player made decision
- **ProbB**: Probability of Choice B when player made decision

## Game Mechanics

1. **Dynamic Probabilities**: Each player sees probabilities based on previous decisions
2. **Collective Memory**: The "God" learns from all player choices
3. **Perspective Shifts**: Players experience both individual and collective viewpoints
4. **Real-time Updates**: Probabilities update as more players participate
5. **Local Storage Fallback**: If Google Sheets is not configured, data is stored locally

## Adding New Scenarios

To add new scenarios, edit the `scenarios` array in `app/page.tsx`:

```javascript
{
  id: 4,
  title: "New Scenario Title",
  description: "Scenario description...",
  choiceA: "First choice option",
  choiceB: "Second choice option",
  category: "category-name"
}
```

## Troubleshooting

### GitHub Pages Issues
- **404 Errors**: Make sure the repository name matches the homepage URL in package.json
- **Build Failures**: Check the GitHub Actions logs for errors
- **Missing Environment Variables**: Add them as repository secrets

### Google Sheets Issues
- **API Errors**: Check your Google Sheets API key and permissions
- **Sheet Access**: Ensure the Google Sheet is shared with appropriate permissions
- **CORS Errors**: The client-side integration should handle this automatically

### Local Development Issues
- **Port Conflicts**: Change the port in package.json scripts if needed
- **Build Errors**: Make sure all dependencies are installed
- **TypeScript Errors**: These are expected during development and won't affect the build

## Features

### With Google Sheets (Full Experience)
- Real-time collective data storage
- Cross-device data persistence
- Analytics dashboard with live data
- Dynamic probability calculations

### Without Google Sheets (Demo Mode)
- Local storage fallback
- Simulated probability changes
- Demo analytics
- Full game functionality

## Customization

- **Styling**: Edit `app/globals.css` and `tailwind.config.js`
- **Scenarios**: Modify the scenarios array in `app/page.tsx`
- **Colors**: Update the color scheme in `tailwind.config.js`
- **Animations**: Add custom animations in `app/globals.css` 