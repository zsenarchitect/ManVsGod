// Level loader utility for Man vs God chess game
// Loads level data from JSON files and integrates with chess API and moral dilemmas

import { errorHandler, logError, logWarn, logInfo, logDebug, ErrorCategories, ErrorMessages } from './errorHandler'
import { fetchPuzzleByLevel, analyzePosition, getPieceName, getPieceIcon, ChessProblem } from './chessApi'
import { generateMoralDilemma, MoralDilemma, PieceBackstory, calculateMoralScore, getMoralConsequences, getPhilosophicalAnalysis } from './moralDilemmas'

export interface Level {
  id: number
  title: string
  description: string
  piece: string
  position: string
  boardState: string
  availableMoves: string[]
  choiceA: string
  choiceB: string
  hazard: string
  difficulty: string
  category: string
  philosophicalThemes: string[]
  baseScore: number
  rebellionBonus: number
  probabilityIntensity: number
  background: string
  consequences: {
    choiceA: string
    choiceB: string
  }
  currencyCost: {
    moveCost: number
    disobediencePenalty: number
    survivalBonus: number
  }
  godMove: {
    suggestedMove: string
    confidence: number
    reasoning: string
  }
  chessProblem?: ChessProblem
  moralDilemma?: MoralDilemma
  moralChoice?: {
    captured: boolean
    moralWeight: number
    consequences: string[]
    philosophicalAnalysis: string
  }
}

export interface GameConfig {
  totalLevels: number
  maxScore: number
  startingCurrency: number
  rankingThresholds: {
    master: number
    expert: number
    adept: number
    novice: number
  }
  moralThresholds: {
    saint: number
    virtuous: number
    neutral: number
    corrupt: number
  }
}

// Default game configuration
export const gameConfig: GameConfig = {
  totalLevels: 5,
  maxScore: 500, // Sum of all base scores + max rebellion bonuses
  startingCurrency: 1000,
  rankingThresholds: {
    master: 300,
    expert: 200,
    adept: 150,
    novice: 100
  },
  moralThresholds: {
    saint: 90,
    virtuous: 70,
    neutral: 50,
    corrupt: 30
  }
}

