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

interface CollectiveMemoryProps {
  playerChoice: number | null
  scenario: Scenario
  probabilities: {
    choiceA: number
    choiceB: number
  }
}

export default function CollectiveMemory({ playerChoice, scenario, probabilities }: CollectiveMemoryProps) {
  const choiceText = playerChoice === 0 ? scenario.choiceA : scenario.choiceB
  const choiceColor = playerChoice === 0 ? 'human-blue' : 'collective-purple'
  const isPopularChoice = playerChoice === 0 ? probabilities.choiceA > 50 : probabilities.choiceB > 50

  return (
    <div className="scenario-card">
      <h3 className="text-2xl font-bold mb-6 text-center text-god-gold">
        Your Choice & The Collective Memory
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-4 text-human-blue">Your Decision</h4>
          <div className={`p-4 rounded-lg bg-gray-700 border-2 border-${choiceColor}`}>
            <p className="text-lg font-medium">{choiceText}</p>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            You chose the {isPopularChoice ? 'more popular' : 'less popular'} option
          </p>
        </div>
        
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-4 text-collective-purple">Collective Impact</h4>
          <div className="p-4 rounded-lg bg-gray-700">
            <div className="text-2xl font-bold text-god-gold mb-2">
              {isPopularChoice ? 'Reinforced' : 'Challenged'}
            </div>
            <p className="text-sm text-gray-300">
              {isPopularChoice 
                ? 'You reinforced the collective trend'
                : 'You went against the collective wisdom'
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-lg font-semibold mb-3 text-center text-god-gold">
          The God's Response
        </h4>
        <p className="text-gray-300 text-center">
          {isPopularChoice 
            ? 'The collective memory grows stronger. Future players will face even more skewed probabilities.'
            : 'Your defiance has weakened the collective pattern. Future players will see more balanced probabilities.'
          }
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-god-gold rounded-full animate-pulse-slow"></div>
          <span>The God is learning from your choice...</span>
        </div>
      </div>
    </div>
  )
} 