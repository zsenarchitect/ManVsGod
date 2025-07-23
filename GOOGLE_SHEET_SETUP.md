# 🔧 Complete Data Collection Setup for ManVsGod

## Your Data Collection Setup

### 📊 Google Sheets
**Sheet ID**: `1ZeI8pE_6ZELuntLxhaYk2dhKLx0ZRUtH2bG-8xMF0PE`
**URL**: https://docs.google.com/spreadsheets/d/1ZeI8pE_6ZELuntLxhaYk2dhKLx0ZRUtH2bG-8xMF0PE/edit

### 📝 Google Forms
**Form ID**: `1FAIpQLSdHTMmIAIIHbI4drrwsVEMxVdAaW6rYMHB0uiB__5o-zZ9wzg`
**URL**: https://docs.google.com/forms/d/e/1FAIpQLSdHTMmIAIIHbI4drrwsVEMxVdAaW6rYMHB0uiB__5o-zZ9wzg/viewform?usp=dialog

## 📋 Step 1: Prepare Your Google Sheet

1. **Open your Google Sheet**
2. **Create the headers** (first row):
   ```
   A1: Timestamp
   B1: ScenarioId  
   C1: Choice
   D1: ProbA
   E1: ProbB
   ```

3. **Format the headers** (make them bold and colored for clarity)

4. **Share the sheet**:
   - Click "Share" button
   - Set to "Anyone with the link can view"
   - Copy the sharing link

## 📝 Step 2: Configure Your Google Form

1. **Open your Google Form**
2. **Add questions** to collect additional data:
   - Scenario ID (number)
   - Player Choice (multiple choice)
   - Additional comments (text)
   - Player ID (text, optional)

3. **Set up form responses**:
   - Go to "Responses" tab
   - Click the green Google Sheets icon
   - Link to your existing Google Sheet (creates a new tab)

## 🔑 Step 3: Get Google API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
   - Search for "Google Forms API" (if available)
   - Click "Enable"

4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

5. **Restrict the API Key** (recommended):
   - Click on the created API key
   - Under "Application restrictions" select "HTTP referrers"
   - Add: `https://szhang.github.io/*`
   - Under "API restrictions" select "Restrict key"
   - Select "Google Sheets API"

## ⚙️ Step 4: Configure the Game

### Option A: Local Development
Create `.env.local` file in your project root:
```
NEXT_PUBLIC_GOOGLE_SHEET_ID=1ZeI8pE_6ZELuntLxhaYk2dhKLx0ZRUtH2bG-8xMF0PE
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here
```

### Option B: GitHub Pages Deployment
1. **Go to your GitHub repository**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add repository secrets**:
   - `NEXT_PUBLIC_GOOGLE_SHEET_ID`: `1ZeI8pE_6ZELuntLxhaYk2dhKLx0ZRUtH2bG-8xMF0PE`
   - `NEXT_PUBLIC_GOOGLE_API_KEY`: `your_api_key_here`

## 🧪 Step 5: Test the Integration

1. **Run the game locally**:
   ```bash
   npm run dev
   ```

2. **Make a decision** in the game

3. **Check your data sources**:
   - **Google Sheet**: Should see new row with decision data
   - **Google Form**: Can be opened manually for additional responses
   - **Local Storage**: Fallback data for offline use

## 📊 Expected Data Format

### Google Sheets Data:
| Timestamp | ScenarioId | Choice | ProbA | ProbB |
|-----------|------------|--------|-------|-------|
| 2024-01-15T10:30:00.000Z | 1 | 0 | 45.2 | 54.8 |
| 2024-01-15T10:35:00.000Z | 1 | 1 | 43.1 | 56.9 |

### Google Forms Data:
- Additional player responses
- Comments and feedback
- Player identification
- Extended metadata

## 🔍 Troubleshooting

### "API Key not valid" Error
- Check if the API key is correct
- Ensure Google Sheets API is enabled
- Verify API key restrictions allow your domain

### "Permission denied" Error
- Make sure the sheet is shared with "Anyone with link can view"
- Check if the sheet ID is correct

### No data appearing
- Check browser console for errors
- Verify the sheet has the correct headers
- Ensure the API key has proper permissions

### Google Forms not working
- Google Forms doesn't have a direct API for programmatic submission
- The form is used for manual additional data collection
- All game decisions are stored in Google Sheets automatically

## 🎯 What Happens Next

Once configured:
1. **Every player decision** gets recorded in your Google Sheet automatically
2. **Google Form** can be used for additional data collection
3. **Real-time probabilities** are calculated from collective data
4. **Analytics dashboard** shows live collective patterns
5. **The "God" learns** from all previous players

## 📈 Enhanced Analytics Features

With both data sources connected:
- **Live player count** per scenario
- **Choice distribution** percentages
- **Collective trend analysis**
- **Real-time probability evolution**
- **Player feedback and comments**
- **Data export functionality**

## 🔄 Data Flow

```
Player makes decision
    ↓
Game submits to Google Sheets (automatic)
    ↓
Game stores in local storage (fallback)
    ↓
Player can optionally fill Google Form (manual)
    ↓
Analytics dashboard combines all data sources
```

Your game now has a comprehensive data collection system that captures both automatic decision data and optional player feedback! 🎮✨ 