// Level data with moral dilemmas
export const levels: Level[] = [
  {
    "id": 1,
    "title": "The Innocent Pawn",
    "description": "You face a young peasant forced into service. He has no desire to fight and dreams of returning to his family's farm. Will you capture him for tactical advantage or spare him for moral reasons?",
    "piece": "pawn",
    "position": "e4",
    "boardState": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
    "availableMoves": [
      "e4e5",
      "e4d5",
      "e4f5"
    ],
    "choiceA": "Capture the innocent peasant",
    "choiceB": "Spare the innocent peasant",
    "hazard": "Moral",
    "difficulty": "Tutorial",
    "category": "Moral Choice",
    "philosophicalThemes": ["Individual vs Collective Good", "Innocence", "Conscription"],
    "baseScore": 50,
    "rebellionBonus": 25,
    "probabilityIntensity": 0.10,
    "background": "This is your first moral test. A young peasant, Tom, was forced into service and has no desire to fight. His death would be a tragedy, but sparing him may have strategic consequences.",
    "consequences": {
      "choiceA": "You gain a tactical advantage but kill an innocent boy",
      "choiceB": "You preserve innocence but may face strategic disadvantages"
    },
    "currencyCost": {
      "moveCost": 50,
      "disobediencePenalty": 100,
      "survivalBonus": 25
    },
    "godMove": {
      "suggestedMove": "spare",
      "confidence": 75,
      "reasoning": "Most players prefer to spare the innocent"
    }
  },
  {
    "id": 2,
    "title": "The Young Knight's Cats",
    "description": "You face Sir Tristan, a young knight who feeds 99% of the cats in the kingdom. His gentle nature has made him beloved, but his inexperience makes him a tactical liability.",
    "piece": "knight",
    "position": "e5",
    "boardState": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
    "availableMoves": [
      "f3e5",
      "d2d4",
      "b1c3"
    ],
    "choiceA": "Capture the cat-feeding knight",
    "choiceB": "Spare the cat-feeding knight",
    "hazard": "High Moral",
    "difficulty": "Beginner",
    "category": "Moral Choice",
    "philosophicalThemes": ["Utilitarianism", "Animal Welfare", "Individual Impact"],
    "baseScore": 75,
    "rebellionBonus": 35,
    "probabilityIntensity": 0.25,
    "background": "Sir Tristan's death would cause widespread suffering as 99% of the kingdom's cats would starve. But his inexperience makes him vulnerable.",
    "consequences": {
      "choiceA": "Eliminates a threat but causes mass animal suffering",
      "choiceB": "Prevents suffering but allows a tactical piece to survive"
    },
    "currencyCost": {
      "moveCost": 75,
      "disobediencePenalty": 150,
      "survivalBonus": 50
    },
    "godMove": {
      "suggestedMove": "spare",
      "confidence": 65,
      "reasoning": "The suffering of innocent animals weighs heavily"
    }
  },
  {
    "id": 3,
    "title": "The Old Knight's Redemption",
    "description": "You face Sir Mordred, a battle-hardened knight with a dark past. He has committed atrocities but now seeks redemption through protecting the innocent.",
    "piece": "knight",
    "position": "f6",
    "boardState": "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1",
    "availableMoves": [
      "b1c3",
      "f1c4",
      "d1e2"
    ],
    "choiceA": "Capture the repentant knight",
    "choiceB": "Spare the repentant knight",
    "hazard": "Complex Moral",
    "difficulty": "Intermediate",
    "category": "Moral Choice",
    "philosophicalThemes": ["Redemption", "Justice", "Forgiveness"],
    "baseScore": 100,
    "rebellionBonus": 50,
    "probabilityIntensity": 0.40,
    "background": "Sir Mordred's past crimes are terrible, but he now protects villages and trains young knights. Is redemption possible?",
    "consequences": {
      "choiceA": "Justice is served but his protective role ends",
      "choiceB": "Allows redemption but his past haunts the kingdom"
    },
    "currencyCost": {
      "moveCost": 100,
      "disobediencePenalty": 200,
      "survivalBonus": 75
    },
    "godMove": {
      "suggestedMove": "spare",
      "confidence": 55,
      "reasoning": "Redemption should be given a chance"
    }
  },
  {
    "id": 4,
    "title": "The Knight Who Spared You",
    "description": "You face Sir Percival, who refused to capture you in the past, showing mercy when others would not. His principles have made him both respected and vulnerable.",
    "piece": "knight",
    "position": "d4",
    "boardState": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1",
    "availableMoves": [
      "c1e3",
      "c1g5",
      "c1f4"
    ],
    "choiceA": "Capture the merciful knight",
    "choiceB": "Spare the merciful knight",
    "hazard": "Honor",
    "difficulty": "Advanced",
    "category": "Moral Choice",
    "philosophicalThemes": ["Reciprocity", "Honor", "Gratitude"],
    "baseScore": 125,
    "rebellionBonus": 75,
    "probabilityIntensity": 0.60,
    "background": "Sir Percival once showed you mercy in battle. To capture him now would be to betray that kindness and lose your honor.",
    "consequences": {
      "choiceA": "You betray past mercy and lose honor",
      "choiceB": "You honor his past kindness but he remains a threat"
    },
    "currencyCost": {
      "moveCost": 125,
      "disobediencePenalty": 250,
      "survivalBonus": 100
    },
    "godMove": {
      "suggestedMove": "spare",
      "confidence": 70,
      "reasoning": "Honor demands reciprocity"
    }
  },
  {
    "id": 5,
    "title": "The Queen's Threat",
    "description": "You face Queen Morgana, actively attacking your position and causing immediate harm. She is ruthless in battle but also a mother and leader to her people.",
    "piece": "queen",
    "position": "h4",
    "boardState": "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1",
    "availableMoves": [
      "d1e2",
      "d1f3",
      "d1g4"
    ],
    "choiceA": "Capture the attacking queen",
    "choiceB": "Spare the attacking queen",
    "hazard": "Immediate",
    "difficulty": "Expert",
    "category": "Moral Choice",
    "philosophicalThemes": ["Self-Defense", "Leadership", "Family"],
    "baseScore": 150,
    "rebellionBonus": 100,
    "probabilityIntensity": 0.80,
    "background": "Queen Morgana is actively trying to kill you, but she is also a mother and leader. Her death would cause political instability.",
    "consequences": {
      "choiceA": "Eliminates immediate threat but causes political chaos",
      "choiceB": "Prevents immediate harm but she continues attacking"
    },
    "currencyCost": {
      "moveCost": 150,
      "disobediencePenalty": 300,
      "survivalBonus": 125
    },
    "godMove": {
      "suggestedMove": "capture",
      "confidence": 45,
      "reasoning": "Self-defense justifies the action"
    }
  }
]

