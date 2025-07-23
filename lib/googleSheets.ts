import { google } from 'googleapis'

// Initialize Google Sheets API
const sheets = google.sheets('v4')

// You'll need to set these environment variables
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID

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

export async function submitDecision(decision: PlayerDecision): Promise<void> {
  if (!API_KEY || !SPREADSHEET_ID) {
    throw new Error('Google Sheets API credentials not configured')
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

    await sheets.spreadsheets.values.append({
      auth: API_KEY,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Decisions!A:E',
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    })
  } catch (error) {
    console.error('Error submitting decision to Google Sheets:', error)
    throw error
  }
}

export async function getScenarioStats(scenarioId: number): Promise<ScenarioStats> {
  if (!API_KEY || !SPREADSHEET_ID) {
    throw new Error('Google Sheets API credentials not configured')
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      auth: API_KEY,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Decisions!A:E'
    })

    const rows = response.data.values || []
    const scenarioDecisions = rows.filter(row => parseInt(row[1]) === scenarioId)

    const totalPlayers = scenarioDecisions.length
    const choiceACount = scenarioDecisions.filter(row => parseInt(row[2]) === 0).length
    const choiceBCount = scenarioDecisions.filter(row => parseInt(row[2]) === 1).length

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
  if (!API_KEY || !SPREADSHEET_ID) {
    throw new Error('Google Sheets API credentials not configured')
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      auth: API_KEY,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Decisions!A:E'
    })

    const rows = response.data.values || []
    const scenarioIds = [...new Set(rows.map(row => parseInt(row[1])))]

    const stats = await Promise.all(
      scenarioIds.map(id => getScenarioStats(id))
    )

    return stats
  } catch (error) {
    console.error('Error fetching all stats from Google Sheets:', error)
    return []
  }
} 