// Client-side Google Sheets integration for GitHub Pages
// This uses Google Sheets as a simple database via direct API calls

export interface PlayerDecision {
  timestamp: string
  scenarioId: number
  choice: number
  probabilities: {
    choiceA: number
    choiceB: number
  }
}

export interface ScenarioStats {
  scenarioId: number
  totalPlayers: number
  choiceACount: number
  choiceBCount: number
  choiceAPercentage: number
  choiceBPercentage: number
}

// Configuration - using the user's Google Sheet
const GOOGLE_SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1ZeI8pE_6ZELuntLxhaYk2dhKLx0ZRUtH2bG-8xMF0PE'
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'your_api_key_here'

export async function submitDecision(decision: PlayerDecision): Promise<void> {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
    console.warn('Google Sheets API not configured - using local storage fallback')
    // Fallback to localStorage for demo purposes
    const decisions = JSON.parse(localStorage.getItem('manVsGodDecisions') || '[]')
    decisions.push(decision)
    localStorage.setItem('manVsGodDecisions', JSON.stringify(decisions))
    return
  }

  try {
    const values = [
      [
        decision.timestamp,
        decision.scenarioId,
        decision.choice,
        decision.probabilities.choiceA,
        decision.probabilities.choiceB
      ]
    ]

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Decisions!A:E:append?valueInputOption=RAW&key=${GOOGLE_API_KEY}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    console.log('Decision submitted successfully to Google Sheets')
  } catch (error) {
    console.error('Error submitting decision to Google Sheets:', error)
    // Fallback to localStorage
    const decisions = JSON.parse(localStorage.getItem('manVsGodDecisions') || '[]')
    decisions.push(decision)
    localStorage.setItem('manVsGodDecisions', JSON.stringify(decisions))
  }
}

export async function getScenarioStats(scenarioId: number): Promise<ScenarioStats> {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
    console.warn('Google Sheets API not configured - using local storage fallback')
    // Fallback to localStorage
    const decisions = JSON.parse(localStorage.getItem('manVsGodDecisions') || '[]')
    const scenarioDecisions = decisions.filter((d: PlayerDecision) => d.scenarioId === scenarioId)
    
    const totalPlayers = scenarioDecisions.length
    const choiceACount = scenarioDecisions.filter((d: PlayerDecision) => d.choice === 0).length
    const choiceBCount = scenarioDecisions.filter((d: PlayerDecision) => d.choice === 1).length

    return {
      scenarioId,
      totalPlayers,
      choiceACount,
      choiceBCount,
      choiceAPercentage: totalPlayers > 0 ? (choiceACount / totalPlayers) * 100 : 50,
      choiceBPercentage: totalPlayers > 0 ? (choiceBCount / totalPlayers) * 100 : 50
    }
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Decisions!A:E?key=${GOOGLE_API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const rows = data.values || []
    const scenarioDecisions = rows.filter((row: any[]) => parseInt(row[1]) === scenarioId)

    const totalPlayers = scenarioDecisions.length
    const choiceACount = scenarioDecisions.filter((row: any[]) => parseInt(row[2]) === 0).length
    const choiceBCount = scenarioDecisions.filter((row: any[]) => parseInt(row[2]) === 1).length

    return {
      scenarioId,
      totalPlayers,
      choiceACount,
      choiceBCount,
      choiceAPercentage: totalPlayers > 0 ? (choiceACount / totalPlayers) * 100 : 50,
      choiceBPercentage: totalPlayers > 0 ? (choiceBCount / totalPlayers) * 100 : 50
    }
  } catch (error) {
    console.error('Error fetching scenario stats from Google Sheets:', error)
    // Return default stats if API fails
    return {
      scenarioId,
      totalPlayers: 0,
      choiceACount: 0,
      choiceBCount: 0,
      choiceAPercentage: 50,
      choiceBPercentage: 50
    }
  }
}

export async function getAllStats(): Promise<ScenarioStats[]> {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
    console.warn('Google Sheets API not configured - using local storage fallback')
    // Fallback to localStorage
    const decisions = JSON.parse(localStorage.getItem('manVsGodDecisions') || '[]')
    const scenarioIds = [...new Set(decisions.map((d: PlayerDecision) => d.scenarioId))]
    
    const stats = await Promise.all(
      scenarioIds.map(id => getScenarioStats(id))
    )
    
    return stats
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Decisions!A:E?key=${GOOGLE_API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const rows = data.values || []
    const scenarioIds = [...new Set(rows.map((row: any[]) => parseInt(row[1])))]

    const stats = await Promise.all(
      scenarioIds.map(id => getScenarioStats(id))
    )

    return stats
  } catch (error) {
    console.error('Error fetching all stats from Google Sheets:', error)
    return []
  }
}

// Simulate dynamic probabilities based on historical data
export function calculateDynamicProbabilities(scenarioId: number, baseProb: number = 50): { choiceA: number, choiceB: number } {
  // For demo purposes, create some variation based on scenario and time
  const timeVariation = (Date.now() % 10000) / 10000 * 20 - 10 // ±10% variation
  const scenarioVariation = (scenarioId * 7) % 20 - 10 // Different variation per scenario
  
  const adjustedProb = Math.max(10, Math.min(90, baseProb + timeVariation + scenarioVariation))
  
  return {
    choiceA: adjustedProb,
    choiceB: 100 - adjustedProb
  }
} 