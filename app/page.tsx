'use client'

import React, { useState, useEffect } from 'react'
import ScenarioCard from './components/ScenarioCard'
import ProbabilityDisplay from './components/ProbabilityDisplay'
import CollectiveMemory from './components/CollectiveMemory'
import GameHeader from './components/GameHeader'
import { submitDecision, calculateDynamicProbabilities } from '../lib/googleSheetsClient'
import { submitCompleteDecision } from '../lib/googleFormsIntegration'

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [playerChoice, setPlayerChoice] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [probabilities, setProbabilities] = useState({ choiceA: 50, choiceB: 50 })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  // Progressive scenario that gets harder and more hazardous
  const progressiveScenario = {
    id: 1,
    title: "The Escalating Dilemma",
    description: "You face a series of increasingly difficult moral choices. Each decision affects the collective memory, and the stakes get higher with every level.",
    levels: [
      {
        level: 1,
        title: "The Trolley Problem",
        description: "A trolley is heading towards five people tied up on the tracks. You can pull a lever to divert it to a different track, but there's one person tied up there. What do you do?",
        choiceA: "Pull the lever (save 5, kill 1)",
        choiceB: "Do nothing (let 5 die)",
        hazard: "Low",
        difficulty: "Easy"
      },
      {
        level: 2,
        title: "The Lifeboat Dilemma",
        description: "You're on a lifeboat with 10 people, but it can only support 8. Two people must be sacrificed to save the rest. How do you choose?",
        choiceA: "Sacrifice the weakest (elderly/sick)",
        choiceB: "Draw lots (random selection)",
        hazard: "Medium",
        difficulty: "Medium"
      },
      {
        level: 3,
        title: "The Hospital Triage",
        description: "You're a doctor in a disaster zone. You have limited resources and must choose between saving a child, a pregnant woman, or an elderly person. Who do you save?",
        choiceA: "Save the child (future potential)",
        choiceB: "Save the pregnant woman (two lives)",
        hazard: "High",
        difficulty: "Hard"
      },
      {
        level: 4,
        title: "The Nuclear Dilemma",
        description: "A nuclear missile is heading towards a city of 1 million people. You can redirect it to a smaller city of 100,000 people. What do you do?",
        choiceA: "Redirect to smaller city (save 900,000)",
        choiceB: "Let it hit the original target",
        hazard: "Extreme",
        difficulty: "Very Hard"
      },
      {
        level: 5,
        title: "The Ultimate Choice",
        description: "You must choose between saving your own child or saving 10 other children. Your child will definitely die if you don't choose them. What do you do?",
        choiceA: "Save your own child",
        choiceB: "Save the 10 other children",
        hazard: "Maximum",
        difficulty: "Impossible"
      }
    ]
  }

  const currentLevelData = progressiveScenario.levels[currentLevel - 1]

  const handleChoice = async (choice: number) => {
    setPlayerChoice(choice)
    
    // Calculate score based on choice and level difficulty
    const levelScore = calculateLevelScore(choice, currentLevel)
    setTotalScore(prev => prev + levelScore)
    
    // Submit to both Google Sheets and Form
    try {
      await submitCompleteDecision(
        progressiveScenario.id,
        choice,
        probabilities,
        {
          level: currentLevel,
          levelTitle: currentLevelData.title,
          hazard: currentLevelData.hazard,
          difficulty: currentLevelData.difficulty,
          choiceText: choice === 0 ? currentLevelData.choiceA : currentLevelData.choiceB,
          levelScore: levelScore
        }
      )
    } catch (error) {
      console.error('Failed to submit decision:', error)
    }
    
    setShowResults(true)
  }

  const calculateLevelScore = (choice: number, level: number): number => {
    // Score based on level difficulty and choice alignment with collective wisdom
    const baseScore = level * 10
    const isPopularChoice = choice === 0 ? probabilities.choiceA > 50 : probabilities.choiceB > 50
    
    // Bonus for going against collective wisdom (more points for rebellion)
    const rebellionBonus = isPopularChoice ? 0 : level * 5
    
    return baseScore + rebellionBonus
  }

  const nextLevel = () => {
    if (currentLevel < progressiveScenario.levels.length) {
      setCurrentLevel(currentLevel + 1)
      setPlayerChoice(null)
      setShowResults(false)
      updateProbabilities()
    } else {
      setGameCompleted(true)
    }
  }

  const updateProbabilities = async () => {
    // Probabilities get more extreme as levels progress
    const baseProb = 50
    const levelIntensity = currentLevel * 0.15 // Each level increases intensity
    const variation = Math.random() * 30 - 15 // ±15% variation
    
    const adjustedProb = Math.max(10, Math.min(90, baseProb + variation + (levelIntensity * 20)))
    
    setProbabilities({
      choiceA: adjustedProb,
      choiceB: 100 - adjustedProb
    })
  }

  const restartGame = () => {
    setCurrentLevel(1)
    setPlayerChoice(null)
    setShowResults(false)
    setGameCompleted(false)
    setTotalScore(0)
    updateProbabilities()
  }

  useEffect(() => {
    updateProbabilities()
  }, [])

  if (gameCompleted) {
    return (
      <main className="min-h-screen p-4">
        <GameHeader />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="scenario-card text-center">
            <h2 className="text-4xl font-bold mb-6 text-god-gold">
              Game Complete!
            </h2>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-human-blue mb-4">
                {totalScore}
              </div>
              <div className="text-xl text-gray-300">Total Score</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-god-gold">{progressiveScenario.levels.length}</div>
                <div className="text-sm text-gray-400">Levels Completed</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-collective-purple">
                  {Math.round(totalScore / progressiveScenario.levels.length)}
                </div>
                <div className="text-sm text-gray-400">Average Score</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-human-blue">
                  {totalScore >= 200 ? 'Master' : totalScore >= 150 ? 'Expert' : totalScore >= 100 ? 'Adept' : 'Novice'}
                </div>
                <div className="text-sm text-gray-400">Ranking</div>
              </div>
            </div>
            
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4">
      <GameHeader />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Level Progress */}
        <div className="scenario-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-god-gold">
              Level {currentLevel} of {progressiveScenario.levels.length}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-human-blue">{totalScore}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(currentLevel / progressiveScenario.levels.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>Hazard: {currentLevelData.hazard}</span>
            <span>Difficulty: {currentLevelData.difficulty}</span>
          </div>
        </div>
        
        <ProbabilityDisplay probabilities={probabilities} />
        
        {!showResults ? (
          <ScenarioCard
            scenario={{
              id: progressiveScenario.id,
              title: currentLevelData.title,
              description: currentLevelData.description,
              choiceA: currentLevelData.choiceA,
              choiceB: currentLevelData.choiceB,
              category: `Level ${currentLevel}`
            }}
            onChoice={handleChoice}
            probabilities={probabilities}
          />
        ) : (
          <div className="space-y-6">
            <CollectiveMemory 
              playerChoice={playerChoice}
              scenario={{
                id: progressiveScenario.id,
                title: currentLevelData.title,
                description: currentLevelData.description,
                choiceA: currentLevelData.choiceA,
                choiceB: currentLevelData.choiceB,
                category: `Level ${currentLevel}`
              }}
              probabilities={probabilities}
            />
            
            <div className="text-center">
              <div className="text-2xl font-bold text-god-gold mb-2">
                +{calculateLevelScore(playerChoice!, currentLevel)} Points
              </div>
              <p className="text-gray-400 mb-4">
                {currentLevel < progressiveScenario.levels.length 
                  ? 'Ready for the next challenge?' 
                  : 'You have completed all levels!'
                }
              </p>
              
              {currentLevel < progressiveScenario.levels.length && (
                <button
                  onClick={nextLevel}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all"
                >
                  Continue to Level {currentLevel + 1}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 