// Load level with moral dilemma integration
export async function getLevel(levelId: number): Promise<Level | undefined> {
  try {
    logInfo(`Getting level ${levelId}`, ErrorCategories.LEVEL_LOADING, { levelId })
    
    const level = levels.find(l => l.id === levelId)
    if (!level) {
      logError(ErrorMessages.LEVEL_NOT_FOUND, ErrorCategories.LEVEL_LOADING, { levelId })
      return undefined
    }
    
    // Generate moral dilemma for this level
    try {
      const moralDilemma = generateMoralDilemma(level.piece, level.position, levelId)
      level.moralDilemma = moralDilemma
      
      // Update level with moral dilemma data
      if (moralDilemma) {
        level.choiceA = moralDilemma.choices.capture.text
        level.choiceB = moralDilemma.choices.spare.text
        level.background = moralDilemma.description
        level.philosophicalThemes = moralDilemma.philosophicalThemes
        level.consequences.choiceA = moralDilemma.choices.capture.consequences[0]
        level.consequences.choiceB = moralDilemma.choices.spare.consequences[0]
        
        // Update God's move based on moral weight
        const moralWeight = moralDilemma.backstory.moralWeight
        level.godMove.suggestedMove = moralWeight > 5 ? 'spare' : 'capture'
        level.godMove.confidence = Math.min(95, 50 + (moralWeight * 5))
        level.godMove.reasoning = `Moral weight of ${moralWeight}/10 influences the collective wisdom`
      }
      
      logInfo(`Successfully loaded level ${levelId} with moral dilemma`, ErrorCategories.LEVEL_LOADING, { levelId, title: level.title })
    } catch (error) {
      logWarn(`Failed to generate moral dilemma for level ${levelId}, using fallback`, ErrorCategories.LEVEL_LOADING, { error, levelId })
    }
    
    // Fetch chess problem for this level (optional)
    try {
      const chessProblem = await fetchPuzzleByLevel(levelId)
      level.chessProblem = chessProblem
      
      if (chessProblem) {
        level.boardState = chessProblem.fen
        level.availableMoves = chessProblem.moves
      }
    } catch (error) {
      logWarn(`Failed to fetch chess problem for level ${levelId}, using fallback`, ErrorCategories.LEVEL_LOADING, { error, levelId })
    }
    
    return level
  } catch (error) {
    logError(`Failed to get level ${levelId}`, ErrorCategories.LEVEL_LOADING, { error, levelId })
    return undefined
  }
}

export function getAllLevels(): Level[] {
  try {
    logInfo('Getting all levels', ErrorCategories.LEVEL_LOADING)
    return levels
  } catch (error) {
    logError('Failed to get all levels', ErrorCategories.LEVEL_LOADING, { error })
    return []
  }
}

