import { NextRequest, NextResponse } from 'next/server'
import { getScenarioStats, getAllStats } from '../../../lib/googleSheets'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const scenarioId = searchParams.get('scenarioId')

    if (scenarioId) {
      const stats = await getScenarioStats(parseInt(scenarioId))
      return NextResponse.json(stats)
    } else {
      const allStats = await getAllStats()
      return NextResponse.json(allStats)
    }
  } catch (error) {
    console.error('Error in get-stats API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 