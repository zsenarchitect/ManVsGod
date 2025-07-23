'use client'

import React from 'react'
import { MoralDilemma, PieceBackstory } from '../../lib/moralDilemmas'
import { logInfo, ErrorCategories } from '../../lib/errorHandler'

interface MoralDilemmaDisplayProps {
  dilemma: MoralDilemma
  onChoice?: (choice: 'capture' | 'spare') => void
  selectedChoice?: 'capture' | 'spare'
}

export default function MoralDilemmaDisplay({ 
  dilemma, 
  onChoice, 
  selectedChoice 
}: MoralDilemmaDisplayProps) {
  const backstory = dilemma.backstory

  const handleChoice = (choice: 'capture' | 'spare') => {
    logInfo('Moral choice made', ErrorCategories.GAME_LOGIC, { 
      choice, 
      piece: backstory.name, 
      moralWeight: backstory.moralWeight 
    })
    onChoice?.(choice)
  }

  return (
    <div className="space-y-6">
      {/* Character Profile */}
      <div className="scenario-card">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">
            {backstory.piece === 'p' && '♟'}
            {backstory.piece === 'n' && '♞'}
            {backstory.piece === 'b' && '♝'}
            {backstory.piece === 'r' && '♜'}
            {backstory.piece === 'q' && '♛'}
            {backstory.piece === 'k' && '♚'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-god-gold">{backstory.name}</h3>
            <p className="text-gray-400">{backstory.role} • Age {backstory.age}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 leading-relaxed">{backstory.backstory}</p>
        </div>

        {/* Moral Weight Indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Moral Difficulty</span>
            <span className="text-sm font-bold text-god-gold">{backstory.moralWeight}/10</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(backstory.moralWeight / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Threat & Future Potential */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-700 rounded-lg">
            <h4 className="text-sm font-bold text-red-400 mb-1">Current Threat</h4>
            <p className="text-xs text-gray-300">{backstory.currentThreat}</p>
          </div>
          <div className="p-3 bg-gray-700 rounded-lg">
            <h4 className="text-sm font-bold text-blue-400 mb-1">Future Potential</h4>
            <p className="text-xs text-gray-300">{backstory.futurePotential}</p>
          </div>
        </div>
      </div>

      {/* Family & Dependents */}
      {backstory.family && (
        <div className="scenario-card">
          <h3 className="text-lg font-bold text-god-gold mb-3">Family & Dependents</h3>
          <div className="space-y-2">
            {backstory.family.spouse && (
              <div className="flex justify-between">
                <span className="text-gray-400">Spouse:</span>
                <span className="text-white">{backstory.family.spouse}</span>
              </div>
            )}
            {backstory.family.children && backstory.family.children.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Children:</span>
                <span className="text-white">{backstory.family.children.join(', ')}</span>
              </div>
            )}
            {backstory.family.dependents && backstory.family.dependents.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Dependents:</span>
                <span className="text-white">{backstory.family.dependents.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Past Actions */}
      <div className="scenario-card">
        <h3 className="text-lg font-bold text-god-gold mb-3">Past Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-bold text-green-400 mb-2">Good Deeds</h4>
            <ul className="space-y-1">
              {backstory.pastActions.good.map((action, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-400 mb-2">Bad Deeds</h4>
            <ul className="space-y-1">
              {backstory.pastActions.bad.map((action, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Choice Options */}
      <div className="scenario-card">
        <h3 className="text-lg font-bold text-god-gold mb-4">Your Choice</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capture Option */}
          <button
            onClick={() => handleChoice('capture')}
            className={`
              p-4 rounded-lg text-left transition-all duration-200
              ${selectedChoice === 'capture' 
                ? 'bg-red-600 text-white ring-2 ring-red-400' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            <div className="font-bold mb-2">{dilemma.choices.capture.text}</div>
            <div className="text-sm opacity-75 mb-3">
              <div className="flex justify-between mb-1">
                <span>Moral Cost:</span>
                <span className="text-red-400">{dilemma.choices.capture.moralCost}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Strategic Benefit:</span>
                <span className="text-green-400">{dilemma.choices.capture.strategicBenefit}/10</span>
              </div>
            </div>
            <ul className="text-xs space-y-1">
              {dilemma.choices.capture.consequences.map((consequence, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-400 mr-2 mt-1">•</span>
                  {consequence}
                </li>
              ))}
            </ul>
          </button>

          {/* Spare Option */}
          <button
            onClick={() => handleChoice('spare')}
            className={`
              p-4 rounded-lg text-left transition-all duration-200
              ${selectedChoice === 'spare' 
                ? 'bg-green-600 text-white ring-2 ring-green-400' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            <div className="font-bold mb-2">{dilemma.choices.spare.text}</div>
            <div className="text-sm opacity-75 mb-3">
              <div className="flex justify-between mb-1">
                <span>Moral Benefit:</span>
                <span className="text-green-400">{dilemma.choices.spare.moralBenefit}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Strategic Cost:</span>
                <span className="text-red-400">{dilemma.choices.spare.strategicCost}/10</span>
              </div>
            </div>
            <ul className="text-xs space-y-1">
              {dilemma.choices.spare.consequences.map((consequence, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-400 mr-2 mt-1">•</span>
                  {consequence}
                </li>
              ))}
            </ul>
          </button>
        </div>
      </div>

      {/* Philosophical Themes */}
      <div className="scenario-card">
        <h3 className="text-lg font-bold text-god-gold mb-3">Philosophical Themes</h3>
        <div className="flex flex-wrap gap-2">
          {dilemma.philosophicalThemes.map((theme, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Difficulty Indicator */}
      <div className="scenario-card">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Dilemma Difficulty:</span>
          <span className={`
            font-bold px-3 py-1 rounded-full text-xs
            ${dilemma.difficulty === 'easy' && 'bg-green-600 text-white'}
            ${dilemma.difficulty === 'medium' && 'bg-yellow-600 text-white'}
            ${dilemma.difficulty === 'hard' && 'bg-orange-600 text-white'}
            ${dilemma.difficulty === 'extreme' && 'bg-red-600 text-white'}
          `}>
            {dilemma.difficulty.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
} 