export function getLevelCount(): number {
  try {
    const count = levels.length
    logInfo(`Level count: ${count}`, ErrorCategories.LEVEL_LOADING, { count })
    return count
  } catch (error) {
    logError('Failed to get level count', ErrorCategories.LEVEL_LOADING, { error })
    return 0
  }
}

export function calculateMaxScore(): number {
  try {
    const maxScore = levels.reduce((total, level) => total + level.baseScore + level.rebellionBonus, 0)
    logInfo(`Calculated max score: ${maxScore}`, ErrorCategories.GAME_LOGIC, { maxScore })
    return maxScore
  } catch (error) {
    logError('Failed to calculate max score', ErrorCategories.GAME_LOGIC, { error })
    return 500
  }
}

export function getRanking(score: number): string {
  try {
    let ranking = 'Novice'
    if (score >= gameConfig.rankingThresholds.master) ranking = 'Master'
    else if (score >= gameConfig.rankingThresholds.expert) ranking = 'Expert'
    else if (score >= gameConfig.rankingThresholds.adept) ranking = 'Adept'
    
    logInfo(`Calculated ranking: ${ranking}`, ErrorCategories.GAME_LOGIC, { score, ranking })
    return ranking
  } catch (error) {
    logError('Failed to calculate ranking', ErrorCategories.GAME_LOGIC, { error, score })
    return 'Novice'
  }
}

export function getMoralRanking(moralScore: number): string {
  try {
    let ranking = 'Neutral'
    if (moralScore >= gameConfig.moralThresholds.saint) ranking = 'Saint'
    else if (moralScore >= gameConfig.moralThresholds.virtuous) ranking = 'Virtuous'
    else if (moralScore >= gameConfig.moralThresholds.neutral) ranking = 'Neutral'
    else ranking = 'Corrupt'
    
    logInfo(`Calculated moral ranking: ${ranking}`, ErrorCategories.GAME_LOGIC, { moralScore, ranking })
    return ranking
  } catch (error) {
    logError('Failed to calculate moral ranking', ErrorCategories.GAME_LOGIC, { error, moralScore })
    return 'Neutral'
  }
}

export function calculateLevelScore(choice: number, levelId: number, playerBet: number, godBet: number): number {
  try {
    logInfo('Calculating level score', ErrorCategories.GAME_LOGIC, { choice, levelId, playerBet, godBet })
    
    const level = levels.find(l => l.id === levelId)
    if (!level) {
      logError('Level not found for score calculation', ErrorCategories.GAME_LOGIC, { levelId })
      return 0
    }
    
    let score = level.baseScore
    
    // Add rebellion bonus if player disagreed with God
    if (Math.abs(playerBet - godBet) > 20) {
      score += level.rebellionBonus
    }
    
    // Add bonus for higher bets (confidence)
    score += Math.floor(playerBet / 10)
    
    // Add moral score component
    if (level.moralDilemma) {
      const captured = choice === 0 // Assuming choice 0 is capture
      const moralWeight = level.moralDilemma.backstory.moralWeight
      
      if (!captured) {
        score += Math.floor(moralWeight * 2) // Bonus for sparing
      } else {
        score -= Math.floor(moralWeight) // Penalty for capturing
      }
    }
    
    logInfo('Level score calculated', ErrorCategories.GAME_LOGIC, {
      baseScore: level.baseScore,
      rebellionBonus: level.rebellionBonus,
      moralComponent: level.moralDilemma ? 'included' : 'none',
      finalScore: score
    })
    
    return score
  } catch (error) {
    logError('Failed to calculate level score', ErrorCategories.GAME_LOGIC, { error, choice, levelId, playerBet, godBet })
    return 50
  }
}

