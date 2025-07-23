'use client'

import React from 'react'

interface ProbabilityDisplayProps {
  probabilities: {
    choiceA: number
    choiceB: number
  }
}

export default function ProbabilityDisplay({ probabilities }: ProbabilityDisplayProps) {
  return (
    <div className="scenario-card">
      <h3 className="text-xl font-semibold mb-4 text-center text-god-gold">
        The God's Current Probabilities
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-human-blue mb-2">
            {probabilities.choiceA.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Choice A</div>
          <div className="mt-2 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-human-blue h-2 rounded-full transition-all duration-1000"
              style={{ width: `${probabilities.choiceA}%` }}
            ></div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-collective-purple mb-2">
            {probabilities.choiceB.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Choice B</div>
          <div className="mt-2 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-collective-purple h-2 rounded-full transition-all duration-1000"
              style={{ width: `${probabilities.choiceB}%` }}
            ></div>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-4">
        These probabilities are shaped by the collective decisions of all previous players
      </p>
    </div>
  )
} 