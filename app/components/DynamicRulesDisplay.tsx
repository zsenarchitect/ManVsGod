'use client'

import { useState, useEffect } from 'react'
import { dynamicRulesEngine, DynamicRule, RuleEvolution } from '../../lib/dynamicRules'

interface DynamicRulesDisplayProps {
  className?: string
}

export default function DynamicRulesDisplay({ className = '' }: DynamicRulesDisplayProps) {
  const [rules, setRules] = useState<DynamicRule[]>([])
  const [evolutionHistory, setEvolutionHistory] = useState<RuleEvolution[]>([])
  const [playerStats, setPlayerStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'current' | 'evolution' | 'stats'>('current')

  useEffect(() => {
    // Update data every 5 seconds
    const interval = setInterval(() => {
      setRules(dynamicRulesEngine.getActiveRules())
      setEvolutionHistory(dynamicRulesEngine.getEvolutionHistory())
      setPlayerStats(dynamicRulesEngine.getPlayerStats())
    }, 5000)

    // Initial load
    setRules(dynamicRulesEngine.getActiveRules())
    setEvolutionHistory(dynamicRulesEngine.getEvolutionHistory())
    setPlayerStats(dynamicRulesEngine.getPlayerStats())

    return () => clearInterval(interval)
  }, [])

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'betting': return 'bg-blue-500'
      case 'moral': return 'bg-green-500'
      case 'authority': return 'bg-purple-500'
      case 'scoring': return 'bg-orange-500'
      case 'piece': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getMutationTypeColor = (type: string) => {
    switch (type) {
      case 'addition': return 'bg-green-100 text-green-800'
      case 'modification': return 'bg-blue-100 text-blue-800'
      case 'removal': return 'bg-red-100 text-red-800'
      case 'recombination': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatValue = (value: any, type: string) => {
    if (typeof value === 'number') {
      if (type === 'scoring') return `${(value * 100).toFixed(1)}%`
      if (type === 'authority') return value.toFixed(2)
      return value.toString()
    }
    return value
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🧬 Dynamic Rules System</h2>
        <div className="text-sm text-gray-600">
          Rules evolve based on player behavior
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'current'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Current Rules
        </button>
        <button
          onClick={() => setActiveTab('evolution')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'evolution'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Evolution History
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stats'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Player Stats
        </button>
      </div>

      {/* Current Rules Tab */}
      {activeTab === 'current' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRuleTypeColor(rule.type)}`}>
                    {rule.type}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-medium text-gray-900">
                      {formatValue(rule.currentValue, rule.type)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Value:</span>
                    <span className="text-gray-500">
                      {formatValue(rule.baseValue, rule.type)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Player Influence:</span>
                    <span className={`font-medium ${
                      rule.playerInfluence > 0.5 ? 'text-green-600' :
                      rule.playerInfluence < -0.5 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {rule.playerInfluence.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(0, (rule.playerInfluence / rule.mutationThreshold) * 100))}%`
                      }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Evolution threshold: {rule.mutationThreshold}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution History Tab */}
      {activeTab === 'evolution' && (
        <div className="space-y-4">
          {evolutionHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🧬</div>
              <p>No rule evolutions yet. Play the game to see rules evolve!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {evolutionHistory.slice().reverse().map((evolution, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {evolution.ruleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMutationTypeColor(evolution.mutationType)}`}>
                      {evolution.mutationType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Previous:</span>
                      <div className="font-medium">{formatValue(evolution.previousValue, evolution.ruleType)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <div className="font-medium">{formatValue(evolution.currentValue, evolution.ruleType)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Influence:</span>
                      <div className="font-medium">{evolution.playerInfluence.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Success Rate:</span>
                      <div className="font-medium">{(evolution.successRate * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(evolution.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Player Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          {playerStats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{playerStats.totalDecisions}</div>
                <div className="text-sm text-blue-800">Total Decisions</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600">${playerStats.averageBet.toFixed(0)}</div>
                <div className="text-sm text-green-800">Average Bet</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{(playerStats.followGodRate * 100).toFixed(1)}%</div>
                <div className="text-sm text-purple-800">Follow God Rate</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">{(playerStats.spareRate * 100).toFixed(1)}%</div>
                <div className="text-sm text-orange-800">Spare Rate</div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="text-2xl font-bold text-indigo-600">{playerStats.averageStrategicScore.toFixed(0)}</div>
                <div className="text-sm text-indigo-800">Avg Strategic Score</div>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <div className="text-2xl font-bold text-pink-600">{playerStats.averageMoralScore.toFixed(0)}</div>
                <div className="text-sm text-pink-800">Avg Moral Score</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No player statistics available yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Rules evolve weekly based on collective player behavior. Your choices shape the game!
        </div>
      </div>
    </div>
  )
} 