export function calculateGodBet(levelId: number): number {
  try {
    logInfo('Calculating God bet', ErrorCategories.GAME_LOGIC, { levelId })
    
    const level = levels.find(l => l.id === levelId)
    if (!level) {
      logWarn('Level not found for God bet calculation, using default', ErrorCategories.GAME_LOGIC, { levelId })
      return 50
    }
    
    // Base confidence from level difficulty
    let confidence = 50 + (levelId * 5)
    
    // Adjust based on moral dilemma if available
    if (level.moralDilemma) {
      const moralWeight = level.moralDilemma.backstory.moralWeight
      confidence = moralWeight > 5 ? 70 : 30 // Higher confidence for sparing high moral weight pieces
    }
    
    // Add some randomness to make it interesting
    confidence += (Math.random() - 0.5) * 20
    confidence = Math.max(10, Math.min(90, confidence))
    
    logInfo('God bet calculated', ErrorCategories.GAME_LOGIC, {
      levelId,
      baseConfidence: 50 + (levelId * 5),
      moralAdjustment: level.moralDilemma ? 'applied' : 'none',
      finalConfidence: confidence
    })
    
    return Math.round(confidence)
  } catch (error) {
    logError('Failed to calculate God bet', ErrorCategories.GAME_LOGIC, { error, levelId })
    return 50
  }
}

export function getChessPieceIcon(piece: string): string {
  try {
    const icon = getPieceIcon(piece.toUpperCase())
    logDebug('Got chess piece icon', ErrorCategories.UI_RENDERING, { piece, icon })
    return icon
  } catch (error) {
    logError('Failed to get chess piece icon', ErrorCategories.UI_RENDERING, { error, piece })
    return '?'
  }
}

export function validateChessMove(move: string, availableMoves: string[]): boolean {
  try {
    const isValid = availableMoves.includes(move)
    logDebug('Validated chess move', ErrorCategories.VALIDATION, { move, isValid, availableMoves })
    return isValid
  } catch (error) {
    logError('Failed to validate chess move', ErrorCategories.VALIDATION, { error, move, availableMoves })
    return false
  }
}

export function getPieceValue(piece: string): number {
  try {
    const values: { [key: string]: number } = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
    }
    const value = values[piece.toLowerCase()] || 0
    logDebug('Got piece value', ErrorCategories.GAME_LOGIC, { piece, value })
    return value
  } catch (error) {
    logError('Failed to get piece value', ErrorCategories.GAME_LOGIC, { error, piece })
    return 0
  }
}

// New function to get chess problem for a level
export async function getChessProblemForLevel(levelId: number): Promise<ChessProblem | null> {
  try {
    const problem = await fetchPuzzleByLevel(levelId)
    return problem
  } catch (error) {
    logError('Failed to get chess problem for level', ErrorCategories.LEVEL_LOADING, { error, levelId })
    return null
  }
}

// New function to analyze current position
export function analyzeCurrentPosition(fen: string) {
  try {
    return analyzePosition(fen)
  } catch (error) {
    logError('Failed to analyze position', ErrorCategories.GAME_LOGIC, { error, fen })
    return null
  }
}

// New function to process moral choice
export function processMoralChoice(levelId: number, choice: number): {
  captured: boolean
  moralWeight: number
  consequences: string[]
  philosophicalAnalysis: string
} | null {
  try {
    const level = levels.find(l => l.id === levelId)
    if (!level || !level.moralDilemma) {
      return null
    }
    
    const captured = choice === 0 // Assuming choice 0 is capture
    const backstory = level.moralDilemma.backstory
    const consequences = getMoralConsequences(captured, backstory)
    const philosophicalAnalysis = getPhilosophicalAnalysis(captured, backstory)
    
    return {
      captured,
      moralWeight: backstory.moralWeight,
      consequences,
      philosophicalAnalysis
    }
  } catch (error) {
    logError('Failed to process moral choice', ErrorCategories.GAME_LOGIC, { error, levelId, choice })
    return null
  }
} 