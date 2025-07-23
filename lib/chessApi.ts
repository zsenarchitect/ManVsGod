// Chess API integration for Man vs God game
// Uses Lichess API to fetch real chess problems and positions

export interface ChessProblem {
  id: string
  fen: string
  moves: string[]
  rating: number
  themes: string[]
  gameUrl: string
  solution: string[]
}

export interface ChessPosition {
  fen: string
  legalMoves: string[]
  evaluation: number
  bestMove: string
  pieceToMove: string
  position: string
}

// Lichess API endpoints
const LICHESS_API_BASE = 'https://lichess.org/api'
const PUZZLE_API = `${LICHESS_API_BASE}/puzzle/daily`
const PUZZLE_RANDOM = `${LICHESS_API_BASE}/puzzle/random`

// Chess piece values for evaluation
const PIECE_VALUES = {
  'p': 1,   // pawn
  'n': 3,   // knight
  'b': 3,   // bishop
  'r': 5,   // rook
  'q': 9,   // queen
  'k': 0    // king (infinite value)
}

// Parse FEN string to get board state
export function parseFEN(fen: string): string[][] {
  const parts = fen.split(' ')
  const boardPart = parts[0]
  const rows = boardPart.split('/')
  
  const board: string[][] = []
  
  for (let row = 0; row < 8; row++) {
    board[row] = []
    let col = 0
    for (let char of rows[row]) {
      if (/\d/.test(char)) {
        // Empty squares
        for (let i = 0; i < parseInt(char); i++) {
          board[row][col] = ''
          col++
        }
      } else {
        // Piece
        board[row][col] = char
        col++
      }
    }
  }
  
  return board
}

// Get piece at position
export function getPieceAtPosition(fen: string, square: string): string {
  const board = parseFEN(fen)
  const file = square.charCodeAt(0) - 97 // 'a' = 0
  const rank = 8 - parseInt(square[1])
  
  if (rank >= 0 && rank < 8 && file >= 0 && file < 8) {
    return board[rank][file] || ''
  }
  return ''
}

// Get legal moves for a piece
export function getLegalMoves(fen: string, square: string): string[] {
  // This is a simplified version - in a real implementation,
  // you'd use a chess engine like Stockfish
  const piece = getPieceAtPosition(fen, square)
  if (!piece) return []
  
  const moves: string[] = []
  const board = parseFEN(fen)
  
  // Simplified move generation for basic pieces
  switch (piece.toLowerCase()) {
    case 'p': // pawn
      const direction = piece === 'p' ? 1 : -1
      const startRank = piece === 'p' ? 1 : 6
      const file = square.charCodeAt(0) - 97
      const rank = 8 - parseInt(square[1])
      
      // Forward move
      if (rank + direction >= 0 && rank + direction < 8 && !board[rank + direction][file]) {
        moves.push(`${square}${String.fromCharCode(97 + file)}${8 - (rank + direction)}`)
      }
      break
      
    case 'r': // rook
      // Horizontal and vertical moves
      const rookFile = square.charCodeAt(0) - 97
      const rookRank = 8 - parseInt(square[1])
      
      // Horizontal moves
      for (let f = 0; f < 8; f++) {
        if (f !== rookFile) {
          moves.push(`${square}${String.fromCharCode(97 + f)}${8 - rookRank}`)
        }
      }
      // Vertical moves
      for (let r = 0; r < 8; r++) {
        if (r !== rookRank) {
          moves.push(`${square}${String.fromCharCode(97 + rookFile)}${8 - r}`)
        }
      }
      break
      
    case 'n': // knight
      const knightFile = square.charCodeAt(0) - 97
      const knightRank = 8 - parseInt(square[1])
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ]
      
      for (const [df, dr] of knightMoves) {
        const newFile = knightFile + df
        const newRank = knightRank + dr
        if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
          moves.push(`${square}${String.fromCharCode(97 + newFile)}${8 - newRank}`)
        }
      }
      break
      
    case 'b': // bishop
      // Diagonal moves
      const bishopFile = square.charCodeAt(0) - 97
      const bishopRank = 8 - parseInt(square[1])
      
      for (let i = 1; i < 8; i++) {
        const directions = [[i, i], [i, -i], [-i, i], [-i, -i]]
        for (const [df, dr] of directions) {
          const newFile = bishopFile + df
          const newRank = bishopRank + dr
          if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
            moves.push(`${square}${String.fromCharCode(97 + newFile)}${8 - newRank}`)
          }
        }
      }
      break
      
    case 'q': // queen (combination of rook and bishop)
      // Simplified - just return some basic moves
      const queenFile = square.charCodeAt(0) - 97
      const queenRank = 8 - parseInt(square[1])
      
      for (let f = 0; f < 8; f++) {
        for (let r = 0; r < 8; r++) {
          if (f !== queenFile || r !== queenRank) {
            moves.push(`${square}${String.fromCharCode(97 + f)}${8 - r}`)
          }
        }
      }
      break
      
    case 'k': // king
      const kingFile = square.charCodeAt(0) - 97
      const kingRank = 8 - parseInt(square[1])
      
      for (let df = -1; df <= 1; df++) {
        for (let dr = -1; dr <= 1; dr++) {
          if (df === 0 && dr === 0) continue
          const newFile = kingFile + df
          const newRank = kingRank + dr
          if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
            moves.push(`${square}${String.fromCharCode(97 + newFile)}${8 - newRank}`)
          }
        }
      }
      break
  }
  
  return moves
}

