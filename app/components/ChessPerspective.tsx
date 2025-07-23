'use client'

import React, { useState } from 'react'

export default function ChessPerspective() {
  const [perspective, setPerspective] = useState<'piece' | 'player'>('piece')

  return (
    <div className="scenario-card">
      <h3 className="text-2xl font-bold mb-6 text-center text-god-gold">
        Chess Perspective Challenge
      </h3>
      
      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setPerspective('piece')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              perspective === 'piece' 
                ? 'bg-human-blue text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Piece Perspective
          </button>
          <button
            onClick={() => setPerspective('player')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              perspective === 'player' 
                ? 'bg-collective-purple text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Player Perspective
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-3 text-human-blue">
            {perspective === 'piece' ? 'As a Chess Piece' : 'As a Chess Player'}
          </h4>
          
          <div className="bg-gray-800 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {perspective === 'piece' ? (
              <div className="text-center">
                <div className="text-4xl mb-2">♟️</div>
                <p className="text-sm text-gray-300">
                  You are a pawn on the board.<br/>
                  You can only see the squares around you.<br/>
                  Your goal: Advance and survive.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">👁️</div>
                <p className="text-sm text-gray-300">
                  You see the entire board.<br/>
                  You control all your pieces.<br/>
                  Your goal: Checkmate the opponent.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-3 text-collective-purple">
            Strategic Decision
          </h4>
          
          <div className="bg-gray-800 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {perspective === 'piece' ? (
              <div className="space-y-3">
                <button className="choice-button bg-gradient-to-r from-red-600 to-red-700 text-white w-full">
                  Advance Aggressively
                </button>
                <button className="choice-button bg-gradient-to-r from-green-600 to-green-700 text-white w-full">
                  Play Defensively
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Limited information, high risk/reward
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button className="choice-button bg-gradient-to-r from-blue-600 to-blue-700 text-white w-full">
                  Control the Center
                </button>
                <button className="choice-button bg-gradient-to-r from-purple-600 to-purple-700 text-white w-full">
                  Develop Pieces
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Full information, strategic planning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h5 className="text-center font-semibold mb-2 text-god-gold">
          Perspective Impact
        </h5>
        <p className="text-sm text-gray-300 text-center">
          {perspective === 'piece' 
            ? 'Limited perspective forces instinctive, high-risk decisions'
            : 'Full perspective enables calculated, strategic planning'
          }
        </p>
      </div>
    </div>
  )
} 