# Chess Game Levels

This folder contains all the level data for the Man vs God chess game. Each level represents a different chess piece and position, with progressive difficulty and betting mechanics.

## Structure

- `level1.json` - Tutorial: The Pawn's Journey (Tutorial, Low Hazard)
- `level2.json` - The Knight's Dilemma (Easy, Medium Hazard)
- `level3.json` - The Bishop's Sacrifice (Medium, High Hazard)
- `level4.json` - The Rook's Endgame (Hard, Extreme Hazard)
- `level5.json` - The Queen's Gambit (Impossible, Maximum Hazard)
- `index.ts` - Export file for easy importing

## Level Data Format

Each level JSON file contains the following structure:

```json
{
  "id": 1,
  "title": "Level Title",
  "description": "Detailed description of the chess position and dilemma",
  "piece": "pawn|knight|bishop|rook|queen|king",
  "position": "starting|midgame|complex|endgame|critical",
  "boardState": "FEN notation of the chess position",
  "availableMoves": ["e2e4", "d2d4", "..."],
  "choiceA": "First move option",
  "choiceB": "Second move option",
  "hazard": "Low|Medium|High|Extreme|Maximum",
  "difficulty": "Tutorial|Easy|Medium|Hard|Impossible",
  "category": "Category name",
  "philosophicalThemes": ["Theme1", "Theme2", "Theme3"],
  "baseScore": 50,
  "rebellionBonus": 25,
  "probabilityIntensity": 0.10,
  "background": "Chess and philosophical background information",
  "consequences": {
    "choiceA": "Consequence of choosing option A",
    "choiceB": "Consequence of choosing option B"
  },
  "currencyCost": {
    "moveCost": 50,
    "disobediencePenalty": 100,
    "survivalBonus": 25
  },
  "godMove": {
    "suggestedMove": "e2e4",
    "confidence": 75,
    "reasoning": "Why the collective wisdom suggests this move"
  }
}
```

## Field Descriptions

- **id**: Unique identifier for the level
- **title**: Display name for the level
- **description**: The chess position and dilemma presented to the player
- **piece**: Which chess piece the player controls
- **position**: Type of chess position (opening, middlegame, endgame, etc.)
- **boardState**: FEN notation representing the current chess position
- **availableMoves**: Array of legal moves in algebraic notation
- **choiceA/choiceB**: The two move options the player can choose from
- **hazard**: Risk level that increases with each level
- **difficulty**: Complexity level that increases with each level
- **category**: Chess category (opening, tactics, endgame, etc.)
- **philosophicalThemes**: Array of philosophical concepts explored
- **baseScore**: Base points awarded for completing the level
- **rebellionBonus**: Bonus points for going against collective wisdom
- **probabilityIntensity**: How much past decisions affect future God bets
- **background**: Educational context about the chess position and concepts
- **consequences**: Explanation of what each move means strategically
- **currencyCost**: Game currency costs for moves and disobedience
- **godMove**: The collective wisdom's suggested move and reasoning

## Usage

```typescript
import { getLevel, getAllLevels, getLevelCount, getChessPieceIcon } from '../data/levels'

// Get a specific level
const level1 = getLevel(1)

// Get all levels
const allLevels = getAllLevels()

// Get total number of levels
const totalLevels = getLevelCount()

// Get chess piece icon
const pawnIcon = getChessPieceIcon('pawn') // Returns '♟'
```

## Progressive Chess Design

The levels are designed to be progressively more challenging:

1. **Level 1**: Tutorial with pawn opening (basic chess concepts)
2. **Level 2**: Knight in middlegame (tactical decisions)
3. **Level 3**: Bishop sacrifice (complex tactics and calculation)
4. **Level 4**: Rook endgame (strategic endgame play)
5. **Level 5**: Queen sacrifice (ultimate tactical brilliance)

Each level increases in:
- **Hazard Level**: From Low to Maximum
- **Difficulty**: From Tutorial to Impossible
- **Chess Complexity**: From basic moves to complex sacrifices
- **Strategic Depth**: From simple choices to multi-move calculations
- **Philosophical Depth**: From basic decision-making to ultimate sacrifice

## Chess Integration Features

- **FEN Notation**: Standard chess position representation
- **Legal Moves**: Validated chess moves in algebraic notation
- **Piece Values**: Standard chess piece point values
- **Position Types**: Opening, middlegame, endgame classifications
- **Tactical Themes**: Sacrifice, attack, defense, simplification
- **Strategic Concepts**: Center control, king safety, material vs initiative

## Betting Mechanics

Each level includes:
- **Move Cost**: Currency spent to make a move
- **Disobedience Penalty**: Extra cost to ignore God's suggestion
- **Survival Bonus**: Points earned for staying alive
- **God's Confidence**: How strongly the collective wisdom suggests a move
- **Rebellion Bonus**: Rewards for going against collective wisdom 