// Fetch daily puzzle from Lichess
export async function fetchDailyPuzzle(): Promise<ChessProblem> {
  try {
    const response = await fetch(PUZZLE_API)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      id: data.puzzle.id,
      fen: data.puzzle.fen,
      moves: data.puzzle.moves.split(' '),
      rating: data.puzzle.rating,
      themes: data.puzzle.themes || [],
      gameUrl: data.game.url,
      solution: data.puzzle.moves.split(' ')
    }
  } catch (error) {
    console.error('Error fetching daily puzzle:', error)
    // Return a fallback puzzle
    return getFallbackPuzzle()
  }
}

// Fetch random puzzle from Lichess
export async function fetchRandomPuzzle(): Promise<ChessProblem> {
  try {
    const response = await fetch(PUZZLE_RANDOM)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      id: data.puzzle.id,
      fen: data.puzzle.fen,
      moves: data.puzzle.moves.split(' '),
      rating: data.puzzle.rating,
      themes: data.puzzle.themes || [],
      gameUrl: data.game.url,
      solution: data.puzzle.moves.split(' ')
    }
  } catch (error) {
    console.error('Error fetching random puzzle:', error)
    return getFallbackPuzzle()
  }
}

// Get puzzle by difficulty level
export async function fetchPuzzleByLevel(level: number): Promise<ChessProblem> {
  // For now, return a fallback puzzle with increasing complexity
  // In a real implementation, you'd filter by rating
  return getFallbackPuzzle(level)
}

// Fallback puzzles for when API is unavailable
function getFallbackPuzzle(level: number = 1): ChessProblem {
  const fallbackPuzzles = [
    {
      id: 'fallback-1',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      moves: ['e2e4'],
      rating: 1000,
      themes: ['opening'],
      gameUrl: '',
      solution: ['e2e4']
    },
    {
      id: 'fallback-2',
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
      moves: ['d2d4'],
      rating: 1200,
      themes: ['opening', 'development'],
      gameUrl: '',
      solution: ['d2d4']
    },
    {
      id: 'fallback-3',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1',
      moves: ['c2c4'],
      rating: 1400,
      themes: ['opening', 'center-control'],
      gameUrl: '',
      solution: ['c2c4']
    },
    {
      id: 'fallback-4',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1',
      moves: ['b1c3'],
      rating: 1600,
      themes: ['development', 'knight'],
      gameUrl: '',
      solution: ['b1c3']
    },
    {
      id: 'fallback-5',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1',
      moves: ['f1c4'],
      rating: 1800,
      themes: ['development', 'bishop'],
      gameUrl: '',
      solution: ['f1c4']
    }
  ]
  
  const index = Math.min(level - 1, fallbackPuzzles.length - 1)
  return fallbackPuzzles[index]
}

// Analyze position and get best moves
export function analyzePosition(fen: string): ChessPosition {
  const board = parseFEN(fen)
  const legalMoves: string[] = []
  
  // Generate all legal moves (simplified)
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file]
      if (piece && piece === piece.toUpperCase()) { // White pieces
        const square = `${String.fromCharCode(97 + file)}${8 - rank}`
        const moves = getLegalMoves(fen, square)
        legalMoves.push(...moves)
      }
    }
  }
  
  // Simple evaluation (count material)
  let evaluation = 0
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file]
      if (piece) {
        const value = PIECE_VALUES[piece.toLowerCase() as keyof typeof PIECE_VALUES] || 0
        evaluation += piece === piece.toUpperCase() ? value : -value
      }
    }
  }
  
  return {
    fen,
    legalMoves,
    evaluation,
    bestMove: legalMoves[0] || '',
    pieceToMove: 'e2', // Default to e2 for pawn
    position: 'opening'
  }
}

// Get piece name from FEN character
export function getPieceName(fenChar: string): string {
  const pieceNames: { [key: string]: string } = {
    'P': 'White Pawn',
    'N': 'White Knight',
    'B': 'White Bishop',
    'R': 'White Rook',
    'Q': 'White Queen',
    'K': 'White King',
    'p': 'Black Pawn',
    'n': 'Black Knight',
    'b': 'Black Bishop',
    'r': 'Black Rook',
    'q': 'Black Queen',
    'k': 'Black King'
  }
  return pieceNames[fenChar] || 'Unknown'
}

// Get piece icon (Unicode chess symbols)
export function getPieceIcon(fenChar: string): string {
  const pieceIcons: { [key: string]: string } = {
    'P': '♙',
    'N': '♘',
    'B': '♗',
    'R': '♖',
    'Q': '♕',
    'K': '♔',
    'p': '♟',
    'n': '♞',
    'b': '♝',
    'r': '♜',
    'q': '♛',
    'k': '♚'
  }
  return pieceIcons[fenChar] || '?'
} 