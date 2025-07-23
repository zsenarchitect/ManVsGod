'use client'

import React, { useState } from 'react'
import { submitDecision, getScenarioStats } from '../../lib/googleSheetsClient'

export default function GoogleSheetsTest() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing connection...')

    try {
      // Test submitting a decision
      const testDecision = {
        timestamp: new Date().toISOString(),
        scenarioId: 1,
        choice: 0,
        probabilities: { choiceA: 50, choiceB: 50 }
      }

      await submitDecision(testDecision)
      setStatus('✅ Connection successful! Test data submitted to Google Sheets.')
      
      // Test reading stats
      const stats = await getScenarioStats(1)
      setStatus(prev => prev + ` Stats loaded: ${stats.totalPlayers} total players.`)
      
    } catch (error) {
      console.error('Test failed:', error)
      setStatus('❌ Connection failed. Check console for details. Using local storage fallback.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="scenario-card">
      <h3 className="text-xl font-bold mb-4 text-center text-god-gold">
        Google Sheets Connection Test
      </h3>
      
      <div className="text-center space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        {status && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">{status}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Sheet ID: 1ZeI8pE_6ZELuntLxhaYk2dhKLx0ZRUtH2bG-8xMF0PE
        </div>
      </div>
    </div>
  )
} 