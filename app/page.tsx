'use client'

import React, { useState, useEffect } from 'react'
import ScenarioCard from './components/ScenarioCard'
import ProbabilityDisplay from './components/ProbabilityDisplay'
import CollectiveMemory from './components/CollectiveMemory'
import GameHeader from './components/GameHeader'
import ChessPositionDisplay from './components/ChessPositionDisplay'
import MoralDilemmaDisplay from './components/MoralDilemmaDisplay'
import { submitDecision, calculateDynamicProbabilities } from '../lib/googleSheetsClient'
import { submitCompleteDecision } from '../lib/googleFormsIntegration'
import { getLevel, getAllLevels, getLevelCount, getRanking, getMoralRanking, calculateLevelScore, calculateGodBet, processMoralChoice, Level } from '../lib/levelLoader'
import { errorHandler, logError, logWarn, logInfo, ErrorCategories } from '../lib/errorHandler'
import { errorConfigManager } from '../lib/errorConfig'
import ErrorBoundary from './components/ErrorBoundary'
import ErrorTest from './components/ErrorTest'
import DynamicRulesDisplay from './components/DynamicRulesDisplay'

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [playerChoice, setPlayerChoice] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [probabilities, setProbabilities] = useState({ choiceA: 50, choiceB: 50 })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [moralScore, setMoralScore] = useState(0)
  const [currentLevelData, setCurrentLevelData] = useState<Level | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMove, setSelectedMove] = useState<string>('')
  const [moralChoices, setMoralChoices] = useState<Array<{ captured: boolean, moralWeight: number }>>([])
  const [showDynamicRules, setShowDynamicRules] = useState(false)

  // Initialize error handling
  useEffect(() => {
    try {
      logInfo('Initializing Man vs God moral dilemma game', ErrorCategories.GAME_LOGIC)
      
      // Set up error handler with Google Form URL
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdJcci2XJ29rwO-Bh4WK2K7pwmYid9BOmJvGVK6qHWWO7-Xig/formResponse'
      errorHandler.setGoogleFormUrl(googleFormUrl)
      logInfo('Google Form URL configured for error logging', ErrorCategories.GAME_LOGIC)
      
      logInfo('Game initialization complete', ErrorCategories.GAME_LOGIC)
    } catch (error) {
      logError('Failed to initialize game', ErrorCategories.GAME_LOGIC, { error })
    }
  }, [])

  const allLevels = getAllLevels()
  const totalLevels = getLevelCount()

  // Load current level data
  useEffect(() => {
    const loadLevel = async () => {
      setLoading(true)
      try {
        const levelData = await getLevel(currentLevel)
        setCurrentLevelData(levelData || null)
        if (levelData) {
          updateProbabilities(levelData)
        }
      } catch (error) {
        logError('Failed to load level', ErrorCategories.LEVEL_LOADING, { error, currentLevel })
      } finally {
        setLoading(false)
      }
    }

    loadLevel()
  }, [currentLevel])

  const handleChoice = async (choice: number) => {
    if (!currentLevelData) return
    
    setPlayerChoice(choice)
    
    // Process moral choice
    const moralChoice = processMoralChoice(currentLevel, choice)
    if (moralChoice) {
      setMoralChoices(prev => [...prev, {
        captured: moralChoice.captured,
        moralWeight: moralChoice.moralWeight
      }])
      
      // Update moral score
      const newMoralChoices = [...moralChoices, {
        captured: moralChoice.captured,
        moralWeight: moralChoice.moralWeight
      }]
      const newMoralScore = calculateMoralScore(newMoralChoices)
      setMoralScore(newMoralScore)
    }
    
    // Calculate score based on choice and level difficulty
    const levelScore = calculateLevelScore(choice, currentLevel, 0, 50) // Default values for now
    setTotalScore(prev => prev + levelScore)
    
    // Submit to both Google Sheets and Form
    try {
      await submitCompleteDecision(
        currentLevelData.id,
        choice,
        probabilities,
        {
          level: currentLevel,
          levelTitle: currentLevelData.title,
          hazard: currentLevelData.hazard,
          difficulty: currentLevelData.difficulty,
          choiceText: choice === 0 ? currentLevelData.choiceA : currentLevelData.choiceB,
          levelScore: levelScore,
          chessProblem: currentLevelData.chessProblem,
          selectedMove: selectedMove,
          moralChoice: moralChoice,
          moralScore: moralScore
        }
      )
    } catch (error) {
      console.error('Failed to submit decision:', error)
    }
    
    setShowResults(true)
  }

  const nextLevel = () => {
    if (currentLevel < totalLevels) {
      setCurrentLevel(currentLevel + 1)
      setPlayerChoice(null)
      setShowResults(false)
      setSelectedMove('')
    } else {
      setGameCompleted(true)
    }
  }

  const updateProbabilities = async (levelData?: Level) => {
    try {
      logInfo('Updating probabilities', ErrorCategories.GAME_LOGIC, { currentLevel })
      // Use the level loader to calculate God's bet
      const godBet = calculateGodBet(currentLevel)
      const newProbabilities = {
        choiceA: godBet,
        choiceB: 100 - godBet
      }
      setProbabilities(newProbabilities)
      logInfo('Probabilities updated', ErrorCategories.GAME_LOGIC, { godBet, newProbabilities })
    } catch (error) {
      logError('Failed to update probabilities', ErrorCategories.GAME_LOGIC, { error, currentLevel })
      setProbabilities({ choiceA: 50, choiceB: 50 })
    }
  }

  const restartGame = () => {
    setCurrentLevel(1)
    setPlayerChoice(null)
    setShowResults(false)
    setGameCompleted(false)
    setTotalScore(0)
    setMoralScore(0)
    setSelectedMove('')
    setMoralChoices([])
  }

  const handleMoveSelect = (move: string) => {
    setSelectedMove(move)
    logInfo('Move selected', ErrorCategories.GAME_LOGIC, { move, level: currentLevel })
  }

  const handleMoralChoice = (choice: 'capture' | 'spare') => {
    const choiceNumber = choice === 'capture' ? 0 : 1
    handleChoice(choiceNumber)
  }

  // Calculate moral score
  const calculateMoralScore = (choices: Array<{ captured: boolean, moralWeight: number }>): number => {
    let moralScore = 0
    let totalWeight = 0
    
    choices.forEach(choice => {
      totalWeight += choice.moralWeight
      if (!choice.captured) {
        moralScore += choice.moralWeight
      }
    })
    
    return totalWeight > 0 ? (moralScore / totalWeight) * 100 : 50
  }

  if (loading) {
    return (
      <main className="min-h-screen p-4">
        <GameHeader />
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="scenario-card text-center">
            <div className="text-4xl font-bold mb-6 text-god-gold">
              Loading Moral Dilemma...
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (gameCompleted) {
    const finalMoralScore = calculateMoralScore(moralChoices)
    const moralRanking = getMoralRanking(finalMoralScore)
    
    return (
      <main className="min-h-screen p-4">
        <GameHeader />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="scenario-card text-center">
            <h2 className="text-4xl font-bold mb-6 text-god-gold">
              Game Complete!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Strategic Score */}
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-2xl font-bold text-human-blue mb-4">Strategic Score</h3>
                <div className="text-6xl font-bold text-human-blue mb-2">
                  {totalScore}
                </div>
                <div className="text-xl text-gray-300 mb-4">{getRanking(totalScore)}</div>
                <div className="text-sm text-gray-400">
                  Based on tactical decisions and rebellion against collective wisdom
                </div>
              </div>
              
              {/* Moral Score */}
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-2xl font-bold text-collective-purple mb-4">Moral Score</h3>
                <div className="text-6xl font-bold text-collective-purple mb-2">
                  {Math.round(finalMoralScore)}
                </div>
                <div className="text-xl text-gray-300 mb-4">{moralRanking}</div>
                <div className="text-sm text-gray-400">
                  Based on your moral choices and treatment of others
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-god-gold">{totalLevels}</div>
                <div className="text-sm text-gray-400">Dilemmas Faced</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {moralChoices.filter(c => !c.captured).length}
                </div>
                <div className="text-sm text-gray-400">Pieces Spared</div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {moralChoices.filter(c => c.captured).length}
                </div>
                <div className="text-sm text-gray-400">Pieces Captured</div>
              </div>
            </div>
            
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Face New Dilemmas
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen p-4">
        <GameHeader />
        
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Dynamic Rules Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowDynamicRules(!showDynamicRules)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            {showDynamicRules ? '🧬 Hide' : '🧬 Show'} Dynamic Rules System
          </button>
        </div>

        {/* Dynamic Rules Display */}
        {showDynamicRules && (
          <DynamicRulesDisplay className="mb-8" />
        )}

        {/* Level Progress */}
        <div className="scenario-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-god-gold">
              Dilemma {currentLevel} of {totalLevels}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-human-blue">{totalScore}</div>
              <div className="text-sm text-gray-400">Strategic Score</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(currentLevel / totalLevels) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>Hazard: {currentLevelData?.hazard}</span>
            <span>Difficulty: {currentLevelData?.difficulty}</span>
            <span>Moral Score: {Math.round(moralScore)} ({getMoralRanking(moralScore)})</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Chess Position */}
          {currentLevelData && (
            <div className="xl:col-span-1">
              <ChessPositionDisplay
                fen={currentLevelData.boardState}
                pieceToMove={currentLevelData.piece}
                onMoveSelect={handleMoveSelect}
                selectedMove={selectedMove}
              />
            </div>
          )}
          
          {/* Center Column - Moral Dilemma */}
          {currentLevelData?.moralDilemma && !showResults && (
            <div className="xl:col-span-2">
              <MoralDilemmaDisplay
                dilemma={currentLevelData.moralDilemma}
                onChoice={handleMoralChoice}
              />
            </div>
          )}
          
          {/* Right Column - Game Interface */}
          {!currentLevelData?.moralDilemma && (
            <div className="xl:col-span-2 space-y-6">
              <ProbabilityDisplay probabilities={probabilities} />
              
              {/* Error Test Component - Remove in production */}
              {process.env.NODE_ENV === 'development' && <ErrorTest />}
              
              {!showResults && currentLevelData ? (
                <ScenarioCard
                  scenario={{
                    id: currentLevelData.id,
                    title: currentLevelData.title,
                    description: currentLevelData.description,
                    choiceA: currentLevelData.choiceA,
                    choiceB: currentLevelData.choiceB,
                    category: `Level ${currentLevel}`
                  }}
                  onChoice={handleChoice}
                  probabilities={probabilities}
                />
              ) : showResults && currentLevelData ? (
                <div className="space-y-6">
                  <CollectiveMemory 
                    playerChoice={playerChoice}
                    scenario={{
                      id: currentLevelData.id,
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
                      +{calculateLevelScore(playerChoice!, currentLevel, 0, 50)} Points
                    </div>
                    <p className="text-gray-400 mb-4">
                      {currentLevel < totalLevels 
                        ? 'Ready for the next dilemma?' 
                        : 'You have completed all dilemmas!'
                      }
                    </p>
                    
                    {currentLevel < totalLevels && (
                      <button
                        onClick={nextLevel}
                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all"
                      >
                        Continue to Dilemma {currentLevel + 1}
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
    </ErrorBoundary>
  )
} 