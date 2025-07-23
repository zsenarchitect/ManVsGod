'use client'

import React, { useState, useEffect } from 'react'
import { getAllStats } from '../../lib/googleSheetsClient'

interface ScenarioStats {
  scenarioId: number
  totalPlayers: number
  choiceACount: number
  choiceBCount: number
  choiceAPercentage: number
  choiceBPercentage: number
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<ScenarioStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await getAllStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="scenario-card">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-god-gold mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading collective data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="scenario-card">
      <h3 className="text-2xl font-bold mb-6 text-center text-god-gold">
        Collective Memory Analytics
      </h3>
      
      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.scenarioId} className="border border-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-3 text-human-blue">
              Scenario {stat.scenarioId}
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-human-blue">
                  {stat.choiceAPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Choice A</div>
                <div className="text-xs text-gray-500">
                  {stat.choiceACount} players
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-collective-purple">
                  {stat.choiceBPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Choice B</div>
                <div className="text-xs text-gray-500">
                  {stat.choiceBCount} players
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Total Players: {stat.totalPlayers}</span>
                <span>Consensus: {Math.abs(stat.choiceAPercentage - 50).toFixed(1)}%</span>
              </div>
              
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-human-blue to-collective-purple h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(stat.choiceAPercentage, stat.choiceBPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  )
} 