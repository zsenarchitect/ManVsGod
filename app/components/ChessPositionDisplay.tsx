'use client'

import React from 'react'
import { parseFEN, getPieceIcon, getPieceName, analyzePosition } from '../../lib/chessApi'
import { logError, logInfo, ErrorCategories } from '../../lib/errorHandler'

interface ChessPositionDisplayProps {
  fen: string
  pieceToMove?: string
  onMoveSelect?: (move: string) => void
  selectedMove?: string
}

export default function ChessPositionDisplay({ 
  fen, 
  pieceToMove, 
  onMoveSelect, 
  selectedMove 
}: ChessPositionDisplayProps) {
  const [board, setBoard] = React.useState<string[][]>([])
  const [analysis, setAnalysis] = React.useState<any>(null)
  const [legalMoves, setLegalMoves] = React.useState<string[]>([])

  React.useEffect(() => {
    try {
      logInfo('Parsing FEN for chess display', ErrorCategories.UI_RENDERING, { fen })
      const parsedBoard = parseFEN(fen)
      setBoard(parsedBoard)
      
      // Analyze position
      const positionAnalysis = analyzePosition(fen)
      setAnalysis(positionAnalysis)
      setLegalMoves(positionAnalysis.legalMoves)
      
      logInfo('Chess position loaded successfully', ErrorCategories.UI_RENDERING, { 
        fen, 
        legalMoves: positionAnalysis.legalMoves.length 
      })
    } catch (error) {
      logError('Failed to parse FEN for chess display', ErrorCategories.UI_RENDERING, { error, fen })
    }
  }, [fen])

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
  }

  const getSquareLabel = (row: number, col: number) => {
    const file = String.fromCharCode(97 + col) // a-h
    const rank = 8 - row // 8-1
    return `${file}${rank}`
  }

  const handleSquareClick = (row: number, col: number) => {
    const square = getSquareLabel(row, col)
    const piece = board[row][col]
    
    if (piece && piece === piece.toUpperCase()) { // White pieces only
      logInfo('Square clicked', ErrorCategories.UI_RENDERING, { square, piece })
      
      // Find moves for this piece
      const movesForPiece = legalMoves.filter(move => move.startsWith(square))
      if (movesForPiece.length > 0 && onMoveSelect) {
        onMoveSelect(movesForPiece[0])
      }
    }
  }

  const isSquareHighlighted = (row: number, col: number) => {
    if (!selectedMove) return false
    const square = getSquareLabel(row, col)
    return selectedMove.startsWith(square) || selectedMove.endsWith(square)
  }

  const getMoveDescription = (move: string) => {
    const from = move.substring(0, 2)
    const to = move.substring(2, 4)
    const piece = board[8 - parseInt(from[1])][from.charCodeAt(0) - 97]
    const pieceName = getPieceName(piece)
    
    return `${pieceName} from ${from} to ${to}`
  }

  return (
    <div className="space-y-6">
      {/* Chess Board */}
      <div className="scenario-card">
        <h3 className="text-xl font-bold text-god-gold mb-4">Chess Position</h3>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-8 gap-0 border-2 border-gray-600">
            {board.map((row, rowIndex) => (
              row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-12 h-12 flex items-center justify-center text-2xl font-bold cursor-pointer
                    ${getSquareColor(rowIndex, colIndex)}
                    ${isSquareHighlighted(rowIndex, colIndex) ? 'ring-2 ring-blue-500 ring-opacity-75' : ''}
                    ${piece && piece === piece.toUpperCase() ? 'hover:bg-blue-200' : ''}
                    transition-all duration-200
                  `}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  title={`${getSquareLabel(rowIndex, colIndex)}${piece ? ` - ${getPieceName(piece)}` : ''}`}
                >
                  {piece && getPieceIcon(piece)}
                </div>
              ))
            ))}
          </div>
        </div>
        
        {/* Position Analysis */}
        {analysis && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Evaluation:</span>
                <span className={`ml-2 font-bold ${analysis.evaluation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {analysis.evaluation > 0 ? '+' : ''}{analysis.evaluation}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Legal Moves:</span>
                <span className="ml-2 font-bold text-white">{legalMoves.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Best Move:</span>
                <span className="ml-2 font-bold text-god-gold">{analysis.bestMove}</span>
              </div>
              <div>
                <span className="text-gray-400">Position:</span>
                <span className="ml-2 font-bold text-white">{analysis.position}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Moves */}
      {legalMoves.length > 0 && (
        <div className="scenario-card">
          <h3 className="text-lg font-bold text-god-gold mb-4">Available Moves</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {legalMoves.slice(0, 8).map((move, index) => (
              <button
                key={move}
                onClick={() => onMoveSelect?.(move)}
                className={`
                  p-3 text-left rounded-lg transition-all duration-200
                  ${selectedMove === move 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                <div className="font-mono text-sm">{move}</div>
                <div className="text-xs opacity-75">{getMoveDescription(move)}</div>
              </button>
            ))}
          </div>
          {legalMoves.length > 8 && (
            <p className="text-sm text-gray-400 mt-2">
              ... and {legalMoves.length - 8} more moves
            </p>
          )}
        </div>
      )}

      {/* FEN Display */}
      <div className="scenario-card">
        <h3 className="text-lg font-bold text-god-gold mb-2">Position (FEN)</h3>
        <div className="bg-gray-700 p-3 rounded font-mono text-sm break-all">
          {fen}
        </div>
      </div>
    </div>
  )
} 