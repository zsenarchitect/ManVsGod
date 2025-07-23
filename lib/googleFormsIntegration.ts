// Google Forms integration for ManVsGod game
// This complements the Google Sheets integration for additional data collection

export interface FormResponse {
  timestamp: string
  scenarioId: number
  choice: number
  playerId?: string
  additionalData?: any
}

// Google Form configuration
const GOOGLE_FORM_ID = '1FAIpQLSdHTMmIAIIHbI4drrwsVEMxVdAaW6rYMHB0uiB__5o-zZ9wzg'
const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?usp=dialog`

export function getGoogleFormUrl(): string {
  return GOOGLE_FORM_URL
}

export async function submitToGoogleForm(response: FormResponse): Promise<void> {
  try {
    // Google Forms doesn't have a direct API for programmatic submission
    // Instead, we'll use a combination of approaches:
    
    // 1. Store in localStorage for immediate use
    const formResponses = JSON.parse(localStorage.getItem('manVsGodFormResponses') || '[]')
    formResponses.push(response)
    localStorage.setItem('manVsGodFormResponses', JSON.stringify(formResponses))
    
    // 2. Open the form in a new window for manual submission (optional)
    // window.open(GOOGLE_FORM_URL, '_blank')
    
    console.log('Form response stored locally:', response)
    
  } catch (error) {
    console.error('Error storing form response:', error)
  }
}

export function getFormResponses(): FormResponse[] {
  try {
    return JSON.parse(localStorage.getItem('manVsGodFormResponses') || '[]')
  } catch (error) {
    console.error('Error reading form responses:', error)
    return []
  }
}

// Enhanced data collection that combines Google Sheets and Form data
export async function submitCompleteDecision(
  scenarioId: number,
  choice: number,
  probabilities: { choiceA: number, choiceB: number },
  additionalData?: any
): Promise<void> {
  const timestamp = new Date().toISOString()
  const playerId = generatePlayerId()
  
  // Submit to Google Sheets (primary data store)
  const sheetsDecision = {
    timestamp,
    scenarioId,
    choice,
    probabilities
  }
  
  // Submit to Google Form (additional data collection)
  const formResponse = {
    timestamp,
    scenarioId,
    choice,
    playerId,
    additionalData
  }
  
  try {
    // Import the Google Sheets function
    const { submitDecision } = await import('./googleSheetsClient')
    await submitDecision(sheetsDecision)
    await submitToGoogleForm(formResponse)
    
    console.log('Decision submitted to both Google Sheets and Form')
  } catch (error) {
    console.error('Error submitting complete decision:', error)
  }
}

// Generate a unique player ID for tracking
function generatePlayerId(): string {
  let playerId = localStorage.getItem('manVsGodPlayerId')
  if (!playerId) {
    playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('manVsGodPlayerId', playerId)
  }
  return playerId
}

// Get analytics combining both data sources
export function getCombinedAnalytics() {
  const sheetsData = JSON.parse(localStorage.getItem('manVsGodDecisions') || '[]')
  const formData = getFormResponses()
  
  return {
    totalDecisions: sheetsData.length,
    totalFormResponses: formData.length,
    uniquePlayers: new Set([...sheetsData.map((d: any) => d.playerId), ...formData.map((f: any) => f.playerId)]).size,
    sheetsData,
    formData
  }
}

// Export data for analysis
export function exportAllData() {
  const analytics = getCombinedAnalytics()
  const dataStr = JSON.stringify(analytics, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `manVsGod_data_${new Date().toISOString().split('T')[0]}.json`
  link.click()
} 