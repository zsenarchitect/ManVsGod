'use client'

import React from 'react'

interface Scenario {
  id: number
  title: string
  description: string
  choiceA: string
  choiceB: string
  category: string
}

interface ScenarioCardProps {
  scenario: Scenario
  onChoice: (choice: number) => void
  probabilities: {
    choiceA: number
    choiceB: number
  }
}

export default function ScenarioCard({ scenario, onChoice, probabilities }: ScenarioCardProps) {
  return (
    <div className="scenario-card">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-god-gold">{scenario.title}</h2>
        <span className="inline-block px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
          {scenario.category}
        </span>
      </div>
      
      <div className="mb-8">
        <p className="text-lg text-gray-300 leading-relaxed text-center">
          {scenario.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onChoice(0)}
          className="choice-button bg-gradient-to-r from-human-blue to-blue-600 text-white human-glow"
        >
          <div className="text-lg font-semibold mb-2">{scenario.choiceA}</div>
          <div className="text-sm opacity-80">
            {probabilities.choiceA.toFixed(1)}% of previous players chose this
          </div>
        </button>
        
        <button
          onClick={() => onChoice(1)}
          className="choice-button bg-gradient-to-r from-collective-purple to-purple-600 text-white collective-glow"
        >
          <div className="text-lg font-semibold mb-2">{scenario.choiceB}</div>
          <div className="text-sm opacity-80">
            {probabilities.choiceB.toFixed(1)}% of previous players chose this
          </div>
        </button>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Your choice will influence the probabilities for future players
        </p>
      </div>
    </div>
  )
} 