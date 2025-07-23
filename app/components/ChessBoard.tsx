'use client'

import React, { useState } from 'react'
import { getChessPieceIcon, validateChessMove } from '../../lib/levelLoader'
import { logError, logWarn, logInfo, logDebug, ErrorCategories } from '../../lib/errorHandler'

interface ChessBoardProps {
  boardState: string
  availableMoves: string[]
  onMoveSelect: (move: string) => void
  selectedMove?: string
}

export default function ChessBoard({ boardState, availableMoves, onMoveSelect, selectedMove }: ChessBoardProps) {
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Parse FEN board state (simplified - just the piece placement part)
  const parseFEN = (fen: string) => {
    try {
      logInfo('Parsing FEN board state', ErrorCategories.UI_RENDERING, { fen })
      
      const parts = fen.split(' ')
      const piecePlacement = parts[0]
      const rows = piecePlacement.split('/')
      
      if (rows.length !== 8) {
        throw new Error('Invalid FEN: must have 8 rows')
      }
      
      const board: string[][] = []
      for (const row of rows) {
        const boardRow: string[] = []
        for (const char of row) {
          if (/\d/.test(char)) {
            // Empty squares
            const count = parseInt(char)
            if (count < 1 || count > 8) {
              throw new Error(`Invalid FEN: invalid number ${count}`)
            }
            for (let i = 0; i < count; i++) {
              boardRow.push('')
            }
          } else {
            // Piece
            boardRow.push(char)
          }
        }
        
        if (boardRow.length !== 8) {
          throw new Error(`Invalid FEN: row must have 8 squares, got ${boardRow.length}`)
        }
        board.push(boardRow)
      }
      
      logInfo('FEN parsing successful', ErrorCategories.UI_RENDERING, { boardSize: board.length })
      return board
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown FEN parsing error'
      logError('Failed to parse FEN', ErrorCategories.UI_RENDERING, { error, fen })
      setError(`Board parsing error: ${errorMessage}`)
      return Array(8).fill(Array(8).fill(''))
    }
  }

  const board = parseFEN(boardState)
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

  const getPieceDisplay = (piece: string): string => {
    try {
      const pieceMap: { [key: string]: string } = {
        'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
        'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
      }
      const display = pieceMap[piece] || ''
      logDebug('Got piece display', ErrorCategories.UI_RENDERING, { piece, display })
      return display
    } catch (error) {
      logError('Failed to get piece display', ErrorCategories.UI_RENDERING, { error, piece })
      return ''
    }
  }

  const getSquareColor = (fileIndex: number, rankIndex: number) => {
    const isLight = (fileIndex + rankIndex) % 2 === 0
    return isLight ? 'bg-amber-100' : 'bg-amber-800'
  }

  const getSquareName = (fileIndex: number, rankIndex: number) => {
    return `${files[fileIndex]}${ranks[rankIndex]}`
  }

  const isMoveAvailable = (square: string) => {
    return availableMoves.some(move => move.startsWith(square) || move.endsWith(square))
  }

  const isSelectedMove = (square: string) => {
    return selectedMove && (selectedMove.startsWith(square) || selectedMove.endsWith(square))
  }

  const handleSquareClick = (square: string) => {
    // Find moves that start or end with this square
    const moves = availableMoves.filter(move => 
      move.startsWith(square) || move.endsWith(square)
    )
    
    if (moves.length > 0) {
      // For simplicity, just select the first available move
      onMoveSelect(moves[0])
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-xl font-bold text-god-gold mb-2">Chess Position</div>
      
      <div className="border-4 border-gray-800 rounded-lg overflow-hidden">
        {/* File labels */}
        <div className="flex bg-gray-700 text-white text-sm">
          <div className="w-8"></div>
          {files.map(file => (
            <div key={file} className="w-12 h-6 flex items-center justify-center font-bold">
              {file}
            </div>
          ))}
        </div>
        
        {/* Board */}
        <div className="flex">
          {/* Rank labels */}
          <div className="flex flex-col bg-gray-700 text-white text-sm">
            {ranks.map(rank => (
              <div key={rank} className="w-8 h-12 flex items-center justify-center font-bold">
                {rank}
              </div>
            ))}
          </div>
          
          {/* Chess squares */}
          <div className="grid grid-cols-8">
            {board.map((row: string[], rankIndex: number) =>
              row.map((piece: string, fileIndex: number) => {
                const square = getSquareName(fileIndex, rankIndex)
                const isLight = getSquareColor(fileIndex, rankIndex).includes('100')
                const isAvailable = isMoveAvailable(square)
                const isSelected = isSelectedMove(square)
                const isHovered = hoveredSquare === square
                
                let bgColor = getSquareColor(fileIndex, rankIndex)
                if (isSelected) bgColor = 'bg-blue-500'
                else if (isHovered) bgColor = 'bg-yellow-400'
                else if (isAvailable) bgColor = isLight ? 'bg-green-200' : 'bg-green-700'
                
                return (
                  <div
                    key={square}
                    className={`w-12 h-12 flex items-center justify-center text-2xl cursor-pointer border border-gray-600 ${bgColor} transition-colors`}
                    onClick={() => handleSquareClick(square)}
                    onMouseEnter={() => setHoveredSquare(square)}
                    onMouseLeave={() => setHoveredSquare(null)}
                  >
                    {getPieceDisplay(piece)}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Move information */}
      {selectedMove && (
        <div className="text-center">
          <div className="text-lg font-semibold text-collective-purple">
            Selected Move: {selectedMove}
          </div>
          <div className="text-sm text-gray-400">
            {availableMoves.length} legal moves available
          </div>
        </div>
      )}
      
      {/* Available moves list */}
      <div className="max-w-md">
        <div className="text-sm font-semibold text-gray-300 mb-2">Available Moves:</div>
        <div className="grid grid-cols-4 gap-2">
          {availableMoves.map(move => (
            <button
              key={move}
              onClick={() => onMoveSelect(move)}
              className={`px-2 py-1 text-xs rounded ${
                selectedMove === move 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {move}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 