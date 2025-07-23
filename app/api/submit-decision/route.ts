import { NextRequest, NextResponse } from 'next/server'
import { submitDecision, PlayerDecision } from '../../../lib/googleSheets'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const decision: PlayerDecision = body

    await submitDecision(decision)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in submit-decision API:', error)
    return NextResponse.json(
      { error: 'Failed to submit decision' },
      { status: 500 }
    )
  }
} 