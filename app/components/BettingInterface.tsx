'use client'

import React, { useState } from 'react'
import { logError, logWarn, logInfo, logDebug, ErrorCategories } from '../../lib/errorHandler'

interface BettingInterfaceProps {
  currentCurrency: number
  moveCost: number
  disobediencePenalty: number
  onBetPlaced: (bet: number) => void
  onMoveConfirmed: (move: string, bet: number) => void
  selectedMove?: string
  godMove?: {
    suggestedMove: string
    confidence: number
    reasoning: string
  }
  showGodMove: boolean
}

export default function BettingInterface({
  currentCurrency,
  moveCost,
  disobediencePenalty,
  onBetPlaced,
  onMoveConfirmed,
  selectedMove,
  godMove,
  showGodMove
}: BettingInterfaceProps) {
  const [playerBet, setPlayerBet] = useState(0)
  const [betStep, setBetStep] = useState(10)

  const handleBetChange = (newBet: number) => {
    try {
      logInfo('Bet changed', ErrorCategories.BETTING, { oldBet: playerBet, newBet, currentCurrency })
      
      if (newBet < 0) {
        logWarn('Negative bet attempted', ErrorCategories.BETTING, { newBet })
        newBet = 0
      }
      
      if (newBet > currentCurrency) {
        logWarn('Bet exceeds current currency', ErrorCategories.BETTING, { newBet, currentCurrency })
        newBet = currentCurrency
      }
      
      const clampedBet = Math.max(0, Math.min(currentCurrency, newBet))
      setPlayerBet(clampedBet)
      onBetPlaced(clampedBet)
      
      logDebug('Bet updated successfully', ErrorCategories.BETTING, { clampedBet })
    } catch (error) {
      logError('Failed to change bet', ErrorCategories.BETTING, { error, newBet, currentCurrency })
    }
  }

  const handleBetStep = (step: number) => {
    try {
      logInfo('Bet step applied', ErrorCategories.BETTING, { step, currentBet: playerBet })
      handleBetChange(playerBet + step)
    } catch (error) {
      logError('Failed to apply bet step', ErrorCategories.BETTING, { error, step, playerBet })
    }
  }

  const canDisobey = () => {
    try {
      if (!godMove) {
        logDebug('No God move available for disobedience check', ErrorCategories.BETTING)
        return false
      }
      
      const canDisobeyResult = playerBet >= godMove.confidence
      logDebug('Disobedience check', ErrorCategories.BETTING, { 
        playerBet, godConfidence: godMove.confidence, canDisobey: canDisobeyResult 
      })
      return canDisobeyResult
    } catch (error) {
      logError('Failed to check disobedience', ErrorCategories.BETTING, { error, playerBet, godMove })
      return false
    }
  }

  const getDisobedienceCost = () => {
    try {
      if (!godMove) {
        logDebug('No God move available for disobedience cost calculation', ErrorCategories.BETTING)
        return 0
      }
      
      const cost = playerBet < godMove.confidence ? disobediencePenalty : 0
      logDebug('Disobedience cost calculated', ErrorCategories.BETTING, { 
        playerBet, godConfidence: godMove.confidence, disobediencePenalty, cost 
      })
      return cost
    } catch (error) {
      logError('Failed to calculate disobedience cost', ErrorCategories.BETTING, { error, playerBet, godMove, disobediencePenalty })
      return 0
    }
  }

  const totalCost = moveCost + getDisobedienceCost()
  const canAfford = currentCurrency >= totalCost

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-god-gold mb-2">Betting Interface</h3>
        <div className="text-sm text-gray-400">
          Bet your currency to express confidence in your move
        </div>
      </div>

      {/* Current Currency */}
      <div className="text-center">
        <div className="text-3xl font-bold text-human-blue">{currentCurrency}</div>
        <div className="text-sm text-gray-400">Available Currency</div>
      </div>

      {/* Move Selection */}
      {selectedMove && (
        <div className="text-center p-4 bg-gray-700 rounded-lg">
          <div className="text-lg font-semibold text-collective-purple">
            Selected Move: {selectedMove}
          </div>
          <div className="text-sm text-gray-400">
            Move Cost: {moveCost} currency
          </div>
        </div>
      )}

      {/* Betting Controls */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-god-gold">{playerBet}</div>
          <div className="text-sm text-gray-400">Your Bet</div>
        </div>

        {/* Bet Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={currentCurrency}
            value={playerBet}
            onChange={(e) => handleBetChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>{Math.floor(currentCurrency / 2)}</span>
            <span>{currentCurrency}</span>
          </div>
        </div>

        {/* Quick Bet Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleBetStep(-betStep)}
            disabled={playerBet === 0}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -{betStep}
          </button>
          <button
            onClick={() => handleBetStep(betStep)}
            disabled={playerBet === currentCurrency}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +{betStep}
          </button>
          <button
            onClick={() => handleBetChange(currentCurrency)}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            All In
          </button>
        </div>

        {/* Bet Step Adjuster */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-400">Bet Step:</span>
          <select
            value={betStep}
            onChange={(e) => setBetStep(parseInt(e.target.value))}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* God's Move Display */}
      {showGodMove && godMove && (
        <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-500">
          <div className="text-center mb-3">
            <div className="text-lg font-bold text-god-gold">God's Suggestion</div>
            <div className="text-2xl font-bold text-collective-purple">
              {godMove.suggestedMove}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">God's Confidence:</span>
              <span className="text-yellow-400 font-bold">{godMove.confidence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Your Bet:</span>
              <span className="text-human-blue font-bold">{playerBet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Can Disobey:</span>
              <span className={`font-bold ${canDisobey() ? 'text-green-400' : 'text-red-400'}`}>
                {canDisobey() ? 'YES' : 'NO'}
              </span>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {godMove.reasoning}
            </div>
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="bg-gray-700 p-4 rounded-lg space-y-2">
        <div className="text-center font-semibold text-gray-300 mb-3">Cost Breakdown</div>
        <div className="flex justify-between">
          <span className="text-gray-400">Move Cost:</span>
          <span className="text-white">{moveCost}</span>
        </div>
        {showGodMove && godMove && (
          <div className="flex justify-between">
            <span className="text-gray-400">Disobedience Penalty:</span>
            <span className="text-red-400">{getDisobedienceCost()}</span>
          </div>
        )}
        <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
          <span className="text-gray-300">Total Cost:</span>
          <span className={`${canAfford ? 'text-green-400' : 'text-red-400'}`}>
            {totalCost}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Remaining:</span>
          <span className={`font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
            {currentCurrency - totalCost}
          </span>
        </div>
      </div>

      {/* Confirm Move Button */}
      {selectedMove && (
        <button
          onClick={() => onMoveConfirmed(selectedMove, playerBet)}
          disabled={!canAfford}
          className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all ${
            canAfford
              ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canAfford ? 'Confirm Move' : 'Insufficient Currency'}
        </button>
      )}
    </div>
  )
} 