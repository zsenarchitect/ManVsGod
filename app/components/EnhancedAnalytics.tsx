'use client'

import React, { useState, useEffect } from 'react'
import { getAllStats } from '../../lib/googleSheetsClient'
import { getCombinedAnalytics, exportAllData, getGoogleFormUrl } from '../../lib/googleFormsIntegration'

export default function EnhancedAnalytics() {
  const [sheetsStats, setSheetsStats] = useState<any[]>([])
  const [combinedData, setCombinedData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [stats, analytics] = await Promise.all([
        getAllStats(),
        Promise.resolve(getCombinedAnalytics())
      ])
      
      setSheetsStats(stats)
      setCombinedData(analytics)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    exportAllData()
  }

  const openGoogleForm = () => {
    window.open(getGoogleFormUrl(), '_blank')
  }

  if (loading) {
    return (
      <div className="scenario-card">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-god-gold mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading enhanced analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="scenario-card">
      <h3 className="text-2xl font-bold mb-6 text-center text-god-gold">
        Enhanced Analytics Dashboard
      </h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-human-blue">
            {combinedData?.totalDecisions || 0}
          </div>
          <div className="text-sm text-gray-400">Google Sheets Decisions</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-collective-purple">
            {combinedData?.totalFormResponses || 0}
          </div>
          <div className="text-sm text-gray-400">Form Responses</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-god-gold">
            {combinedData?.uniquePlayers || 0}
          </div>
          <div className="text-sm text-gray-400">Unique Players</div>
        </div>
      </div>
      
      {/* Google Sheets Data */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-human-blue">
          Google Sheets Analytics
        </h4>
        <div className="space-y-4">
          {sheetsStats.map((stat) => (
            <div key={stat.scenarioId} className="border border-gray-700 rounded-lg p-4">
              <h5 className="font-medium mb-2">Scenario {stat.scenarioId}</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Choice A:</span> {stat.choiceAPercentage.toFixed(1)}% ({stat.choiceACount})
                </div>
                <div>
                  <span className="text-gray-400">Choice B:</span> {stat.choiceBPercentage.toFixed(1)}% ({stat.choiceBCount})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleExportData}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700"
        >
          Export All Data
        </button>
        
        <button
          onClick={openGoogleForm}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
        >
          Open Google Form
        </button>
        
        <button
          onClick={fetchAllData}
          className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800"
        >
          Refresh Data
        </button>
      </div>
      
      {/* Data Sources Info */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h5 className="font-semibold mb-2 text-god-gold">Data Sources</h5>
        <div className="text-sm text-gray-300 space-y-1">
          <div>• <span className="text-human-blue">Google Sheets:</span> Primary decision data with probabilities</div>
          <div>• <span className="text-collective-purple">Google Forms:</span> Additional player responses and metadata</div>
          <div>• <span className="text-god-gold">Local Storage:</span> Fallback when APIs are unavailable</div>
        </div>
      </div>
    </div>
  )
} 